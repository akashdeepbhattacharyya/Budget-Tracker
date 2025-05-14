import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
    {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.routes').then((m) => m.routes),
    canActivate: [AuthGuard],
  },
  {
    path: 'transactions',
    loadChildren: () =>
      import('./transactions/transactions.routes').then((m) => m.routes),
    canActivate: [AuthGuard],
  },
  {
    path: 'budget',
    loadChildren: () => import('./budget/budget.routes').then((m) => m.routes),
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  { path: '**', redirectTo: '/dashboard' },
];
