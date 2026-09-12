import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AD_SERVICE_BASE_URL } from '../core/api-config';
import { AuthToken } from '../models/auth-token.model';

const TOKEN_STORAGE_KEY = 'catdog.advertiser.token';

@Injectable({ providedIn: 'root' })
export class AdvertiserAuthService {
  private readonly http = inject(HttpClient);

  login(usernameOrEmail: string, password: string): Observable<AuthToken> {
    return this.http
      .post<AuthToken>(`${AD_SERVICE_BASE_URL}/api/v1/auth/advertiser-login`, { usernameOrEmail, password })
      .pipe(tap((authToken) => sessionStorage.setItem(TOKEN_STORAGE_KEY, authToken.token)));
  }

  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_STORAGE_KEY);
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  logout(): void {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}
