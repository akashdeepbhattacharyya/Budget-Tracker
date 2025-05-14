import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(private http: HttpClient) {}
  private apiUrl = environment.apiUrl + 'transactions'; // replace with your backend URL

  transactions(): Observable<any> {
    const token = this.getToken();
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.get<any>(`${this.apiUrl}/list`, { headers });
  }
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
  addTransaction(transaction: any): Observable<any> {
    const token = this.getToken();
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.post<any>(`${this.apiUrl}/add`, transaction, { headers });
  }
  updateTransaction(id: number, transaction: any): Observable<any> {
    const token = this.getToken();
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.put<any>(`${this.apiUrl}/update/${id}`, transaction, {
      headers,
    });
  }
  deleteTransaction(id: number): Observable<any> {
    const token = this.getToken();
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`, { headers });
  }
}
