import { Component, inject, signal } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { MatDialogClose, MatDialogRef } from "@angular/material/dialog";
import { FormsModule } from '@angular/forms';
import { Category } from '../../services/category/category';
import { CategoryModel } from '../../models/category.model';
import { Tasks } from '../../services/tasks/tasks';
import { TaskCreationModel } from '../../models/task.model';

@Component({
  selector: 'app-taks-dialog',
  imports: [MatIcon, MatDialogClose, FormsModule],
  templateUrl: './taks-dialog.html',
  styleUrl: './taks-dialog.css',
})
export class TaksDialog {
  categoryService = inject(Category);
  tasksService = inject(Tasks);

  dialogRef = inject(MatDialogRef<TaksDialog>)

  taskName: string = '';
  categoryId: number | null = null;
  deadline: string | null = '';
  activePriority = signal<number>(1);
  
  categories: CategoryModel[] = [];

  ngOnInit(){
    this.categoryService.categories$.subscribe((data) => {
      this.categories = data;
    });
  }

  changePriority(priority: number){
    this.activePriority.set(priority);
  }

  makeNewTask(){
    let formattedDate: string | null = null;
    if (this.deadline){
      const dateObj = new Date(this.deadline);
      if (!isNaN(dateObj.getTime())){
        formattedDate = dateObj.toISOString();
      }
    }

    const newTaskData: TaskCreationModel = {
      title: this.taskName,
      description: null,
      deadline: formattedDate,
      priorityLevel: this.activePriority(),
      categoryId: this.categoryId
    }

    this.tasksService.newTask(newTaskData).subscribe({
      next: (response) => {
        console.log("Task succesfully created", response);
        this.dialogRef.close();
      },
      error: (error) => {
        console.error("Task creation exception", error);
      }
    });
  }
}
