import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = environment.apiUrl + 'dashboard'; // replace with your backend URL

  constructor(private http: HttpClient) {}
   getToken(): string | null {
    return localStorage.getItem('access_token');
  }
  getData() {
    const token = this.getToken();
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.get<any>(`${this.apiUrl}`, { headers });
  }
}
