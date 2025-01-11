import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
      standalone: true,
      imports: [CommonModule],
      selector: 'tm-empty-project-list',
      templateUrl: './empty-project-list.component.html',
      styleUrls: ['./empty-project-list.component.css'],
})
export class EmptyProjectListComponent {}
