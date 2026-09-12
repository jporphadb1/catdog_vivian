import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AD_SERVICE_BASE_URL } from '../core/api-config';
import { AnimalListingFilter } from '../models/animal-listing-filter.model';
import { AnimalSummary } from '../models/animal-summary.model';
import { PagedResponse } from '../models/paged-response.model';

@Injectable({ providedIn: 'root' })
export class AnimalListingService {
  private readonly http = inject(HttpClient);

  list(filter: AnimalListingFilter, page: number, size: number): Observable<PagedResponse<AnimalSummary>> {
    let params = new HttpParams().set('page', page).set('size', size);

    if (filter.species) {
      params = params.set('species', filter.species);
    }
    if (filter.breed) {
      params = params.set('breed', filter.breed);
    }
    if (filter.location) {
      params = params.set('location', filter.location);
    }

    return this.http.get<PagedResponse<AnimalSummary>>(`${AD_SERVICE_BASE_URL}/api/v1/animals`, { params });
  }
}
