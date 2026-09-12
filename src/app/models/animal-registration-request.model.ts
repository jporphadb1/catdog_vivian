export interface AnimalRegistrationRequest {
  species: string;
  breed?: string;
  name?: string;
  birthDate?: string;
  description: string;
  location: string;
  photoUrl: string;
}
