import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { RouterModule } from '@angular/router';

import { AccountService } from '../../services/account.service';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css',
})
export class AccountsComponent implements OnInit {
  accounts: any[] = [];

  message = '';
  loading = false;

  // Create Account form
  personId: number = 1;
  accountNumber: string = '';

  // Transaction form
  selectedAccountId: number = 0;
  transactionAmount: number = 0;
  messageTransaction = '';

  constructor(
    private accountService: AccountService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

 loadAccounts(): void {
  this.loading = true;
  this.message = '';

  this.accountService.getAccounts().subscribe({
    next: (data: any[]) => {
      console.log('✅ Accounts loaded:', data);
      this.accounts = data;

      // ✅ IMPORTANT FIX
      this.loading = false;
    },
    error: (err: any) => {
      console.error('❌ Load accounts error:', err);
      this.message = '❌ Failed to load accounts';

      // ✅ IMPORTANT FIX
      this.loading = false;
    },
  });
}

  createAccount(): void {
    this.message = '';

    if (!this.personId || !this.accountNumber) {
      this.message = '❌ Please enter Person ID and Account Number';
      return;
    }

    this.accountService
      .createAccount({
        personId: this.personId,
        accountNumber: this.accountNumber,
      })
      .subscribe({
        next: () => {
          this.message = '✅ Account created successfully';
          this.accountNumber = '';
          this.loadAccounts();
        },
        error: (err: any) => {
          console.error('❌ Create account error:', err);
          this.message = '❌ Failed to create account';
        },
      });
  }

  createTransaction(): void {
    this.messageTransaction = '';

    if (!this.selectedAccountId || this.transactionAmount === 0) {
      this.messageTransaction = '❌ Please select an account and enter amount';
      return;
    }

    this.transactionService
      .createTransaction({
        accountId: this.selectedAccountId,
        amount: this.transactionAmount,
        transactionDate: new Date().toISOString(),
      })
      .subscribe({
        next: () => {
          this.messageTransaction = '✅ Transaction successful';
          this.transactionAmount = 0;
          this.loadAccounts();
        },
        error: (err: any) => {
          console.error('❌ Transaction error:', err);
          this.messageTransaction = '❌ Transaction failed';
        },
      });
  }
}
