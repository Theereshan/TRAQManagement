import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable, switchMap, map } from 'rxjs';

import { AccountService } from '../../services/account.service';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './account-details.component.html',
  styleUrl: './account-details.component.css',
})
export class AccountDetailsComponent {
  accountId = 0;

  message = '';

  // ✅ main observable account
  account$!: Observable<any>;

  // ✅ observable transactions list
  transactions$!: Observable<any[]>;

  // form
  transactionAmount = 0;
  transactionDate = new Date().toISOString().split('T')[0];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private transactionService: TransactionService
  ) {
    // ✅ load account from URL param automatically
    this.account$ = this.route.paramMap.pipe(
      map(params => Number(params.get('id'))),
      switchMap(id => {
        this.accountId = id;
        return this.accountService.getAccountById(id);
      })
    );

    // ✅ load transactions after account id known
    this.transactions$ = this.route.paramMap.pipe(
      map(params => Number(params.get('id'))),
      switchMap(id =>
        this.transactionService.getTransactionsByAccount(id)
      )
    );
  }

  createTransaction(): void {
    this.message = '';

    if (!this.transactionDate) {
      this.message = '❌ Please select a date';
      return;
    }

    if (this.transactionAmount === 0) {
      this.message = '❌ Amount cannot be 0';
      return;
    }

    const chosenDate = new Date(this.transactionDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (chosenDate > today) {
      this.message = '❌ Transaction date cannot be in the future';
      return;
    }

    const payload = {
      accountId: this.accountId,
      amount: this.transactionAmount,
      transactionDate: chosenDate.toISOString(),
    };

    this.transactionService.createTransaction(payload).subscribe({
      next: () => {
        this.message = '✅ Transaction added successfully';
        this.transactionAmount = 0;

        // ✅ reload transactions observable
        this.transactions$ = this.transactionService.getTransactionsByAccount(this.accountId);

        // ✅ reload account observable (refresh balance)
        this.account$ = this.accountService.getAccountById(this.accountId);
      },
      error: (err: any) => {
        console.error(err);
        this.message = '❌ Failed to create transaction';
      },
    });
  }

  back(): void {
    this.router.navigate(['/accounts']);
  }
}
