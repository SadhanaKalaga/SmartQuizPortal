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

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.login({ email: this.email }).subscribe({
      next: (res) => {
        if (res.user.role === 'student') {
          this.router.navigate(['/student-dashboard']);
        } else {
          this.router.navigate(['/faculty-dashboard']);
        }
      },
      error: (err) => this.error = err.error.message || 'Login failed'
    });
  }
}
