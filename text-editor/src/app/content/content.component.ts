import {
  Component,
  ElementRef,
  Input,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { TextEditorService } from '../text-editor.service';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [NgTemplateOutlet, NgIf],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css',
})
export class ContentComponent {
  @Input() htmlString: string = '';
  @Input() dynamicTemplate!: TemplateRef<any>;
  // htmlString: string = '<span #xd>xddddd;</span>';
  private template = document.createElement('template');
  htmlStringContent = '';

  @ViewChild('dynamicTemplate') dynamicTemplateRef!: TemplateRef<any>;
  @ViewChild('container') container!: ElementRef;
  @ViewChild('xd') xd!: ElementRef;

  states = {
    bold: false,
  };

  constructor(
    private element: ElementRef,
    private textEditorService: TextEditorService,
  ) {}

  // @ViewChild('container', { read: ViewContainerRef })
  // container!: ViewContainerRef;
  //
  // @ViewChild('textContent') public textContentTemplate!: TemplateRef<any>;
  ngAfterViewInit() {
    if (this.htmlString === '') {
      this.template.innerHTML += `<span  id="main">&nbsp;<span>`;
    }
    console.log(this.template);
    const dynamicTemplate = this.template.content.firstChild as HTMLElement;
    this.element.nativeElement.appendChild(dynamicTemplate);
  }

  // ngOnChanges() {
  //   const dynamicElement =
  //     this.element.nativeElement.querySelector('.dynamicElement');
  //
  //   if (this.states.bold) {
  //     console.log(this.template);
  //     this.htmlStringContent = `<strong>{this.htmlString}</strong>`;
  //     console.log(this.element.nativeElement.innerHTML);
  //     dynamicElement.textContent = this.htmlStringContent; // Example change
  //   }
  // }

  ngOnInit() {
    console.log(this.htmlStringContent);
    this.textEditorService.notifyBoldTextChange.subscribe((value: IState) => {
      console.log(value);
      if (value.values.includes('bold')) {
        this.states.bold = true;
      }
    });
  }
}
