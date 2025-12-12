import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { Auth } from '@angular/fire/auth';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let mockAuth: jasmine.SpyObj<Auth>;

  beforeEach(() => {
    mockAuth = jasmine.createSpyObj('Auth', ['currentUser'], {});

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Auth, useValue: mockAuth }
      ]
    });

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expose currentUser$ observable', () => {
    expect(service.currentUser$).toBeDefined();
    expect(service.currentUser$.subscribe).toBeDefined();
  });

  it('should have signup method', () => {
    expect(service.signup).toBeDefined();
    expect(typeof service.signup).toBe('function');
  });

  it('should have login method', () => {
    expect(service.login).toBeDefined();
    expect(typeof service.login).toBe('function');
  });

  it('should have logout method', () => {
    expect(service.logout).toBeDefined();
    expect(typeof service.logout).toBe('function');
  });
});

