import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styles: ``,
})
export class Navbar {
  isMenuOpen = signal(false);
  cartService = inject(CartService);
  private authService = inject(AuthService);
  
  // Use toSignal to track auth state reactively
  isLoggedIn = toSignal(this.authService.user$, { initialValue: false });

  logout() {
    this.authService.signOut();
  }
}
