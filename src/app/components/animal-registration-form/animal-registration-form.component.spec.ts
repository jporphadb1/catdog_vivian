import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AnimalDetails } from '../../models/animal-details.model';
import { AnimalPhotoUploadService } from '../../services/animal-photo-upload.service';
import { AnimalRegistrationService } from '../../services/animal-registration.service';
import { AnimalRegistrationFormComponent } from './animal-registration-form.component';

describe('AnimalRegistrationFormComponent', () => {
  let fixture: ComponentFixture<AnimalRegistrationFormComponent>;
  let photoUploadSpy: jasmine.SpyObj<AnimalPhotoUploadService>;
  let registrationSpy: jasmine.SpyObj<AnimalRegistrationService>;

  const registeredAnimal: AnimalDetails = {
    id: 'a1',
    species: 'Dog',
    breed: null,
    name: null,
    birthDate: null,
    description: 'Friendly dog.',
    location: 'São Paulo, SP',
    photoUrl: 'https://example-bucket.s3.amazonaws.com/rex.jpg',
    status: 'AVAILABLE',
    createdAt: '2026-01-01T00:00:00Z',
  };

  beforeEach(async () => {
    photoUploadSpy = jasmine.createSpyObj('AnimalPhotoUploadService', ['requestUploadUrl', 'uploadPhoto']);
    registrationSpy = jasmine.createSpyObj('AnimalRegistrationService', ['register']);

    await TestBed.configureTestingModule({
      imports: [AnimalRegistrationFormComponent],
      providers: [
        { provide: AnimalPhotoUploadService, useValue: photoUploadSpy },
        { provide: AnimalRegistrationService, useValue: registrationSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AnimalRegistrationFormComponent);
    fixture.detectChanges();
  });

  function fillRequiredFields(): void {
    fixture.componentInstance.form.setValue({
      species: 'Dog',
      breed: '',
      name: '',
      birthDate: '',
      description: 'Friendly dog.',
      location: 'São Paulo, SP',
    });
  }

  function selectFile(): void {
    fixture.componentInstance.selectedFile = new File(['bytes'], 'rex.jpg', { type: 'image/jpeg' });
  }

  it('shows an error and calls no service when no photo was selected', () => {
    fillRequiredFields();

    fixture.componentInstance.submit();

    expect(photoUploadSpy.requestUploadUrl).not.toHaveBeenCalled();
    expect(fixture.componentInstance.errorMessage).toBe('Selecione uma foto do animal.');
  });

  it('does not call any service when a required field is missing', () => {
    selectFile();

    fixture.componentInstance.submit();

    expect(photoUploadSpy.requestUploadUrl).not.toHaveBeenCalled();
  });

  it('uploads the photo then registers the animal with the resulting object URL', () => {
    fillRequiredFields();
    selectFile();
    photoUploadSpy.requestUploadUrl.and.returnValue(
      of({
        uploadUrl: 'https://example-bucket.s3.amazonaws.com/animals/x/rex.jpg?X-Amz-Signature=abc',
        objectUrl: 'https://example-bucket.s3.amazonaws.com/animals/x/rex.jpg',
        expiresAt: '2026-01-01T00:10:00Z',
      }),
    );
    photoUploadSpy.uploadPhoto.and.returnValue(of(undefined));
    registrationSpy.register.and.returnValue(of(registeredAnimal));

    fixture.componentInstance.submit();

    expect(photoUploadSpy.requestUploadUrl).toHaveBeenCalledWith('image/jpeg');
    expect(photoUploadSpy.uploadPhoto).toHaveBeenCalledWith(
      'https://example-bucket.s3.amazonaws.com/animals/x/rex.jpg?X-Amz-Signature=abc',
      jasmine.any(File),
    );
    expect(registrationSpy.register).toHaveBeenCalledWith({
      species: 'Dog',
      breed: undefined,
      name: undefined,
      birthDate: undefined,
      description: 'Friendly dog.',
      location: 'São Paulo, SP',
      photoUrl: 'https://example-bucket.s3.amazonaws.com/animals/x/rex.jpg',
    });
    expect(fixture.componentInstance.successMessage).toBe('Animal cadastrado com sucesso.');
  });

  it('populates field-level errors when the backend rejects a missing required field', () => {
    fillRequiredFields();
    selectFile();
    photoUploadSpy.requestUploadUrl.and.returnValue(
      of({
        uploadUrl: 'https://example-bucket.s3.amazonaws.com/animals/x/rex.jpg?X-Amz-Signature=abc',
        objectUrl: 'https://example-bucket.s3.amazonaws.com/animals/x/rex.jpg',
        expiresAt: '2026-01-01T00:10:00Z',
      }),
    );
    photoUploadSpy.uploadPhoto.and.returnValue(of(undefined));
    registrationSpy.register.and.returnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 400,
            error: { errors: { description: 'must not be blank' } },
          }),
      ),
    );

    fixture.componentInstance.submit();

    expect(fixture.componentInstance.fieldErrors['description']).toBe('must not be blank');
    expect(fixture.componentInstance.errorMessage).toBeNull();
  });

  it('shows a generic error message on an unexpected failure', () => {
    fillRequiredFields();
    selectFile();
    photoUploadSpy.requestUploadUrl.and.returnValue(throwError(() => new HttpErrorResponse({ status: 500 })));

    fixture.componentInstance.submit();

    expect(fixture.componentInstance.errorMessage).toBe('Não foi possível cadastrar o animal. Tente novamente.');
  });
});
