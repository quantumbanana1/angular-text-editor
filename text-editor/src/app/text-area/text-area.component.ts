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
      range.collapse(true);
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
    if (this.textEditor) {
      const editor = this.textEditor.nativeElement;
      console.log(editor!.parentNode!);
      // const selection = window.getSelection();
      // // const range = selection?.getRangeAt(0);
      // const newRange = document.createRange();

      if (this.states.bold) {
        let boldText;
        const getBoldElement = document.getElementsByClassName(
          `bold ${indexBold}`,
        );
        console.log(getBoldElement);
        if (getBoldElement.length === 0) {
          boldText = document.createElement('strong');
          boldText.classList.add(`bold`);
          boldText.classList.add(`${indexBold}`);

          if (true) {
            const getNullElement = document.getElementsByClassName(
              `null ${indexNull - 1}`,
            );
            if (getNullElement.length > 0) {
              console.log('adjacent');
              // const newRange = document.createRange();
              // boldText.innerText = `${event.key}`;
              boldText.innerHTML = `${event.key}`;
              getNullElement[0].insertAdjacentElement('afterend', boldText);
              console.log(editor.childNodes);
              console.log(boldText);
              const curretPosition = getCurrentCursorPosition(editor);
              setCurrentCursorPosition(curretPosition + 1, editor);
              editor.focus();
              // const selection1 = window.getSelection();
              // newRange.setStart(editor.childNodes[1], 1);
              // newRange.collapse(true);
              // selection?.removeAllRanges();
              // selection?.addRange(newRange);
              // console.log('new position...');
            }
          }
        } else {
          console.log('tutaj tez to dziala');
          boldText = getBoldElement[0];
          // console.log(getCurrentCursorPosition('fake_textarea'));
          // newRangeNullText = true;
        }
      }

      if (this.states.null) {
        console.log(indexNull);
        let nullTextElement;
        const getNullElement = document.getElementsByClassName(
          `null ${indexNull}`,
        );

        console.log(getNullElement);
        console.log(getNullElement.length);
        if (getNullElement.length === 0) {
          nullTextElement = document.createElement(`span`);
          nullTextElement.classList.add(`null`);
          nullTextElement.classList.add(`${indexNull}`);
          console.log(nullTextElement);
          nullTextElement.innerHTML = `${event.key}`;
          if (indexNull === 0) {
            editor.appendChild(nullTextElement);
            const curretPosition = getCurrentCursorPosition('fake_textarea');
            setCurrentCursorPosition(curretPosition + 1, editor);
            // newRange.setStart(editor.childNodes[0], 1);
            // newRange.collapse(true);
            // selection?.removeAllRanges();
            // selection?.addRange(newRange);
            if (indexNull > 0) {
              console.log('adjacent');
              const getBoldElement = document.getElementsByClassName(
                `bold ${indexBold - 1}`,
              );
              if (getBoldElement.length > 0) {
                console.log('adjacent');
                getBoldElement[0].insertAdjacentElement(
                  'afterend',
                  nullTextElement,
                );
                console.log(editor.childNodes);
                const curretPosition =
                  getCurrentCursorPosition('fake_textarea');
                setCurrentCursorPosition(curretPosition + 1, editor);

                // newRange.setStart(editor.childNodes[2], 1);
                // newRange.collapse(true);
                // selection?.removeAllRanges();
                // selection?.addRange(newRange);
                // console.log('new position...');

                // editor.setRangeText(` `, range.startOffset, range.endOffset);
              }
            }
          }
        } else {
          console.log('yolo');
          nullTextElement = getNullElement[0];
          newRangeBoldText = true;
          console.log(getCurrentCursorPosition('fake_textarea'));
        }
      }
    }
  }

  // this.htmlContent = '';
  // const char = event.key;
  // this.posistion += 1;
  // this.text = char;
  // this.htmlContent = `${this.text}`;

  onChange(event: Event) {
    const newValur = (event.target as HTMLInputElement).innerText;
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

  setCaretPosition() {
    // console.log(this.fakeDiv);
    // console.log(element);
    // const range = document.createRange();
    // const sel = window.getSelection();
    // // range.selectNodeContents(element);
    // range.setStart(element, this.posistion);
  }

  protected readonly onchange = onchange;
}
