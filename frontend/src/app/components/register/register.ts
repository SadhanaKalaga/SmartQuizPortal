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
  password = '';
  role = 'student';
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.loading = true;
    this.error = '';
    
    this.authService.register({ 
      name: this.name, 
      email: this.email, 
      password: this.password,
      role: this.role 
    }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.user.role === 'student') {
          this.router.navigate(['/student-dashboard']);
        } else {
          this.router.navigate(['/faculty-dashboard']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Registration failed';
      }
    });
  }
}
