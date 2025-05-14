import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ApiService } from '../services/auth-services/auth.service';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderService } from '../services/loader/loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [CommonModule, FormsModule, RouterLink, RouterModule],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  constructor(
    private router: Router,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private loaderService: LoaderService
  ) {}

  onSubmit() {
    // Handle login logic here
    console.log(this.username);
    const loginData = {
      userName: this.username,
      password: this.password,
    };
    this.loaderService.show();
    this.apiService.login(loginData).subscribe({
      next: (v) => {
        this.apiService.setSession(v);
        this.loaderService.hide();
        this.router.navigate(['/dashboard']);
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
