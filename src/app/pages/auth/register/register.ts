import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  email = signal('');
  password = signal('');
  confirmPassword = signal('');
  isLoading = signal(false);
  showPassword = signal(false);
  showConfirmPassword = signal(false);

  async onRegister() {
    if (!this.email() || !this.password() || !this.confirmPassword()) {
      this.notificationService.show('Por favor completa todos los campos', 'error');
      return;
    }

    if (this.password() !== this.confirmPassword()) {
      this.notificationService.show('Las contraseñas no coinciden', 'error');
      return;
    }

    if (this.password().length < 6) {
      this.notificationService.show('La contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }

    this.isLoading.set(true);
    try {
      const { data, error } = await this.authService.signUp(this.email(), this.password());
      
      if (error) {
        this.notificationService.show(error.message, 'error');
      } else {
        this.notificationService.show('¡Registro exitoso! Por favor verifica tu correo.', 'success');
        this.router.navigate(['/login']);
      }
    } catch (err) {
      this.notificationService.show('Ocurrió un error inesperado', 'error');
    } finally {
      this.isLoading.set(false);
    }
  }
}
