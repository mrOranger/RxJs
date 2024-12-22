import { Component, Input } from '@angular/core';

@Component({
      standalone: true,
      selector: 'tm-loader',
      templateUrl: './loader.component.html',
      styleUrls: ['./loader.component.css'],
})
export class LoaderComponent {

      @Input() public label?: string;
}
