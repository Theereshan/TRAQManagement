import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private apiUrl = 'https://localhost:7264/api';

  constructor(private http: HttpClient) { }

  getAccounts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Accounts`);
  }
}
