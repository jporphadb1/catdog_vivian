import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AdvertiserAuthService } from '../services/advertiser-auth.service';
import { AD_SERVICE_BASE_URL } from './api-config';

/**
 * Attaches the advertiser Bearer token only to requests aimed at our own Ad Service.
 * Never attach it to the S3 presigned-upload PUT (an absolute, third-party URL) — S3
 * authenticates that request via its own signed query string, and an unrelated
 * Authorization header makes S3 reject the request outright.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(AD_SERVICE_BASE_URL)) {
    return next(req);
  }

  const token = inject(AdvertiserAuthService).getToken();
  if (!token) {
    return next(req);
  }

  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
