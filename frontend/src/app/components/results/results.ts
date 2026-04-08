import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AttemptService } from '../../services/attempt';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results.html',
  styleUrl: './results.css'
})
export class ResultsComponent implements OnInit {
  attempt: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private attemptService: AttemptService
  ) {}

  ngOnInit(): void {
    const attemptId = this.route.snapshot.paramMap.get('id')!;
    this.attemptService.getAttemptById(attemptId).subscribe({
      next: (res) => this.attempt = res.attempt,
      error: (err) => console.error(err)
    });
  }

  goBack(): void {
    this.router.navigate(['/student-dashboard']);
  }
}
