import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from "@angular/material/icon";
import { debounce, debounceTime, distinct, distinctUntilChanged } from 'rxjs';
import { Tasks } from '../../../services/tasks/tasks';

@Component({
  selector: 'app-task-search',
  imports: [MatIcon, ReactiveFormsModule],
  templateUrl: './task-search.html',
  styleUrl: './task-search.css',
})
export class TaskSearch {
  private taskService = inject(Tasks);
  searchInput = new FormControl('');

  ngOnInit(){
    this.searchInput.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      this.taskService.setSearch(query || '')
    });
  }
}
