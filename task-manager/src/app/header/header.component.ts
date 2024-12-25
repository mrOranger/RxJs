import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
      standalone: true,
      selector: 'tm-header',
      templateUrl: './header.component.html',
      styleUrls: ['./header.component.css'],
      imports: [CommonModule],
})
export class HeaderComponent {}
