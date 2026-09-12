import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnimalCardComponent } from './animal-card.component';

describe('AnimalCardComponent', () => {
  let fixture: ComponentFixture<AnimalCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimalCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnimalCardComponent);
    fixture.componentInstance.animal = {
      id: 'a1',
      photoUrl: 'https://example-bucket.s3.amazonaws.com/rex.jpg',
      advertiserName: 'jane',
      descriptionSummary: 'Friendly and playful dog looking for a home.',
      location: 'São Paulo, SP',
    };
    fixture.detectChanges();
  });

  it('renders the advertiser name, description and location', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('jane');
    expect(text).toContain('Friendly and playful dog looking for a home.');
    expect(text).toContain('São Paulo, SP');
  });

  it('renders the photo with a non-empty alt text', () => {
    const img = (fixture.nativeElement as HTMLElement).querySelector('img');
    expect(img?.src).toContain('rex.jpg');
    expect(img?.alt).toBeTruthy();
  });
});
