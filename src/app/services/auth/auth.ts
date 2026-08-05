import { PLATFORM_ID, Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Service()
export class Auth {
    private apiUrl = "https://test-taskto-dobackend-production.up.railway.app/";
    private http = inject(HttpClient);
    private platformId = inject(PLATFORM_ID)

    login(credentials: any): Observable<any> {
        return this.http.post(`${this.apiUrl}api/Auth/login`, credentials).pipe(
            tap((response: any) => {
                if (response && response.token){
                    this.save_token(response.token, response.name, response.email);
                }
            })
        );
    }
    register(credentials: any): Observable<any> {
        return this.http.post(`${this.apiUrl}api/Auth/register`, credentials).pipe(
            tap((response: any) => {
                if (response && response.token){
                    this.save_token(response.token, response.name, response.email);
                }
            })
        )
    }
    private save_token(token: any, username: string, email: string): void{
        if (isPlatformBrowser(this.platformId)){
            localStorage.setItem("auth_token", token);
            localStorage.setItem("username", username);
            localStorage.setItem("email", email);
        }
    }
    get_token(): string | null{
        if (isPlatformBrowser(this.platformId)){
            return localStorage.getItem("auth_token");
        }
        return null;
    }
    logout(): void{
        if(isPlatformBrowser(this.platformId)){
            localStorage.removeItem("auth_token");
            localStorage.removeItem("username");
            localStorage.removeItem("email");
        }
    }
}
