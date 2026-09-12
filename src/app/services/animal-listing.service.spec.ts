import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AD_SERVICE_BASE_URL } from '../core/api-config';
import { PagedResponse } from '../models/paged-response.model';
import { AnimalSummary } from '../models/animal-summary.model';
import { AnimalListingService } from './animal-listing.service';

describe('AnimalListingService', () => {
  let service: AnimalListingService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AnimalListingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('requests only page and size when no filter is set', () => {
    service.list({}, 0, 20).subscribe();

    const req = httpMock.expectOne(
      (r) => r.url === `${AD_SERVICE_BASE_URL}/api/v1/animals`,
    );

    expect(req.request.params.get('page')).toBe('0');
    expect(req.request.params.get('size')).toBe('20');
    expect(req.request.params.has('species')).toBeFalse();
    expect(req.request.params.has('breed')).toBeFalse();
    expect(req.request.params.has('location')).toBeFalse();

    req.flush(emptyPage());
  });

  it('includes every filter field that is set', () => {
    service.list({ species: 'Dog', breed: 'SRD', location: 'São Paulo, SP' }, 1, 10).subscribe();

    const req = httpMock.expectOne(
      (r) => r.url === `${AD_SERVICE_BASE_URL}/api/v1/animals`,
    );

    expect(req.request.params.get('page')).toBe('1');
    expect(req.request.params.get('size')).toBe('10');
    expect(req.request.params.get('species')).toBe('Dog');
    expect(req.request.params.get('breed')).toBe('SRD');
    expect(req.request.params.get('location')).toBe('São Paulo, SP');

    req.flush(emptyPage());
  });

  it('omits a filter field left undefined without sending an empty parameter', () => {
    service.list({ species: 'Cat' }, 0, 20).subscribe();

    const req = httpMock.expectOne(
      (r) => r.url === `${AD_SERVICE_BASE_URL}/api/v1/animals`,
    );

    expect(req.request.params.get('species')).toBe('Cat');
    expect(req.request.params.has('breed')).toBeFalse();
    expect(req.request.params.has('location')).toBeFalse();

    req.flush(emptyPage());
  });

  function emptyPage(): PagedResponse<AnimalSummary> {
    return { content: [], page: { size: 20, number: 0, totalElements: 0, totalPages: 0 } };
  }
});
