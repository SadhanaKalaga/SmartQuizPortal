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
  questions: any[] = [{ question: '', options: ['', '', '', ''], correctAnswer: 0, points: 1 }];

  constructor(private quizService: QuizService, private router: Router) {}

  addQuestion(): void {
    this.questions.push({ question: '', options: ['', '', '', ''], correctAnswer: 0, points: 1 });
  }

  removeQuestion(index: number): void {
    this.questions.splice(index, 1);
  }

  onSubmit(): void {
    const quizData = {
      title: this.title,
      description: this.description,
      timeLimit: this.timeLimit,
      questions: this.questions
    };

    this.quizService.createQuiz(quizData).subscribe({
      next: () => this.router.navigate(['/faculty-dashboard']),
      error: (err) => console.error(err)
    });
  }
}
