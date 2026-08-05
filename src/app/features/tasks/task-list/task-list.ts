import { Component, HostListener, inject } from '@angular/core';
import { Tasks } from '../../../services/tasks/tasks';
import { TaskResponseModel } from '../../../models/task.model';
import { TaskItem } from '../task-item/task-item';
import { AsyncPipe } from '@angular/common';
import { Category } from '../../../services/category/category';
import { combineLatest, map, Observable } from 'rxjs';

@Component({
  selector: 'app-task-list',
  imports: [TaskItem, AsyncPipe],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList {
  taskService = inject(Tasks);
  categoryService = inject(Category);

  taskWithCategories$!: Observable<any[]>;

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

  markTaskAsDone(id: string){
    this.taskService.toggleTask(id);
  }

  ngOnInit(){
    this.combineTasks();
    this.taskService.getTasks().subscribe();
    this.categoryService.get_categories_names().subscribe();
  }

  combineTasks(){
    const tasks$ = this.taskService.tasks$;
    const categories$ = this.categoryService.categories$;

    this.taskWithCategories$ = combineLatest({tasks: tasks$, categories: categories$}).pipe(
      map(({tasks, categories}) => {
        return tasks.map(task => {
          const matchedCategory = categories.find(c => c.id === task.categoryId)
          return { ...task, categoryName: matchedCategory?.name ?? null, categoryColor: matchedCategory?.color ?? null }
        })
      })
    )
  }
}
