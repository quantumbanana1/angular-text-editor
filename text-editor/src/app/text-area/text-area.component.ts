import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ContentComponent } from '../content/content.component';
import { TextEditorService } from '../text-editor.service';
import { FormsModule } from '@angular/forms';

interface ITextState {
  null: string[];
  bold: string[];
  italic: string[];
  underline: string[];
}

@Component({
  selector: 'app-text-area',
  standalone: true,
  imports: [ContentComponent, FormsModule],
  templateUrl: './text-area.component.html',
  styleUrl: './text-area.component.css',
})
export class TextAreaComponent {
  @ViewChild('fake_textarea') public fakeDiv: ElementRef | undefined;
  private states = {};
  public htmlContent = '';
  private posistion: number = 0;

  text: string = '';
  value: string = '';
  constructor(private textEditorService: TextEditorService) {}

  onKeyChange(event: KeyboardEvent) {
    this.htmlContent = '';
    const char = event.key;
    this.posistion += 1;
    this.text += char;
  }

  onChange(event: Event) {
    const newValur = (event.target as HTMLInputElement).innerText;
    console.log(newValur);
  }

  ngOnInit() {
    this.textEditorService.notifyBoldTextChange.subscribe(
      (value: IState) => {},
    );
  }

  setCaretPosition() {
    console.log(this.fakeDiv);
    // console.log(element);
    // const range = document.createRange();
    // const sel = window.getSelection();
    // // range.selectNodeContents(element);
    // range.setStart(element, this.posistion);
  }

  protected readonly onchange = onchange;
}
