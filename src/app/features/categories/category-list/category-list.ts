import { Component, inject, signal } from '@angular/core';
import { Category } from '../../../services/category/category';
import { CategoryItem } from '../category-item/category-item';
import { CategoryModel } from '../../../models/category.model';

@Component({
  selector: 'app-category-list',
  imports: [ CategoryItem ],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryList {
  categories = signal<CategoryModel[]>([]);

  private categoryService = inject(Category)

  ngOnInit(){
    this.loadCategories();
  }

  loadCategories(){
    this.categoryService.get_categories_names().subscribe({
      next: (data) => {
        this.categories.set(data);
      },
      error: (error) => {
        console.error('Categories load exception', error);
      }
    })
  }
}
