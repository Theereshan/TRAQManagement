import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  username = '';
  password = '';

  message = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) { }

  login(): void {
    console.log('✅ Login clicked:', this.username);

    this.message = '';
    this.loading = true;

    this.authService.login(this.username, this.password).subscribe({
      next: (res: any) => {
        console.log('✅ Login success:', res);

        // ✅ store login data
        localStorage.setItem('loggedInUser', res.username);

        // ✅ IMPORTANT: set token so guard allows navigation
        localStorage.setItem('token', 'logged-in');

        this.loading = false;

        // ✅ redirect
        this.router.navigate(['/accounts']);
      },
      error: (err: any) => {
        console.error('❌ Login failed:', err);
        this.message = '❌ Invalid username or password';
        this.loading = false;
      }
    });
  }
}
