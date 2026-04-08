import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { QuizService } from '../../services/quiz';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-faculty-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faculty-dashboard.html',
  styleUrl: './faculty-dashboard.css'
})
export class FacultyDashboardComponent implements OnInit {
  quizzes: any[] = [];
  user: any;

  constructor(
    private quizService: QuizService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => this.user = user);
    this.loadQuizzes();
  }

  loadQuizzes(): void {
    this.quizService.getMyQuizzes().subscribe({
      next: (res) => this.quizzes = res.quizzes,
      error: (err) => console.error(err)
    });
  }

  createQuiz(): void {
    this.router.navigate(['/create-quiz']);
  }

  deleteQuiz(id: string): void {
    if (confirm('Delete this quiz?')) {
      this.quizService.deleteQuiz(id).subscribe({
        next: () => this.loadQuizzes(),
        error: (err) => console.error(err)
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
