import { Component, inject, signal } from '@angular/core';
import { Category } from '../../../services/category/category';
import { CategoryItem } from '../category-item/category-item';
import { CategoryModel } from '../../../models/category.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Tasks } from '../../../services/tasks/tasks';
import { filter } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-category-list',
  imports: [ CategoryItem, AsyncPipe ],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryList {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tasksService = inject(Tasks);

  private categoryService = inject(Category)

  categories$ = this.categoryService.categories$

  ngOnInit(){
    this.loadCategories();

    this.route.queryParams.subscribe(param => {
      const categId: number = Number(param['category']) || -1;
      const filterType: string = param['filter'] || 'NOTDONE';

      this.tasksService.setCategoryId(categId);
      this.tasksService.setFilter(filterType);
    });
  }

  onCategSelect(categId: number){
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        category: categId === -1 ? null : categId,
        filter: null
      },
      queryParamsHandling: 'merge'
    });
  }

  loadCategories(){
    this.categoryService.get_categories_names().subscribe({
      next: (data) => {
        
      },
      error: (error) => {
        console.error('Categories load exception', error);
      }
    })
  }
}
