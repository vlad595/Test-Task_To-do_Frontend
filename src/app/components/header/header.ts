import { Component } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { TaskSearch } from "../../features/tasks/task-search/task-search";

@Component({
  selector: 'app-header',
  imports: [MatIconModule, TaskSearch],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {}
