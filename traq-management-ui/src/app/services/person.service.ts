import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Status {
  statusId: number;
  statusName: string;
}

export interface Account {
  accountId: number;
  accountNumber: string;
  personId: number;
  statusId: number;
  balance: number;
  status?: Status;
}

export interface Person {
  personId: number;
  firstName: string;
  lastName: string;
  idNumber: string;
  accounts?: Account[]; // ✅ important
}

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  private apiUrl = 'http://localhost:5188/api/Persons';

  constructor(private http: HttpClient) { }

  getAllPersons(): Observable<Person[]> {
    return this.http.get<Person[]>(this.apiUrl);
  }

  getPersonById(id: number): Observable<Person> {
    return this.http.get<Person>(`${this.apiUrl}/${id}`);
  }

  // ✅ Person + Accounts endpoint
  getPersonWithAccounts(id: number): Observable<Person> {
    return this.http.get<Person>(`${this.apiUrl}/${id}`);
  }

  createPerson(person: Partial<Person>): Observable<Person> {
    return this.http.post<Person>(this.apiUrl, person);
  }

  updatePerson(id: number, person: Partial<Person>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, person);
  }

  deletePerson(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchPersons(idNumber?: string, surname?: string, accountNumber?: string): Observable<Person[]> {
    let params = new HttpParams();

    if (idNumber) params = params.set('idNumber', idNumber);
    if (surname) params = params.set('surname', surname);
    if (accountNumber) params = params.set('accountNumber', accountNumber);

    return this.http.get<Person[]>(`${this.apiUrl}/search`, { params });
  }
}
