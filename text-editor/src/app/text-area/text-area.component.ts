import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ContentComponent } from '../content/content.component';
import { TextEditorService } from '../text-editor.service';
import { FormsModule } from '@angular/forms';
import { last } from 'rxjs';

let indexNull = 0;
let prevIndexNull = 0;
let indexBold = 0;
let newRangeBoldText = false;
let newRangeNullText = false;

interface ITextState {
  null: boolean;
  bold: boolean;
  italic: boolean;
  underline: boolean;
}

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
  constructor(private textEditorService: TextEditorService) {}

  onKeyChange(event: KeyboardEvent) {
    console.log(this.states);
    if (!this.textEditor) return;

    const editor = this.textEditor.nativeElement;
    const selection = window.getSelection();
    if (!selection) return;

    const range = selection.getRangeAt(0);
    if (!range) return;

    if (this.states.bold) {
      this.handleBold(range, editor, event.key, indexBold);
    }

    if (this.states.null) {
      this.handleNull(range, editor, event.key, indexNull);
    }
  }

  handleBold(
    range: Range,
    editor: HTMLElement,
    key: string,
    indexBold: number,
  ) {
    const boldClassName = `bold`;
    let createNewElement = false;
    let addditionalPosistion = 1;

    let classElement = this.getClassElementFromRange(range);
    if (!classElement) {
      const boldTextElement = this.createAndInsertElement(
        'strong',
        boldClassName,
        indexBold,
      );
      editor.appendChild(boldTextElement);
      addditionalPosistion = 2;

      this.updateCursorPosition(editor, addditionalPosistion);
      return;
    }

    const element = document.getElementsByClassName(`${classElement}`)[0];
    if (!(classElement === `${boldClassName} ${indexBold}`)) {
      if (
        classElement.split(' ')[0] === 'bold' &&
        classElement.split(' ')[1] !== `${indexBold}`
      ) {
        console.log(
          `we have already span element with bold class ${classElement}`,
        );
      } else {
        console.log(`adding new element with new class ${classElement}`);
        createNewElement = true;
      }
    }

    if (element && createNewElement) {
      const boldTextElement = this.createAndInsertElement(
        'strong',
        boldClassName,
        indexBold,
      );
      boldTextElement.innerHTML = key;
      element.insertAdjacentElement('afterend', boldTextElement);
      // this.updateCursorPosition(editor, 2);
    }

    if (element && !createNewElement) {
      return;
    }
  }

  handleNull(
    range: Range,
    editor: HTMLElement,
    key: string,
    indexNull: number,
  ) {
    const nullClassName = `null`;
    let createNewElement = false;
    let cursorAtSamePosistion = 1;
    let element;

    let classElement: string | null = this.getClassElementFromRange(range);
    if (!classElement) {
      const nullTextElement = this.createAndInsertElement(
        'span',
        nullClassName,
        indexNull,
      );
      nullTextElement.innerHTML = key;
      editor.appendChild(nullTextElement);
      cursorAtSamePosistion = 0;
      this.updateCursorPosition(editor, cursorAtSamePosistion + 1);
      return;
    }

    element = document.getElementsByClassName(`${classElement}`)[0];
    if (!(classElement === `${nullClassName} ${indexNull}`)) {
      if (
        classElement.split(' ')[0] === 'null' &&
        classElement.split(' ')[1] !== `${indexNull}`
      ) {
        console.log(
          `we have already span element with null class ${classElement}`,
        );
      } else {
        console.log(`adding new element with new class ${classElement}`);
        createNewElement = true;
      }
    }

    if (element && createNewElement) {
      console.log('new null element');
      const nullTextElement = this.createAndInsertElement(
        'span',
        nullClassName,
        indexNull,
      );
      nullTextElement.innerHTML = key;
      console.log('this is null elemenet ', element);
      console.log('this is null range ', range);
      element.insertAdjacentElement('afterend', nullTextElement);
      // this.updateCursorPosition(editor, 0);
    }

    if (element && !createNewElement) {
      console.log(element.childNodes[0]);
      // element.childNodes[0].nodeValue += `${key}`;
      console.log(range);
      const posistion = getCurrentCursorPosition('fake_textarea');
      // setCurrentCursorPosition(range.startOffset, editor);
      return;
    }
  }

  getClassElementFromRange(range: Range): string | any {
    console.log(range);
    if (range.startContainer.childNodes.length > 0) {
      let endNode;
      let startChildNode: NodeListOf<ChildNode> =
        range.startContainer.childNodes;
      if (startChildNode.length > 0) {
        // @ts-ignore
        endNode = range.startContainer.childNodes[0].lastChild.className;
      }

      if (endNode) {
        console.log(endNode);
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
