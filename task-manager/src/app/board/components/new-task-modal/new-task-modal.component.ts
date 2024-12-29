import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
      standalone: true,
      imports: [CommonModule],
      selector: 'tm-new-task-modal',
      templateUrl: './new-task-modal.component.html',
      styleUrls: ['./new-task-modal.component.css'],
})
export class NewTaskModalComponent {}
