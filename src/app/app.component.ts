import { Component } from '@angular/core';
import { AnimalListingPageComponent } from './components/animal-listing-page/animal-listing-page.component';
import { AnimalRegistrationPageComponent } from './components/animal-registration-page/animal-registration-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AnimalListingPageComponent, AnimalRegistrationPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'CatDog';
}
