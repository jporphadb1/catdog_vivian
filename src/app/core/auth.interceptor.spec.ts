import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AD_SERVICE_BASE_URL } from './api-config';
import { authInterceptor } from './auth.interceptor';
import { AdvertiserAuthService } from '../services/advertiser-auth.service';

describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([authInterceptor])), provideHttpClientTesting()],
    });
    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
  });

  it('attaches the Bearer token to requests aimed at the Ad Service', () => {
    TestBed.inject(AdvertiserAuthService).login('jane', 'secret123').subscribe();
    httpMock
      .expectOne(`${AD_SERVICE_BASE_URL}/api/v1/auth/advertiser-login`)
      .flush({ token: 'jwt-token', expiresAt: '2026-01-01T00:00:00Z' });

    httpClient.get(`${AD_SERVICE_BASE_URL}/api/v1/animals`).subscribe();

    const req = httpMock.expectOne(`${AD_SERVICE_BASE_URL}/api/v1/animals`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer jwt-token');
    req.flush({});
  });

  it('never attaches the Bearer token to the absolute S3 presigned URL', () => {
    TestBed.inject(AdvertiserAuthService).login('jane', 'secret123').subscribe();
    httpMock
      .expectOne(`${AD_SERVICE_BASE_URL}/api/v1/auth/advertiser-login`)
      .flush({ token: 'jwt-token', expiresAt: '2026-01-01T00:00:00Z' });

    const s3Url = 'https://catdog-animal-photos-dev.s3.us-east-1.amazonaws.com/animals/x/y.jpg?X-Amz-Signature=abc';
    httpClient.put(s3Url, new Blob()).subscribe();

    const req = httpMock.expectOne(s3Url);
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush(null);
  });

  it('does not attach a header when there is no token yet', () => {
    httpClient.get(`${AD_SERVICE_BASE_URL}/api/v1/animals`).subscribe();

    const req = httpMock.expectOne(`${AD_SERVICE_BASE_URL}/api/v1/animals`);
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });
});
