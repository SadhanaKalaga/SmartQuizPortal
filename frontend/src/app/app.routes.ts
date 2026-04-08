import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { StudentDashboardComponent } from './components/student-dashboard/student-dashboard';
import { FacultyDashboardComponent } from './components/faculty-dashboard/faculty-dashboard';
import { QuizAttemptComponent } from './components/quiz-attempt/quiz-attempt';
import { QuizCreateComponent } from './components/quiz-create/quiz-create';
import { ResultsComponent } from './components/results/results';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'student-dashboard', component: StudentDashboardComponent },
  { path: 'faculty-dashboard', component: FacultyDashboardComponent },
  { path: 'quiz/:id', component: QuizAttemptComponent },
  { path: 'create-quiz', component: QuizCreateComponent },
  { path: 'results/:id', component: ResultsComponent }
];
