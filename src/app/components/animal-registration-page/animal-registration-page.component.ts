import { Component, inject } from '@angular/core';
import { AdvertiserAuthService } from '../../services/advertiser-auth.service';
import { AdvertiserLoginFormComponent } from '../advertiser-login-form/advertiser-login-form.component';
import { AnimalRegistrationFormComponent } from '../animal-registration-form/animal-registration-form.component';

@Component({
  selector: 'app-animal-registration-page',
  standalone: true,
  imports: [AdvertiserLoginFormComponent, AnimalRegistrationFormComponent],
  templateUrl: './animal-registration-page.component.html',
})
export class AnimalRegistrationPageComponent {
  private readonly advertiserAuthService = inject(AdvertiserAuthService);

  isAuthenticated = this.advertiserAuthService.isAuthenticated();

  onLoggedIn(): void {
    this.isAuthenticated = true;
  }
}
