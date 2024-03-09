import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ContentComponent } from '../content/content.component';
import { TextEditorService } from '../text-editor.service';
import { FormsModule } from '@angular/forms';
import { last } from 'rxjs';

let indexNull = 0;
let indexBold = 0;
let indexBreak = 0;
let newRangeBoldText = false;
let creatingNewElement = true;

interface ITextState {
  null: boolean;
  bold: boolean;
  italic: boolean;
  underline: boolean;
}

//it defines proper ID for new null element by checking previous  null elements' IDs

function createRange(
  node: Node,
  chars: { count: number },
  range?: Range,
): Range {
  if (!range) {
    range = document.createRange();
    range.selectNode(node);
    range.setStart(node, 0);
  }

  if (chars.count === 0) {
    range.setEnd(node, chars.count);
  } else if (node && chars.count > 0) {
    if (node.nodeType === Node.TEXT_NODE) {
      if ((node as Text).textContent!.length < chars.count) {
        chars.count -= (node as Text).textContent!.length;
      } else {
        range.setEnd(node, chars.count);
        chars.count = 0;
      }
    } else {
      for (let lp = 0; lp < node.childNodes.length; lp++) {
        range = createRange(node.childNodes[lp], chars, range);

        if (chars.count === 0) {
          break;
        }
      }
    }
  }

  return range;
}

function isChildOf(node: Node | null, parentId: string): boolean {
  while (node !== null) {
    if (node instanceof Element && node.id === parentId) {
      return true;
    }
    node = node.parentNode;
  }

  return false;
}

function getCurrentCursorPosition(parentId: string): number {
  const selection = window.getSelection();
  let charCount = -1;
  let node: Node | null;

  if (selection?.focusNode) {
    if (isChildOf(selection.focusNode, parentId)) {
      node = selection.focusNode;
      charCount = selection.focusOffset;

      while (node) {
        if (node instanceof Element && node.id === parentId) {
          break;
        }

        if (node.previousSibling) {
          node = node.previousSibling;
          if (node instanceof Text) {
            // @ts-ignore
            charCount += node.textContent.length;
          }
        } else {
          node = node.parentNode;
          if (node === null) {
            break;
          }
        }
      }
    }
  }

  return charCount;
}

