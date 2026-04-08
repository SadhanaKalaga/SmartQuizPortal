import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  name = '';
  email = '';
  role = 'student';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.register({ name: this.name, email: this.email, role: this.role }).subscribe({
      next: (res) => {
        if (res.user.role === 'student') {
          this.router.navigate(['/student-dashboard']);
        } else {
          this.router.navigate(['/faculty-dashboard']);
        }
      },
      error: (err) => this.error = err.error.message || 'Registration failed'
    });
  }
}
