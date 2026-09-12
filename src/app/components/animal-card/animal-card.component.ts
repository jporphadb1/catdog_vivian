import { Component, Input } from '@angular/core';
import { AnimalSummary } from '../../models/animal-summary.model';

@Component({
  selector: 'app-animal-card',
  standalone: true,
  templateUrl: './animal-card.component.html',
  styleUrl: './animal-card.component.css',
})
export class AnimalCardComponent {
  @Input({ required: true }) animal!: AnimalSummary;
}
