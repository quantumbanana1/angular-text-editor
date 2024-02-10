import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ContentComponent } from '../content/content.component';
import { TextEditorService } from '../text-editor.service';
import { FormsModule } from '@angular/forms';

let indexNull = 0;
let indexBold = 0;

interface ITextState {
  null: boolean;
  bold: boolean;
  italic: boolean;
  underline: boolean;
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
    null: false,
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
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);

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
          if (selection) {
            boldText.textContent = `${event.key}`;
          }

          if (range) {
            console.log('xddd');
            // range.deleteContents();
            console.log(range);
            range.insertNode(boldText);
            console.log(boldText);
          }
        } else {
          boldText = getBoldElement[0];
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
          if (selection) {
            nullTextElement.textContent = `${event.key}`;
          }
          if (range) {
            range.insertNode(nullTextElement);
          }
        } else {
          console.log('yolo');
          nullTextElement = getNullElement[0];
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
      } else {
        this.states.bold = false;
      }
    });

    this.textEditorService.notifyNullTextChange.subscribe((value: IState) => {
      if (value.values.includes('null')) {
        this.states.null = true;
        this.states.bold = false;
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
