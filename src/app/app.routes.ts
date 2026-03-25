import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Admin } from './pages/admin/admin';
import { Cart } from './pages/cart/cart';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { ForgotPassword } from './pages/auth/forgot-password/forgot-password';
import { authGuard, redirectIfLoggedInGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: '', component: Home, canActivate: [authGuard] },
    { path: 'admin', component: Admin, canActivate: [authGuard] },
    { path: 'cart', component: Cart, canActivate: [authGuard] },
    { path: 'login', component: Login, canActivate: [redirectIfLoggedInGuard] },
    { path: 'register', component: Register, canActivate: [redirectIfLoggedInGuard] },
    { path: 'forgot-password', component: ForgotPassword, canActivate: [redirectIfLoggedInGuard] },
    { path: '**', redirectTo: '' }
];
