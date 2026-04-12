import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { StudentDashboardComponent } from './components/student-dashboard/student-dashboard';
import { FacultyDashboardComponent } from './components/faculty-dashboard/faculty-dashboard';
import { QuizAttemptComponent } from './components/quiz-attempt/quiz-attempt';
import { QuizCreateComponent } from './components/quiz-create/quiz-create';
import { ResultsComponent } from './components/results/results';
import { authGuard, roleGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'student-dashboard', 
    component: StudentDashboardComponent,
    canActivate: [authGuard, roleGuard(['student'])]
  },
  { 
    path: 'faculty-dashboard', 
    component: FacultyDashboardComponent,
    canActivate: [authGuard, roleGuard(['faculty'])]
  },
  { 
    path: 'quiz/:id', 
    component: QuizAttemptComponent,
    canActivate: [authGuard, roleGuard(['student'])]
  },
  { 
    path: 'create-quiz', 
    component: QuizCreateComponent,
    canActivate: [authGuard, roleGuard(['faculty'])]
  },
  { 
    path: 'results/:id', 
    component: ResultsComponent,
    canActivate: [authGuard]
  }
];
