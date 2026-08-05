import { Routes } from '@angular/router';
import { Home } from "./pages/home/home"
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';

export const routes: Routes = [
    {path: 'login', component: Login },
    { path: 'app', component: Home },
    {path: 'reg', component: Register},
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' }
];
