import { Component, OnInit, inject } from '@angular/core';
import { AnimalListingFilter } from '../../models/animal-listing-filter.model';
import { AnimalSummary } from '../../models/animal-summary.model';
import { AnimalListingService } from '../../services/animal-listing.service';
import { AnimalCardComponent } from '../animal-card/animal-card.component';
import { AnimalFiltersComponent } from '../animal-filters/animal-filters.component';

const DEFAULT_PAGE_SIZE = 20;

@Component({
  selector: 'app-animal-listing-page',
  standalone: true,
  imports: [AnimalCardComponent, AnimalFiltersComponent],
  templateUrl: './animal-listing-page.component.html',
  styleUrl: './animal-listing-page.component.css',
})
export class AnimalListingPageComponent implements OnInit {
  private readonly animalListingService = inject(AnimalListingService);

  animals: AnimalSummary[] = [];
  loading = false;
  errorMessage: string | null = null;

  private filter: AnimalListingFilter = {};
  pageNumber = 0;
  totalPages = 0;

  ngOnInit(): void {
    this.loadPage();
  }

  onFilterChange(filter: AnimalListingFilter): void {
    this.filter = filter;
    this.pageNumber = 0;
    this.loadPage();
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages) {
      return;
    }
    this.pageNumber = page;
    this.loadPage();
  }

  private loadPage(): void {
    this.loading = true;
    this.errorMessage = null;

    this.animalListingService.list(this.filter, this.pageNumber, DEFAULT_PAGE_SIZE).subscribe({
      next: (response) => {
        this.animals = response.content;
        this.totalPages = response.page.totalPages;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Não foi possível carregar os animais. Tente novamente.';
        this.loading = false;
      },
    });
  }
}