function setCurrentCursorPosition(chars: number, element: any): void {
  if (chars >= 0) {
    const selection = window.getSelection();
    const range = createRange(element!.parentNode!, { count: chars });

    if (range) {
      console.log(range);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }
}

function updateRange(className: string) {
  const selection = window.getSelection();
  console.log(selection);
  const range = document.createRange();
  const element1 = document.getElementsByClassName(className)[0];
  console.log(element1);
  selection?.removeAllRanges();
  range.setStart(element1, 0);
  range.setEnd(element1, 1);
  selection.addRange(range);
  console.log(range);
}

function getNode() {
  const selection = window.getSelection();
  console.log(selection);
  const node = selection.focusNode.parentElement;
  console.log(node);
  return node;
}

@Component({
  selector: 'app-text-area',
  standalone: true,
  imports: [ContentComponent, FormsModule],
  templateUrl: './text-area.component.html',
  styleUrl: './text-area.component.css',
})
export class TextAreaComponent {
  @ViewChild('fake_textarea') public textEditor: ElementRef | undefined;
  private states: ITextState = {
    null: true,
    bold: false,
    italic: false,
    underline: false,
  };
  public htmlContent = '';
  private posistion: number = 0;

  text: string = '';
  value: string = '';

  editor = this.textEditor.nativeElement;
  constructor(private textEditorService: TextEditorService) {}

  applyStateToSelectedText(text: string, state: string) {
    console.log('apply state to selected text');
    const formattedText = `<strong class="bold ${indexBold}">${text}</strong>`;
    document.execCommand('insertHTML', false, formattedText);
  }
  handleSelection() {
    console.log('handle selection');
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);
    console.log('handle Selection', selection, range);
    const selectedText = selection?.toString();
    if (selectedText) {
      console.log(selectedText);
      if (this.states.bold) {
        return this.applyStateToSelectedText(selectedText, 'bold');
      }

      if (this.states.null) {
        return this.applyStateToSelectedText(selectedText, 'null');
      }
    }
  }

  handleClick(event: Event) {
    console.log('click');
    let newElement = false;
    const selection = window.getSelection();
    const range: Range = selection?.getRangeAt(0);
    const element = this.getClassElementFromRange(range!);
    const length = range.endContainer.textContent?.length;
    const endOffSet = range.endOffset;
    console.log(this.states);
    console.log(range);

    if (length === endOffSet) {
      newElement = true;
    }

    if (element) {
      if (element.split(' ')[0] === 'bold') {
        if (!this.states.bold && !newElement) {
          console.log('setting null text');
          return this.textEditorService.setBold();
        }

        if (this.states.bold && newElement) {
          return;
        }
      }

      if (element.split(' ')[0] === 'null') {
        console.log(this.states);
        if (!this.states.null && !newElement) {
          return this.textEditorService.setNull();
        }

        if (this.states.null && newElement) {
          return;
        }

        return;
      }
    }
  }

  onKeyChange(event: KeyboardEvent) {
    console.log(event.key);
    if (!this.textEditor) return;

    const editor = this.textEditor.nativeElement;
    // const selection = window.getSelection();
    // if (!selection) return;

    if (event.key === 'Enter') {
      console.log('hitting enter');
      const container = document.createElement('div');
      container.classList.add('breakContainer');
      const element = document.createElement('br');
      element.classList.add('break');
      element.classList.add(`${indexBreak}`);
      container.appendChild(element);

      const selection = window.getSelection();
      const range: Range = selection?.getRangeAt(0);
      const previousElement = this.getClassElementFromRange(range!);

      if (!previousElement) {
        editor.appendChild(container);
        indexBreak += 1;
        return;
      }
      console.log(previousElement);
      const length = range.endContainer.textContent?.length;
      const endOffSet = range.endOffset;
      console.log(length, endOffSet);

      if (length > endOffSet) {
        range.insertNode(container);
        event.preventDefault();
        indexBreak += 1;
        return;
      }

      if (length === endOffSet) {
        const editor = this.textEditor.nativeElement;
        let node = editor;
        let newRange = document.createRange();
        let numberOfBreaks = 0;
        const foundElement =
          document.getElementsByClassName(previousElement)[0];
        foundElement.insertAdjacentElement('afterend', container);
        console.log('found element', foundElement);
        newRange.selectNode(editor);
        console.log(newRange);
        console.log(node);
        let nodeList = newRange.endContainer.childNodes;
        let length = nodeList.length;

        if (length === 1) {
          node = nodeList[0];
          nodeList = node.childNodes;
          length = nodeList.length;
          console.log(nodeList);
        }

        let count = 0;

        while (length > count) {
          if (nodeList[count].nodeName === 'DIV') {
            const element = nodeList[count] as HTMLElement;
            console.log(element);
            if (element.className == 'breakContainer') {
              console.log('found br');
              numberOfBreaks += 1;
              console.log('found br');
              node = element;
            }
          }
          count += 1;
        }
        const selection = window.getSelection();
        selection?.removeAllRanges();
        newRange.setEnd(node, 0);
        newRange.setStart(node, 0);
        console.log(newRange);
        selection?.addRange(newRange);

        console.log('number of breaks: ', numberOfBreaks, 'lastNode:', node);

        // while (stack.length > 0) {
        //   if (node.nodeName === 'BR') {
        //     console.log('found br');
        //     numberOfBreaks += 1;
        //   } else {
        //     console.log(node.firstChild)
        //     stack.push(node.firstChild);
        //   }
        // }

        // node = node.endContainer.lastChild

        // while (!node=== null) {
        //   console.log('last child', node);
        //   if (node.nodeName === 'BR') {
        //     console.log('found br');
        //     numberOfBreaks += 1;
        //   } else {
        //     node = node.firstChild
        //   }
        //
        //
        // }
      }

      event.preventDefault();
      return;
    }

    if (this.states.bold) {
      this.handleBold(editor, event.key, indexBold);
    }

    if (this.states.null) {
      const editor1 = document.getElementById('fake_textarea');
      this.handleNull(editor1, event.key, indexNull);
    }
  }

  handleBold(editor: HTMLElement, key: string, indexBold: number) {
    const boldClassName = `bold`;
    const sel = window.getSelection();
    const range = sel.getRangeAt(0);
    const element = this.getClassElementFromRange(range);
    console.log(element);
    const className = element.split(' ');

    if (element) {
      if (className[0] !== 'bold') {
        const element: HTMLElement = getNode();
        const boldTextElement = this.createAndInsertElement(
          'strong',
          boldClassName,
          indexBold,
        );
        boldTextElement.innerHTML = key;
        console.log(boldTextElement);
        element.insertAdjacentElement('afterend', boldTextElement);
        updateRange(`bold ${indexBold}`);
        // creatingNewElement = false;
      } else {
        return;
      }
    } else {
      const boldTextElement = this.createAndInsertElement(
        'strong',
        boldClassName,
        indexBold,
      );
      boldTextElement.innerHTML = key;
      editor.appendChild(boldTextElement);
      updateRange('fake_textarea');
      return;
    }
  }

  handleNull(editor: HTMLElement, key: string, indexNull: number) {
    console.log('handle null evenet');
    const nullClassName = `null`;
    const sel = window.getSelection();
    const range = sel.getRangeAt(0);
    const element = this.getClassElementFromRange(range);
    console.log(element);
    const className = element.split(' ');
    console.log(className[0]);

    if (element) {
      if (className[0] !== 'null') {
        const element: HTMLElement = getNode();
        console.log(element);
        if (className[0] === 'br') {
          console.log('xDDD');
          this.setNewNullId();
        }
        const nullTextElement = this.createAndInsertElement(
          'span',
          nullClassName,
          indexNull,
        );
        nullTextElement.innerHTML = key;
        console.log(nullTextElement);
        element.insertAdjacentElement('afterend', nullTextElement);
        updateRange(`null ${indexNull}`);
        creatingNewElement = false;
        return;
      } else {
        console.log('null element already exists');
      }
    } else {
      const nullTextElement = this.createAndInsertElement(
        'span',
        nullClassName,
        indexNull,
      );
      nullTextElement.innerHTML = key;
      editor.appendChild(nullTextElement);
      updateRange('fake_textarea');
      creatingNewElement = false;
      return;
    }
  }

  getClassElementFromRange(range: Range): string | null {
    console.log(range);
    if (range.startContainer.childNodes.length > 0) {
      let endNode;
      let startChildNode: NodeListOf<ChildNode> =
        range.startContainer.childNodes;
      if (startChildNode.length > 0) {
        if (range.startContainer.childNodes[0].nodeName === 'BR') {
          endNode = 'br';
          return endNode;
        }
        //ts-ignore
        endNode = range.startContainer.childNodes[0].lastChild;
      }

      if (endNode) {
        console.log(endNode.className);
        return endNode;
      }
    } else {
      if (range.startContainer.parentElement) {
        return range.startContainer.parentElement.attributes[0].nodeValue;
      }
    }
    return null;
  }

  createAndInsertElement(
    tagName: string,
    className: string,
    index: number,
  ): HTMLElement {
    const element = document.createElement(tagName);
    element.classList.add(className);
    element.classList.add(`${index}`);
    return element;
  }

  updateCursorPosition(editor: HTMLElement, cursorAtSamePosistion: number) {
    const currentPosition = getCurrentCursorPosition('fake_textarea');
    setCurrentCursorPosition(currentPosition + cursorAtSamePosistion, editor);
    editor.focus();
  }

  setNewNullId() {
    const range = document.createRange();
    const selection = window.getSelection();
    const node = this.editor;
    range.selectNode(node);
  }

  ngOnInit() {
    this.textEditorService.notifyBoldTextChange.subscribe((value: IState) => {
      if (value.values.includes('bold')) {
        this.states.bold = true;
        this.states.null = false;
        newRangeBoldText = true;
        indexNull += 1;
      } else {
        this.states.bold = false;
      }
    });

    this.textEditorService.notifyNullTextChange.subscribe((value: IState) => {
      if (value.values.includes('null')) {
        this.states.null = true;
        this.states.bold = false;
        indexBold += 1;
      } else {
        this.states.null = false;
      }
    });
  }

  protected readonly onchange = onchange;
}
