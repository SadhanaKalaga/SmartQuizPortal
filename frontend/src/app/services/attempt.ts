import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttemptService {
  private apiUrl = 'http://localhost:5000/api/attempts';

  constructor(private http: HttpClient) {}

  submitAttempt(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  getMyAttempts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-attempts`);
  }

  getAttemptById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  getQuizAttempts(quizId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/quiz/${quizId}`);
  }
}
