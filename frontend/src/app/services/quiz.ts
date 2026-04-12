import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private apiUrl = `${environment.apiUrl}/quizzes`;

  constructor(private http: HttpClient) {}

  createQuiz(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  getAllQuizzes(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getQuizById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  getMyQuizzes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-quizzes`);
  }

  updateQuiz(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteQuiz(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
