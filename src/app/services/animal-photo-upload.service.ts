import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AD_SERVICE_BASE_URL } from '../core/api-config';
import { PresignedUploadResponse } from '../models/presigned-upload-response.model';

@Injectable({ providedIn: 'root' })
export class AnimalPhotoUploadService {
  private readonly http = inject(HttpClient);

  requestUploadUrl(contentType: string): Observable<PresignedUploadResponse> {
    return this.http.post<PresignedUploadResponse>(`${AD_SERVICE_BASE_URL}/api/v1/animals/photo-upload-url`, {
      contentType,
    });
  }

  /**
   * Uploads directly to the S3 presigned URL — an absolute, third-party URL that must
   * never carry our own Authorization header (see core/auth.interceptor.ts).
   */
  uploadPhoto(uploadUrl: string, file: File): Observable<void> {
    return this.http.put<void>(uploadUrl, file, { headers: { 'Content-Type': file.type } });
  }
}
