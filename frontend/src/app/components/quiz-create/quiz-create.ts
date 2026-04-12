import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { QuizService } from '../../services/quiz';

@Component({
  selector: 'app-quiz-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quiz-create.html',
  styleUrl: './quiz-create.css'
})
export class QuizCreateComponent {
  title = '';
  description = '';
  timeLimit = 30;
  startTime = '';
  endTime = '';
  maxAttempts = 1;
  questions: any[] = [{ question: '', options: ['', '', '', ''], correctAnswer: 0, points: 1 }];
  error = '';

  constructor(private quizService: QuizService, private router: Router) {
    // Set default start time to now
    const now = new Date();
    this.startTime = now.toISOString().slice(0, 16);
    
    // Set default end time to 1 week from now
    const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    this.endTime = weekLater.toISOString().slice(0, 16);
  }

  addQuestion(): void {
    this.questions.push({ question: '', options: ['', '', '', ''], correctAnswer: 0, points: 1 });
  }

  removeQuestion(index: number): void {
    this.questions.splice(index, 1);
  }

  onSubmit(): void {
    this.error = '';

    if (new Date(this.startTime) >= new Date(this.endTime)) {
      this.error = 'End time must be after start time';
      return;
    }

    const quizData = {
      title: this.title,
      description: this.description,
      timeLimit: this.timeLimit,
      startTime: new Date(this.startTime).toISOString(),
      endTime: new Date(this.endTime).toISOString(),
      maxAttempts: this.maxAttempts,
      questions: this.questions
    };

    this.quizService.createQuiz(quizData).subscribe({
      next: () => this.router.navigate(['/faculty-dashboard']),
      error: (err) => this.error = err.error?.message || 'Failed to create quiz'
    });
  }
}
