import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AdvertiserAuthService } from '../../services/advertiser-auth.service';
import { AdvertiserLoginFormComponent } from './advertiser-login-form.component';

describe('AdvertiserLoginFormComponent', () => {
  let fixture: ComponentFixture<AdvertiserLoginFormComponent>;
  let authServiceSpy: jasmine.SpyObj<AdvertiserAuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AdvertiserAuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [AdvertiserLoginFormComponent],
      providers: [{ provide: AdvertiserAuthService, useValue: authServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(AdvertiserLoginFormComponent);
    fixture.detectChanges();
  });

  it('does not call the auth service when the form is invalid', () => {
    fixture.componentInstance.submit();

    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('emits loggedIn on a successful login', () => {
    authServiceSpy.login.and.returnValue(of({ token: 'jwt-token', expiresAt: '2026-01-01T00:00:00Z' }));
    let emitted = false;
    fixture.componentInstance.loggedIn.subscribe(() => (emitted = true));

    fixture.componentInstance.form.setValue({ usernameOrEmail: 'jane', password: 'secret123' });
    fixture.componentInstance.submit();

    expect(authServiceSpy.login).toHaveBeenCalledWith('jane', 'secret123');
    expect(emitted).toBeTrue();
  });

  it('shows a generic error message when the login fails', () => {
    authServiceSpy.login.and.returnValue(throwError(() => new Error('unauthorized')));

    fixture.componentInstance.form.setValue({ usernameOrEmail: 'jane', password: 'wrong' });
    fixture.componentInstance.submit();
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Usuário/e-mail ou senha inválidos.');
  });
});
