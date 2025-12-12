import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Login } from './login';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login'], {
      currentUser$: of(null)
    });

    await TestBed.configureTestingModule({
      imports: [
        Login,
        ReactiveFormsModule,
        RouterTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.form.get('email')?.value).toBe('');
    expect(component.form.get('password')?.value).toBe('');
  });

  it('should mark form as invalid when empty', () => {
    expect(component.form.invalid).toBe(true);
  });

  it('should mark form as valid with correct values', () => {
    component.form.patchValue({
      email: 'test@example.com',
      password: 'password123'
    });
    expect(component.form.valid).toBe(true);
  });

  it('should validate email format', () => {
    component.form.patchValue({ email: 'invalid-email' });
    expect(component.form.get('email')?.invalid).toBe(true);
  });

  it('should call authService.login on submit with valid form', async () => {
    authService.login.and.returnValue(Promise.resolve());
    component.form.patchValue({
      email: 'test@example.com',
      password: 'password123'
    });

    await component.submit();

    expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(router.navigate).toHaveBeenCalledWith(['/profile']);
  });

  it('should not submit if form is invalid', async () => {
    await component.submit();
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should set error on login failure', async () => {
    authService.login.and.returnValue(Promise.reject(new Error('Login failed')));
    component.form.patchValue({
      email: 'test@example.com',
      password: 'password123'
    });

    await component.submit();

    expect(component.error()).toBe('Login failed');
  });
});





