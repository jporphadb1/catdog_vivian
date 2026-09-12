import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, switchMap } from 'rxjs';
import { AnimalPhotoUploadService } from '../../services/animal-photo-upload.service';
import { AnimalRegistrationService } from '../../services/animal-registration.service';

interface FieldErrors {
  [field: string]: string;
}

@Component({
  selector: 'app-animal-registration-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './animal-registration-form.component.html',
  styleUrl: './animal-registration-form.component.css',
})
export class AnimalRegistrationFormComponent {
  @Output() readonly registered = new EventEmitter<void>();

  private readonly formBuilder = inject(FormBuilder);
  private readonly photoUploadService = inject(AnimalPhotoUploadService);
  private readonly animalRegistrationService = inject(AnimalRegistrationService);

  readonly form = this.formBuilder.nonNullable.group({
    species: ['', Validators.required],
    breed: [''],
    name: [''],
    birthDate: [''],
    description: ['', Validators.required],
    location: ['', Validators.required],
  });

  selectedFile: File | null = null;
  submitting = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  fieldErrors: FieldErrors = {};

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
  }

  submit(): void {
    this.errorMessage = null;
    this.fieldErrors = {};
    this.successMessage = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.selectedFile) {
      this.errorMessage = 'Selecione uma foto do animal.';
      return;
    }

    this.submitting = true;
    const file = this.selectedFile;
    const raw = this.form.getRawValue();

    this.photoUploadService
      .requestUploadUrl(file.type)
      .pipe(
        switchMap((presigned) =>
          this.photoUploadService.uploadPhoto(presigned.uploadUrl, file).pipe(map(() => presigned.objectUrl)),
        ),
        switchMap((photoUrl) =>
          this.animalRegistrationService.register({
            species: raw.species,
            breed: raw.breed || undefined,
            name: raw.name || undefined,
            birthDate: raw.birthDate || undefined,
            description: raw.description,
            location: raw.location,
            photoUrl,
          }),
        ),
      )
      .subscribe({
        next: () => {
          this.submitting = false;
          this.successMessage = 'Animal cadastrado com sucesso.';
          this.form.reset();
          this.selectedFile = null;
          this.registered.emit();
        },
        error: (error: HttpErrorResponse) => {
          this.submitting = false;
          if (error.status === 400 && error.error?.errors) {
            this.fieldErrors = error.error.errors as FieldErrors;
          } else {
            this.errorMessage = 'Não foi possível cadastrar o animal. Tente novamente.';
          }
        },
      });
  }
}
