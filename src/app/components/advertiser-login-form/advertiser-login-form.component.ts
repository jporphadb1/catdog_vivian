import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdvertiserAuthService } from '../../services/advertiser-auth.service';

@Component({
  selector: 'app-advertiser-login-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './advertiser-login-form.component.html',
  styleUrl: './advertiser-login-form.component.css',
})
export class AdvertiserLoginFormComponent {
  @Output() readonly loggedIn = new EventEmitter<void>();

  private readonly formBuilder = inject(FormBuilder);
  private readonly advertiserAuthService = inject(AdvertiserAuthService);

  readonly form = this.formBuilder.nonNullable.group({
    usernameOrEmail: ['', Validators.required],
    password: ['', Validators.required],
  });

  loggingIn = false;
  errorMessage: string | null = null;

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage = null;
    this.loggingIn = true;
    const { usernameOrEmail, password } = this.form.getRawValue();

    this.advertiserAuthService.login(usernameOrEmail, password).subscribe({
      next: () => {
        this.loggingIn = false;
        this.loggedIn.emit();
      },
      error: () => {
        this.loggingIn = false;
        this.errorMessage = 'Usuário/e-mail ou senha inválidos.';
      },
    });
  }
}
