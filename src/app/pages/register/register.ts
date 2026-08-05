import { Component, inject } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { Auth } from '../../services/auth/auth';
import { ReactiveFormsModule, FormGroup, FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private authService = inject(Auth)
  private router = inject(Router)

  regForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  ngOnInit(): void{
    if (this.authService.get_token()){
      this.router.navigate(['/app']);
    }
  }

  onSubmit(){
    if (this.regForm.valid){
      this.authService.register(this.regForm.value).subscribe({
        next: (data) => {
          this.router.navigate(['/app']);
        },
        error: (error) => {
          console.log("Register exception: ", error);
        }
      });
    }
  }
}
