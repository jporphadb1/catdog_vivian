import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AD_SERVICE_BASE_URL } from '../core/api-config';
import { AnimalPhotoUploadService } from './animal-photo-upload.service';

describe('AnimalPhotoUploadService', () => {
  let service: AnimalPhotoUploadService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AnimalPhotoUploadService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('requests a presigned upload URL with the given content type', () => {
    service.requestUploadUrl('image/jpeg').subscribe();

    const req = httpMock.expectOne(`${AD_SERVICE_BASE_URL}/api/v1/animals/photo-upload-url`);
    expect(req.request.body).toEqual({ contentType: 'image/jpeg' });
    req.flush({
      uploadUrl: 'https://catdog-animal-photos-dev.s3.us-east-1.amazonaws.com/animals/x/y.jpg?X-Amz-Signature=abc',
      objectUrl: 'https://catdog-animal-photos-dev.s3.us-east-1.amazonaws.com/animals/x/y.jpg',
      expiresAt: '2026-01-01T00:10:00Z',
    });
  });

  it('uploads the file directly to the given absolute S3 URL', () => {
    const file = new File(['fake-bytes'], 'rex.jpg', { type: 'image/jpeg' });
    const uploadUrl = 'https://catdog-animal-photos-dev.s3.us-east-1.amazonaws.com/animals/x/y.jpg?X-Amz-Signature=abc';

    service.uploadPhoto(uploadUrl, file).subscribe();

    const req = httpMock.expectOne(uploadUrl);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Content-Type')).toBe('image/jpeg');
    req.flush(null);
  });
});
