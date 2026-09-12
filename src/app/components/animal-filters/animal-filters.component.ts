import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AnimalListingFilter } from '../../models/animal-listing-filter.model';

@Component({
  selector: 'app-animal-filters',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './animal-filters.component.html',
  styleUrl: './animal-filters.component.css',
})
export class AnimalFiltersComponent {
  @Output() readonly filterChange = new EventEmitter<AnimalListingFilter>();

  private readonly formBuilder = inject(FormBuilder);

  readonly form = this.formBuilder.nonNullable.group({
    species: [''],
    breed: [''],
    location: [''],
  });

  applyFilters(): void {
    const raw = this.form.getRawValue();
    this.filterChange.emit({
      species: raw.species.trim() || undefined,
      breed: raw.breed.trim() || undefined,
      location: raw.location.trim() || undefined,
    });
  }
}
