import { Component } from '@angular/core';
import { ApiService } from '../services/auth-services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderService } from '../services/loader/loader.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import e from 'express';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  email: string = '';
  constructor(
    private router: Router,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private loaderService: LoaderService
  ) {}

  onSubmit() {
    // Handle login logic here
    const registerData = {
      userName: this.username,
      password: this.password,
      email: this.email,
    };
    this.loaderService.show();
    this.apiService.register(registerData).subscribe({
      next: (v) => {
        this.loaderService.hide();
        this.router.navigate(['/login']);
      },
      error: (e) => {
        console.log(e.error.detail);
        this.snackBar.open(e.error.detail, '', {
          horizontalPosition: 'end',
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar'],
        });
      },
      complete: () => console.info('complete'),
    });
  }
}
