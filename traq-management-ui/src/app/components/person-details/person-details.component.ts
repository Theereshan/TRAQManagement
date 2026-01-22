import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { PersonService, Person } from '../../services/person.service';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-person-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './person-details.component.html',
  styleUrl: './person-details.component.css',
})
export class PersonDetailsComponent {
  person$!: Observable<any>; // use any so accounts doesn't cause TS errors

  message = '';

  // editable fields
  firstName = '';
  lastName = '';
  idNumber = '';

  // create account
  newAccountNumber = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private personService: PersonService,
    private accountService: AccountService
  ) {
    // ✅ This automatically loads when route changes (persons/:id)
    this.person$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const id = Number(params.get('id'));
        return this.personService.getPersonWithAccounts(id);
      })
    );

    // ✅ Also copy fields for editing when person loads
    this.person$.subscribe((data) => {
      this.firstName = data.firstName;
      this.lastName = data.lastName;
      this.idNumber = data.idNumber;
    });
  }

  savePerson(personId: number): void {
    this.message = '';

    this.personService
      .updatePerson(personId, {
        firstName: this.firstName,
        lastName: this.lastName,
        idNumber: this.idNumber,
      })
      .subscribe({
        next: () => {
          this.message = '✅ Person updated successfully';
        },
        error: () => {
          this.message = '❌ Failed to update person';
        },
      });
  }

  addAccount(personId: number): void {
    this.message = '';

    if (!this.newAccountNumber) {
      this.message = '❌ Enter account number';
      return;
    }

    this.accountService
      .createAccount({
        personId: personId,
        accountNumber: this.newAccountNumber,
      })
      .subscribe({
        next: () => {
          this.message = '✅ Account created successfully';
          this.newAccountNumber = '';
        },
        error: () => {
          this.message = '❌ Failed to create account';
        },
      });
  }

  back(): void {
    this.router.navigate(['/persons']);
  }
}
