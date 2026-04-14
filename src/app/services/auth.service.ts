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

type JwtPayload = {
  name?: string;
  username?: string;
  email?: string;
  sub?: string;
};

function parseJwtPayload(token: string): JwtPayload | null {
  const parts = token.split('.');
  if (parts.length < 2) return null;

  const payloadPart = parts[1];
  try {
    const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const json = atob(padded);
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

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

  readonly user = computed(() => {
    const token = this.tokenSignal();
    if (!token) return null;
    return parseJwtPayload(token);
  });

  readonly displayName = computed(() => {
    const user = this.user();
    if (!user) return null;

    return user.name ?? user.username ?? user.email ?? user.sub ?? 'User';
  });

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
