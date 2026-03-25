import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  private userSubject = new BehaviorSubject<User | null>(null);
  private _isMockLoggedIn = new BehaviorSubject<boolean>(localStorage.getItem('isMockLoggedIn') === 'true');

  constructor(private supabaseService: SupabaseService, private router: Router) {
    this.supabase = this.supabaseService.client;
    
    // Check initial session
    this.supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        this.userSubject.next(session.user);
      }
    });

    // Listen for auth changes
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.userSubject.next(session?.user ?? null);
      if (event === 'SIGNED_OUT') {
        this.clearMockLogin();
        this.router.navigate(['/login']);
      }
    });
  }

  get user$(): Observable<User | null | boolean> {
    return combineLatest([this._isMockLoggedIn, this.userSubject]).pipe(
      map(([isMock, user]) => isMock || user != null ? true : null)
    );
  }

  get isLoggedIn(): boolean {
    return this._isMockLoggedIn.value || this.userSubject.value != null;
  }

  async signUp(email: string, password: string) {
    return await this.supabase.auth.signUp({ email, password });
  }

  async signIn(email: string, password: string) {
    return await this.supabase.auth.signInWithPassword({ email, password });
  }

  mockLogin() {
    localStorage.setItem('isMockLoggedIn', 'true');
    this._isMockLoggedIn.next(true);
    this.router.navigate(['/']);
  }

  private clearMockLogin() {
    localStorage.removeItem('isMockLoggedIn');
    this._isMockLoggedIn.next(false);
  }

  async signOut() {
    await this.supabase.auth.signOut();
    this.clearMockLogin();
    this.router.navigate(['/login']);
  }

  async resetPassword(email: string) {
    return await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  }
}
