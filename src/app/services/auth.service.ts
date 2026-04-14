import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

type AuthResponse = {
  token?: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly tokenKey = 'ims_token';
  private readonly baseUrl = 'http://localhost:3000/api/auth';

  private readonly tokenSignal = signal<string | null>(this.readToken());
  readonly token = computed(() => this.tokenSignal());
  readonly isAuthenticated = computed(() => !!this.tokenSignal());

  login(payload: LoginRequest): Observable<void> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, payload).pipe(
      tap((res) => {
        if (res.token) {
          this.setToken(res.token);
        }
      }),
      map(() => void 0),
    );
  }

  register(payload: RegisterRequest): Observable<void> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, payload).pipe(
      tap((res) => {
        if (res.token) {
          this.setToken(res.token);
        }
      }),
      map(() => void 0),
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.tokenSignal.set(null);
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.tokenSignal.set(token);
  }

  private readToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
