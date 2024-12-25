import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SidebarLeftComponent } from '../sidebars';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
      standalone: true,
      selector: 'tm-layout',
      templateUrl: './layout.component.html',
      styleUrls: ['./layout.component.css'],
      imports: [RouterOutlet, CommonModule, HeaderComponent, SidebarLeftComponent, FooterComponent],
})
export class LayoutComponent {}
