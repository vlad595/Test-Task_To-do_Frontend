import { Component, inject, signal } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from "@angular/material/dialog";
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
  public editDialogData? = inject(MAT_DIALOG_DATA) as { taskData: TaskCreationModel | null, taskId: string | null} | null;

  public editTaskData: TaskCreationModel | null = this.editDialogData?.taskData || null;
  public editTaskId: string | null = this.editDialogData?.taskId || null;

  categoryService = inject(Category);
  tasksService = inject(Tasks);

  dialogRef = inject(MatDialogRef<TaksDialog>)

  taskName: string = '';
  categoryId: number | null = null;
  deadline: string | null = '';
  activePriority = signal<number>(1);
  submitButtonText: string = 'Add task';
  
  categories: CategoryModel[] = [];

  ngOnInit(){
    this.categoryService.categories$.subscribe((data) => {
      this.categories = data;
    });
    if (this.editTaskData && this.editTaskId){
      this.taskName = this.editTaskData.title;
      this.categoryId = this.editTaskData.categoryId;
      if (this.editTaskData.deadline) {
        const dateObj = new Date(this.editTaskData.deadline);
        if (!isNaN(dateObj.getTime())) {
          const year = dateObj.getFullYear();
          const month = String(dateObj.getMonth() + 1).padStart(2, '0'); 
          const day = String(dateObj.getDate()).padStart(2, '0');
          
          this.deadline = `${year}-${month}-${day}`;
        }
      }
      this.activePriority.set(this.editTaskData.priorityLevel);
      this.submitButtonText = 'Confirm change'
    }
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

    if (!this.editTaskData && !this.editTaskId){
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
    else {
      this.tasksService.editTask(newTaskData, this.editTaskId!)
      this.dialogRef.close();
    }
  }
}
