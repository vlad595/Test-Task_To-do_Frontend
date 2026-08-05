import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-category-item',
  imports: [],
  templateUrl: './category-item.html',
  styleUrl: './category-item.css',
})
export class CategoryItem {
  @Input({required: true}) categoryName!: string;
  @Input({required: true}) categoryColor!: string;
}
