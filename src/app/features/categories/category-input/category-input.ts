import { Component, inject, Input } from '@angular/core';
import { Category } from '../../../services/category/category';

@Component({
  selector: 'app-category-input',
  imports: [],
  templateUrl: './category-input.html',
  styleUrl: './category-input.css',
})
export class CategoryInput {
  color: string = '';
  private categoryService = inject(Category);

  ngOnInit(){
    this.color = this.generateRandomColor();
  }

  onInputEnter(inputElement: HTMLInputElement){
    const value = inputElement.value.trim();

    if (value){
      console.log(`Added new category with name: ${value}`);
      this.categoryService.addNewCategory(value, this.color);
      inputElement.value = '';
    }
    inputElement.blur();
  }

  generateRandomColor(): string {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  }
}
