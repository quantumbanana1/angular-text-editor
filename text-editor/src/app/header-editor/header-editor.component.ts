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

  setBold() {
    this.textEditorServe.setBold();
  }
}
