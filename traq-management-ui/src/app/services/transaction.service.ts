import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private apiUrl = 'http://localhost:5188/api/Transactions';

  constructor(private http: HttpClient) {}

  getTransactions(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // ✅ NEW: get transactions for one account
  getTransactionsByAccount(accountId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/byAccount/${accountId}`);
  }

  createTransaction(transaction: any): Observable<any> {
    return this.http.post(this.apiUrl, transaction);
  }

  updateTransaction(id: number, transaction: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, transaction);
  }

  deleteTransaction(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
