import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AD_SERVICE_BASE_URL } from '../core/api-config';
import { AnimalDetails } from '../models/animal-details.model';
import { AnimalRegistrationRequest } from '../models/animal-registration-request.model';

@Injectable({ providedIn: 'root' })
export class AnimalRegistrationService {
  private readonly http = inject(HttpClient);

  register(request: AnimalRegistrationRequest): Observable<AnimalDetails> {
    return this.http.post<AnimalDetails>(`${AD_SERVICE_BASE_URL}/api/v1/animals`, request);
  }
}
