import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css']
})
export class ForgotPassword {
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  email = signal('');
  isLoading = signal(false);
  isSent = signal(false);

  async onReset() {
    if (!this.email()) {
      this.notificationService.show('Por favor ingresa tu correo', 'error');
      return;
    }

    this.isLoading.set(true);
    try {
      const { error } = await this.authService.resetPassword(this.email());
      
      if (error) {
        this.notificationService.show(error.message, 'error');
      } else {
        this.notificationService.show('¡Enlace de recuperación enviado!', 'success');
        this.isSent.set(true);
      }
    } catch (err) {
      this.notificationService.show('Ocurrió un error inesperado', 'error');
    } finally {
      this.isLoading.set(false);
    }
  }
}
