import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { DateFormatPipePipe } from '../../../pipes/s/date-format-pipe-pipe';

@Component({
  selector: 'app-task-item',
  imports: [MatIcon, DateFormatPipePipe],
  templateUrl: './task-item.html',
  styleUrl: './task-item.css',
})
export class TaskItem {
  @Input({required: true}) title!: string;
  @Input() categoryName?: string | null;
  @Input() deadline?: string | null;
  @Input({required: true}) priority: number = 2; 
  @Input() categoryColor?: string | null;
  @Input({required: true}) isMenuOpened: boolean = false;
  @Input() isDone: boolean = false;
  @Output() onMenuClick = new EventEmitter<Event>();
  @Output() onDeleteButtonClick = new EventEmitter();
  @Output() onDoneClick = new EventEmitter();
  @Output() onEditClick = new EventEmitter();

  triggerMenu(event: Event){
    this.onMenuClick.emit(event);
  }

  deleteButtonClick(){
    this.onDeleteButtonClick.emit();
  }

  doneButtonClick(){
    this.isDone = !this.isDone;
    this.onDoneClick.emit();
  }

  editButtonClick(){
    this.onEditClick.emit();
  }
}
