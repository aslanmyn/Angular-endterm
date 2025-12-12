import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Signup } from './signup';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';

describe('Signup', () => {
  let component: Signup;
  let fixture: ComponentFixture<Signup>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['signup'], {
      currentUser$: of(null)
    });

    await TestBed.configureTestingModule({
      imports: [
        Signup,
        ReactiveFormsModule,
        RouterTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Signup);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.form.get('email')?.value).toBe('');
    expect(component.form.get('password')?.value).toBe('');
    expect(component.form.get('confirmPassword')?.value).toBe('');
  });

  it('should validate password strength', () => {
    component.form.patchValue({
      email: 'test@example.com',
      password: 'weak',
      confirmPassword: 'weak'
    });
    expect(component.form.get('password')?.hasError('weakPassword')).toBe(true);
  });

  it('should validate password has number and special char', () => {
    component.form.patchValue({
      email: 'test@example.com',
      password: 'password123!',
      confirmPassword: 'password123!'
    });
    expect(component.form.get('password')?.hasError('weakPassword')).toBeFalsy();
  });

  it('should validate passwords match', () => {
    component.form.patchValue({
      email: 'test@example.com',
      password: 'password123!',
      confirmPassword: 'different123!'
    });
    expect(component.form.hasError('passwordsMismatch')).toBe(true);
  });

  it('should call authService.signup on submit with valid form', async () => {
    authService.signup.and.returnValue(Promise.resolve());
    component.form.patchValue({
      email: 'test@example.com',
      password: 'password123!',
      confirmPassword: 'password123!'
    });

    await component.onSubmit();

    expect(authService.signup).toHaveBeenCalledWith('test@example.com', 'password123!');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/profile');
  });

  it('should not submit if form is invalid', async () => {
    await component.onSubmit();
    expect(authService.signup).not.toHaveBeenCalled();
  });
});





