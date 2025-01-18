import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
      standalone: true,
      selector: 'tm-tab-list',
      imports: [CommonModule],
      templateUrl: './tab-list.component.html',
      styleUrls: ['./tab-list.component.css'],
})
export class TabListComponent {}
