import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { QuizService } from '../../services/quiz';
import { AttemptService } from '../../services/attempt';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.css'
})
export class StudentDashboardComponent implements OnInit {
  quizzes: any[] = [];
  attempts: any[] = [];
  user: any;

  constructor(
    private quizService: QuizService,
    private attemptService: AttemptService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => this.user = user);
    this.loadQuizzes();
    this.loadAttempts();
  }

  loadQuizzes(): void {
    this.quizService.getAllQuizzes().subscribe({
      next: (res) => this.quizzes = res.quizzes,
      error: (err) => console.error(err)
    });
  }

  loadAttempts(): void {
    this.attemptService.getMyAttempts().subscribe({
      next: (res) => this.attempts = res.attempts,
      error: (err) => console.error(err)
    });
  }

  attemptQuiz(quizId: string): void {
    this.router.navigate(['/quiz', quizId]);
  }

  viewResult(attemptId: string): void {
    this.router.navigate(['/results', attemptId]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
