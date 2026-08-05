import { Component, inject } from '@angular/core';
import { Sidebar } from "../../components/sidebar/sidebar";
import { Header } from "../../components/header/header";
import { TaskInput } from "../../features/tasks/task-input/task-input";
import { TaskList } from "../../features/tasks/task-list/task-list";
import { Tasks } from '../../services/tasks/tasks';

@Component({
  selector: 'app-home',
  imports: [Sidebar, Header, TaskInput, TaskList],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
}
