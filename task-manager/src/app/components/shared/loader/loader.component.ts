import { Component } from '@angular/core';
import { LoaderService } from 'src/app/services';

@Component({
      selector: 'tm-loader',
      templateUrl: './loader.component.html',
      styleUrls: ['./loader.component.css'],
})
export class LoaderComponent {
      public constructor(public readonly loaderService: LoaderService) {}
}
