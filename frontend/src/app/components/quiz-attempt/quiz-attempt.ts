import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../../services/quiz';
import { AttemptService } from '../../services/attempt';

@Component({
  selector: 'app-quiz-attempt',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quiz-attempt.html',
  styleUrl: './quiz-attempt.css'
})
export class QuizAttemptComponent implements OnInit {
  quiz: any;
  answers: any[] = [];
  timeRemaining = 0;
  timer: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService,
    private attemptService: AttemptService
  ) {}

  ngOnInit(): void {
    const quizId = this.route.snapshot.paramMap.get('id')!;
    this.quizService.getQuizById(quizId).subscribe({
      next: (res) => {
        this.quiz = res.quiz;
        this.timeRemaining = this.quiz.timeLimit * 60;
        this.answers = this.quiz.questions.map((_: any, i: number) => ({ questionIndex: i, selectedOption: -1 }));
        this.startTimer();
      },
      error: (err) => {
        alert(err.error?.message || 'Cannot access quiz');
        this.router.navigate(['/student-dashboard']);
      }
    });
  }

  startTimer(): void {
    this.timer = setInterval(() => {
      this.timeRemaining--;
      if (this.timeRemaining <= 0) {
        this.submitQuiz();
      }
    }, 1000);
  }

  submitQuiz(): void {
    clearInterval(this.timer);
    const validAnswers = this.answers.filter(a => a.selectedOption !== -1);
    
    this.attemptService.submitAttempt({ quizId: this.quiz._id, answers: validAnswers }).subscribe({
      next: (res) => this.router.navigate(['/results', res.attempt._id]),
      error: (err) => console.error(err)
    });
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }
}
