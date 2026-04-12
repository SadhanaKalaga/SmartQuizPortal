import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { QuizService } from '../../services/quiz';

@Component({
  selector: 'app-quiz-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quiz-create.html',
  styleUrl: './quiz-create.css'
})
export class QuizCreateComponent implements OnInit {
  title = '';
  description = '';
  timeLimit = 30;
  startTime = '';
  endTime = '';
  maxAttempts = 1;
  questions: any[] = [{ question: '', options: ['', '', '', ''], correctAnswer: 0, points: 1 }];
  error = '';
  isEditMode = false;
  quizId = '';

  constructor(
    private quizService: QuizService, 
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Set default start time to now
    const now = new Date();
    this.startTime = now.toISOString().slice(0, 16);
    
    // Set default end time to 1 week from now
    const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    this.endTime = weekLater.toISOString().slice(0, 16);
  }

  ngOnInit(): void {
    this.quizId = this.route.snapshot.paramMap.get('id') || '';
    if (this.quizId) {
      this.isEditMode = true;
      this.loadQuiz();
    }
  }

  loadQuiz(): void {
    this.quizService.getQuizById(this.quizId).subscribe({
      next: (res) => {
        const quiz = res.quiz;
        this.title = quiz.title;
        this.description = quiz.description;
        this.timeLimit = quiz.timeLimit;
        this.startTime = new Date(quiz.startTime).toISOString().slice(0, 16);
        this.endTime = new Date(quiz.endTime).toISOString().slice(0, 16);
        this.maxAttempts = quiz.maxAttempts;
        this.questions = quiz.questions;
      },
      error: (err) => {
        this.error = 'Failed to load quiz';
        console.error(err);
      }
    });
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

    const request = this.isEditMode 
      ? this.quizService.updateQuiz(this.quizId, quizData)
      : this.quizService.createQuiz(quizData);

    request.subscribe({
      next: () => this.router.navigate(['/faculty-dashboard']),
      error: (err) => this.error = err.error?.message || 'Failed to save quiz'
    });
  }
}
