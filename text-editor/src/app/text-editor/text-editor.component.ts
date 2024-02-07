import { Component } from '@angular/core';
import {HeaderEditorComponent} from "../header-editor/header-editor.component";
import {TextAreaComponent} from "../text-area/text-area.component";
import {ContentComponent} from "../content/content.component";
import {ɵEmptyOutletComponent} from "@angular/router";

@Component({
  selector: 'app-text-editor',
  standalone: true,
  imports: [
    HeaderEditorComponent,
    TextAreaComponent,
    ContentComponent,
  ],
  templateUrl: './text-editor.component.html',
  styleUrl: './text-editor.component.css'
})
export class TextEditorComponent {

}
