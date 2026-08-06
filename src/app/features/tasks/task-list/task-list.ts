import { Component, HostListener, inject } from '@angular/core';
import { Tasks } from '../../../services/tasks/tasks';
import { TaskResponseModel, TaskCreationModel } from '../../../models/task.model';
import { TaskItem } from '../task-item/task-item';
import { AsyncPipe } from '@angular/common';
import { Category } from '../../../services/category/category';
import { combineLatest, map, Observable, BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TaksDialog } from '../../../components/taks-dialog/taks-dialog';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-task-list',
  imports: [TaskItem, AsyncPipe, MatIcon],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList {
  private dialog = inject(MatDialog);
  taskService = inject(Tasks);
  categoryService = inject(Category);

  taskWithCategories$!: Observable<any[]>;

  paginatedTasks$!: Observable<any[]>;
  currentPage$ = new BehaviorSubject<number>(1);
  pageSize = 9;
  totalPages$ = new BehaviorSubject<number>(1);

  openMenuId: number | string | null = null;

  @HostListener('document:click')
  closeAllMenus(){
    this.openMenuId = null;
  }

  toggleMenu(id: number | string, event: Event){
    event.stopPropagation();
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  deleteTask(id: string){
    this.taskService.deleteTask(id);
    console.log(`Task with id ${id} is deleted`)
  }

  editTask(task: TaskResponseModel){
    console.log("You want to edit this task: ", task);
    
    const editTaskData: TaskCreationModel = {
      title: task.title,
      description: task.description,
      deadline: task.deadline,
      priorityLevel: task.priorityLevel,
      categoryId: task.categoryId
    }

    this.dialog.open(TaksDialog, {
      width: '480px',
      maxWidth: 'calc(100vw - 32px)',
      panelClass: 'task-dialog-panel',
      data: {taskData: editTaskData, taskId: task.id}
    });
  }

  markTaskAsDone(id: string){
    this.taskService.toggleTask(id);
  }

  ngOnInit(){
    this.combineTasks();
    this.taskService.getTasks().subscribe();
    this.categoryService.get_categories_names().subscribe();
  }

  combineTasks(){
    const tasks$ = this.taskService.filteredAndSortedTasks$;
    const categories$ = this.categoryService.categories$;

    this.taskWithCategories$ = combineLatest({tasks: tasks$, categories: categories$}).pipe(
      map(({tasks, categories}) => {
        return tasks.map(task => {
          const matchedCategory = categories.find(c => c.id === task.categoryId)
          return { ...task, categoryName: matchedCategory?.name ?? null, categoryColor: matchedCategory?.color ?? null }
        })
      })
    )

    this.paginatedTasks$ = combineLatest([
      this.taskWithCategories$,
      this.currentPage$
    ]).pipe(
      map(([allTasks, currentPage]) => {
        const total = Math.ceil(allTasks.length / this.pageSize) || 1;
        this.totalPages$.next(total);

        if (currentPage > total) {
           setTimeout(() => this.currentPage$.next(total));
           currentPage = total;
        }

        const startIndex = (currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        
        return allTasks.slice(startIndex, endIndex);
      })
    );
  }
  nextPage() {
    if (this.currentPage$.getValue() < this.totalPages$.getValue()) {
      this.currentPage$.next(this.currentPage$.getValue() + 1);
    }
  }

  prevPage() {
    if (this.currentPage$.getValue() > 1) {
      this.currentPage$.next(this.currentPage$.getValue() - 1);
    }
  }
}
