import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5188/api/Auth';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((res) => {
        // ✅ Save login state
        localStorage.setItem('loggedInUser', res.username);

        // If you don’t have a token from API, store a fake token to satisfy guard
        localStorage.setItem('token', 'logged-in');
      })
    );
  }

  logout(): void {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUsername(): string {
    return localStorage.getItem('loggedInUser') || '';
  }
}
