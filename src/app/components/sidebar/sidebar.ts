import { Component, inject, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon'
import { CategoryInput } from "../../features/categories/category-input/category-input";
import { CategoryList } from "../../features/categories/category-list/category-list";
import { Auth } from '../../services/auth/auth';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [MatIconModule, CategoryInput, CategoryList],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  private platformId = inject(PLATFORM_ID)
  username?: string | null;
  email?: string | null;
  initials?: string | null;

  activeTab = signal<string>('home');
  http = inject(Auth)
  router = inject(Router)

  ngOnInit(){
    this.getUserCredentials();  
    this.initials = this.getTwoChars(this.username)
  }

  setActive(tabName: string){
    this.activeTab.set(tabName);
  }
  logout(): void{
    this.http.logout();
    this.router.navigate(['/login']);
  }
  getUserCredentials(){
    if(isPlatformBrowser(this.platformId)){
      this.username = localStorage.getItem("username");
      this.email = localStorage.getItem("email");
    }
  }
  getTwoChars(str?: string | null): string {
    if (!str || str.length < 2) {
      return ""; 
    }

    let idx1 = Math.floor(Math.random() * str.length);
    let idx2 = Math.floor(Math.random() * str.length);

    while (idx1 === idx2) {
      idx2 = Math.floor(Math.random() * str.length);
    }

    const firstIndex = Math.min(idx1, idx2);
    const secondIndex = Math.max(idx1, idx2);

    return str[firstIndex] + str[secondIndex];
  }
}