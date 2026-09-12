import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnimalListingFilter } from '../../models/animal-listing-filter.model';
import { AnimalFiltersComponent } from './animal-filters.component';

describe('AnimalFiltersComponent', () => {
  let fixture: ComponentFixture<AnimalFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimalFiltersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnimalFiltersComponent);
    fixture.detectChanges();
  });

  it('emits the trimmed filter values on submit', () => {
    let emitted: AnimalListingFilter | undefined;
    fixture.componentInstance.filterChange.subscribe((value) => (emitted = value));

    fixture.componentInstance.form.setValue({
      species: '  Dog  ',
      breed: 'SRD',
      location: '  São Paulo, SP  ',
    });
    fixture.componentInstance.applyFilters();

    expect(emitted).toEqual({ species: 'Dog', breed: 'SRD', location: 'São Paulo, SP' });
  });

  it('omits fields left blank instead of emitting empty strings', () => {
    let emitted: AnimalListingFilter | undefined;
    fixture.componentInstance.filterChange.subscribe((value) => (emitted = value));

    fixture.componentInstance.form.setValue({ species: 'Cat', breed: '', location: '   ' });
    fixture.componentInstance.applyFilters();

    expect(emitted).toEqual({ species: 'Cat', breed: undefined, location: undefined });
  });
});
