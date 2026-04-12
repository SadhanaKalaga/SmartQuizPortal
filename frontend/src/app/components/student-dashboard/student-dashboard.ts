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
  attemptCounts: Map<string, number> = new Map();

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
      next: (res) => {
        this.quizzes = res.quizzes;
        // If backend provides attempt info, use it
        if (this.quizzes.length > 0 && this.quizzes[0].attemptCount !== undefined) {
          this.quizzes.forEach(quiz => {
            this.attemptCounts.set(quiz._id, quiz.attemptCount);
          });
        }
      },
      error: (err) => console.error(err)
    });
  }

  loadAttempts(): void {
    this.attemptService.getMyAttempts().subscribe({
      next: (res) => {
        this.attempts = res.attempts;
        // Count attempts per quiz
        this.attempts.forEach(attempt => {
          const quizId = attempt.quizId._id || attempt.quizId;
          this.attemptCounts.set(quizId, (this.attemptCounts.get(quizId) || 0) + 1);
        });
      },
      error: (err) => console.error(err)
    });
  }

  getAttemptCount(quizId: string): number {
    return this.attemptCounts.get(quizId) || 0;
  }

  getAttemptsLeft(quiz: any): number {
    return quiz.maxAttempts - this.getAttemptCount(quiz._id);
  }

  canAttempt(quiz: any): boolean {
    return this.getAttemptsLeft(quiz) > 0;
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
