import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  email = '';
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    console.log('Login form submitted with email:', this.email);
    this.loading = true;
    this.error = '';
    
    this.authService.login({ email: this.email }).subscribe({
      next: (res) => {
        console.log('Login successful:', res);
        this.loading = false;
        if (res.user.role === 'student') {
          this.router.navigate(['/student-dashboard']);
        } else {
          this.router.navigate(['/faculty-dashboard']);
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        this.loading = false;
        this.error = err.error?.message || 'Login failed. Check if backend is running.';
      }
    });
  }
}
