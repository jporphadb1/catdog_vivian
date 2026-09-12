import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AD_SERVICE_BASE_URL } from '../core/api-config';
import { AnimalRegistrationService } from './animal-registration.service';

describe('AnimalRegistrationService', () => {
  let service: AnimalRegistrationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AnimalRegistrationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('posts the registration request to /api/v1/animals', () => {
    const request = {
      species: 'Dog',
      description: 'Friendly dog.',
      location: 'São Paulo, SP',
      photoUrl: 'https://example-bucket.s3.amazonaws.com/rex.jpg',
    };

    service.register(request).subscribe();

    const req = httpMock.expectOne(`${AD_SERVICE_BASE_URL}/api/v1/animals`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush({
      id: 'a1',
      species: 'Dog',
      breed: null,
      name: null,
      birthDate: null,
      description: 'Friendly dog.',
      location: 'São Paulo, SP',
      photoUrl: request.photoUrl,
      status: 'AVAILABLE',
      createdAt: '2026-01-01T00:00:00Z',
    });
  });
});
