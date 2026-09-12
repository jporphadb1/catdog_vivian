import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { AnimalListingFilter } from '../../models/animal-listing-filter.model';
import { AnimalSummary } from '../../models/animal-summary.model';
import { PagedResponse } from '../../models/paged-response.model';
import { AnimalListingService } from '../../services/animal-listing.service';
import { AnimalListingPageComponent } from './animal-listing-page.component';

type ListFn = (filter: AnimalListingFilter, page: number, size: number) => Observable<PagedResponse<AnimalSummary>>;

describe('AnimalListingPageComponent', () => {
  let fixture: ComponentFixture<AnimalListingPageComponent>;
  let listingServiceSpy: jasmine.SpyObj<AnimalListingService>;

  function pageOf(content: AnimalSummary[], totalPages = 1): PagedResponse<AnimalSummary> {
    return { content, page: { size: 20, number: 0, totalElements: content.length, totalPages } };
  }

  function configureWith(listFn: ListFn): void {
    listingServiceSpy = jasmine.createSpyObj('AnimalListingService', ['list']);
    listingServiceSpy.list.and.callFake(listFn);

    TestBed.configureTestingModule({
      imports: [AnimalListingPageComponent],
      providers: [{ provide: AnimalListingService, useValue: listingServiceSpy }],
    });

    fixture = TestBed.createComponent(AnimalListingPageComponent);
  }

  it('shows the empty-state message when no animal matches the current filters', () => {
    configureWith(() => of(pageOf([])));
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Nenhum animal encontrado com os filtros selecionados.');
  });

  it('renders one card per animal when the listing has results', () => {
    const animal: AnimalSummary = {
      id: 'a1',
      photoUrl: 'https://example-bucket.s3.amazonaws.com/rex.jpg',
      advertiserName: 'jane',
      descriptionSummary: 'Friendly dog.',
      location: 'São Paulo, SP',
    };
    configureWith(() => of(pageOf([animal])));
    fixture.detectChanges();

    const cards = (fixture.nativeElement as HTMLElement).querySelectorAll('app-animal-card');
    expect(cards.length).toBe(1);
  });

  it('shows an error message when the listing request fails', () => {
    configureWith(() => throwError(() => new Error('network error')));
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Não foi possível carregar os animais. Tente novamente.');
  });

  it('reloads page 0 whenever the filters change', () => {
    configureWith(() => of(pageOf([])));
    fixture.detectChanges();
    listingServiceSpy.list.calls.reset();

    fixture.componentInstance.onFilterChange({ species: 'Dog' });

    expect(listingServiceSpy.list).toHaveBeenCalledWith({ species: 'Dog' }, 0, 20);
  });
});
