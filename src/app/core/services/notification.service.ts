import { Injectable, signal } from '@angular/core';
import Swal from 'sweetalert2';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  queue = signal<any[]>([]); // Keep for compatibility but unused

  private toast = Swal.mixin({
    toast: true,
    position: 'top-end', // Changed back to top-end as requested
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });

  show(message: string, type: NotificationType = 'success') {
    this.toast.fire({
      icon: type,
      title: message,
      background: '#fff',
      color: '#0f172a', // slate-900
      iconColor: type === 'success' ? '#4f46e5' : (type === 'error' ? '#f43f5e' : (type === 'warning' ? '#f59e0b' : '#6366f1')),
      customClass: {
        popup: 'rounded-3xl border border-slate-100 shadow-2xl font-sans p-6'
      }
    });
  }

  async confirm(title: string, text: string, confirmButtonText = 'Sí, continuar'): Promise<boolean> {
    const result = await Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5', // indigo-600
      cancelButtonColor: '#94a3b8', // slate-400
      confirmButtonText,
      cancelButtonText: 'Cancelar',
      background: '#fff',
      color: '#0f172a',
      customClass: {
        popup: 'rounded-[2.5rem] border border-slate-100 shadow-2xl font-sans p-8',
        confirmButton: 'px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all',
        cancelButton: 'px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all'
      }
    });
    return result.isConfirmed;
  }

  dismiss(id: number) {}
}
