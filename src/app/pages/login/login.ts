import { Component, inject } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { Auth } from '../../services/auth/auth';
import { ReactiveFormsModule, FormGroup, FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(Auth);
  private router = inject(Router);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  ngOnInit(): void{
    if (this.authService.get_token()){
      this.router.navigate(['/app']);
    }
  }

  onSubmit(): void{
    if (this.loginForm.valid){
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/app'])
        },
        error: (error) => {
          console.error('Auth exception:', error);
        }
      });
    }
  }
}
