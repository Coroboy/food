import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  email = signal('');
  password = signal('');
  isLoading = signal(false);
  showPassword = signal(false);

  async onLogin() {
    this.isLoading.set(true);
    // Simulate a small delay for better UX
    setTimeout(() => {
      this.authService.mockLogin();
      this.notificationService.show('¡Bienvenido (Acceso Directo)!', 'success');
      this.isLoading.set(false);
    }, 500);
  }
}
