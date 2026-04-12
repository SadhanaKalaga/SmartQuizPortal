import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { QuizService } from '../../services/quiz';
import { AttemptService } from '../../services/attempt';
import { AuthService } from '../../services/auth';
import { forkJoin } from 'rxjs';

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
  }

  loadQuizzes(): void {
    this.quizService.getMyQuizzes().subscribe({
      next: (res) => {
        this.quizzes = res.quizzes;
        this.loadAttemptCounts();
      },
      error: (err) => console.error(err)
    });
  }

  loadAttemptCounts(): void {
    const requests = this.quizzes.map(quiz => 
      this.attemptService.getQuizAttempts(quiz._id)
    );

    forkJoin(requests).subscribe({
      next: (results: any[]) => {
        results.forEach((res, index) => {
          const quizId = this.quizzes[index]._id;
          const uniqueStudents = new Set(res.attempts.map((a: any) => a.studentId._id || a.studentId));
          this.attemptCounts.set(quizId, uniqueStudents.size);
        });
      },
      error: (err) => console.error(err)
    });
  }

  getAttemptCount(quizId: string): number {
    return this.attemptCounts.get(quizId) || 0;
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
