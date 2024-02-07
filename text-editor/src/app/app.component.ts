import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {TextEditorComponent} from "./text-editor/text-editor.component";
import {ContentComponent} from "./content/content.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TextEditorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'text-editor';
}
