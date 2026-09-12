import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AD_SERVICE_BASE_URL } from '../core/api-config';
import { AdvertiserAuthService } from './advertiser-auth.service';

describe('AdvertiserAuthService', () => {
  let service: AdvertiserAuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AdvertiserAuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
  });

  it('has no token before logging in', () => {
    expect(service.getToken()).toBeNull();
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('stores the token returned by a successful login', () => {
    service.login('jane', 'secret123').subscribe();

    const req = httpMock.expectOne(`${AD_SERVICE_BASE_URL}/api/v1/auth/advertiser-login`);
    expect(req.request.body).toEqual({ usernameOrEmail: 'jane', password: 'secret123' });
    req.flush({ token: 'jwt-token', expiresAt: '2026-01-01T00:00:00Z' });

    expect(service.getToken()).toBe('jwt-token');
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('clears the token on logout', () => {
    service.login('jane', 'secret123').subscribe();
    httpMock.expectOne(`${AD_SERVICE_BASE_URL}/api/v1/auth/advertiser-login`).flush({
      token: 'jwt-token',
      expiresAt: '2026-01-01T00:00:00Z',
    });

    service.logout();

    expect(service.getToken()).toBeNull();
  });
});
