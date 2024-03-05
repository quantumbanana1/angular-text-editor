import { Component } from '@angular/core';
import { TextEditorService } from '../text-editor.service';

@Component({
  selector: 'app-header-editor',
  standalone: true,
  imports: [],
  templateUrl: './header-editor.component.html',
  styleUrl: './header-editor.component.css',
})
export class HeaderEditorComponent {
  constructor(private textEditorServe: TextEditorService) {}

  boldChecked: boolean = false;
  italicChecked: boolean = false;
  underlineChecked: boolean = false;
  quoteChecked: boolean = false;
  listChecked: boolean = false;

  setBold() {
    this.textEditorServe.setBold();
  }

  setItalic() {
    // this.textEditorServe.setItalic();
  }

  setUnderline() {
    // this.textEditorServe.setUnderline();
  }

  setQuote() {
    // this.textEditorServe.setQuote();
  }

  setList() {
    // this.textEditorServe.setList();
  }

  ngOnInit() {
    this.textEditorServe.notifyBoldTextChange.subscribe((data) => {
      if (data.values.includes('bold')) {
        this.boldChecked = true;
      } else {
        this.boldChecked = false;
      }
    });

    this.textEditorServe.notifyNullTextChange.subscribe((data) => {
      if (data.values.includes('null')) {
        this.boldChecked = false;
      }
    });
  }
}
