import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog'
import { TaksDialog } from '../../../components/taks-dialog/taks-dialog';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-task-input',
  imports: [MatIcon],
  templateUrl: './task-input.html',
  styleUrl: './task-input.css',
})
export class TaskInput {
  private dialog = inject(MatDialog);

  openNewTaskModal() {
    this.dialog.open(TaksDialog, {
      width: '480px',
      maxWidth: 'calc(100vw - 32px)',
      panelClass: 'task-dialog-panel',
    });
  }
}
