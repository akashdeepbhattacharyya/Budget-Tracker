import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.apiUrl; // replace with your backend URL

  constructor(private http: HttpClient, private routes: Router) {}

  // Login function
  login(data: { userName: string; password: string }): Observable<any> {
    console.log(data);

    // Optionally, you can set headers here
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post(this.apiUrl  + 'login', data, { headers });
  }

  // Store token in localStorage after successful login (if needed)
  setSession(authResult: any): void {
    localStorage.setItem('access_token', authResult.access); // assuming the backend returns a token
    localStorage.setItem('user', authResult.userName); // assuming the backend returns a token
  }

  // Get the token
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
  getUserName(): string | null {
    return localStorage?.getItem('user');
  }
  // Register function
  register(data: { userName: string; email: string; password: string }): Observable<any> {
    return this.http.post(this.apiUrl + 'register', data);
  }
  // Logout user
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    this.routes.navigate(['/login']);
  }
}
