import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Admin } from './pages/admin/admin';
import { Cart } from './pages/cart/cart';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'admin', component: Admin },
    { path: 'cart', component: Cart }
];
