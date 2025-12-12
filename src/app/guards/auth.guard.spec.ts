import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { runInInjectionContext, Injector } from '@angular/core';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';

describe('authGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;
  let injector: Injector;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [], {
      currentUser$: of(null)
    });

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
    injector = TestBed.inject(Injector);
    spyOn(router, 'navigate');
  });

  it('should allow access when user is authenticated', (done) => {
    (authService as any).currentUser$ = of({ uid: 'test-uid' } as any);

    runInInjectionContext(injector, () => {
      const result = authGuard({} as any, {} as any);
      if (result instanceof Promise) {
        result.then(res => {
          expect(res).toBe(true);
          expect(router.navigate).not.toHaveBeenCalled();
          done();
        });
      } else {
        (result as any).subscribe((res: boolean) => {
          expect(res).toBe(true);
          expect(router.navigate).not.toHaveBeenCalled();
          done();
        });
      }
    });
  });

  it('should redirect to login when user is not authenticated', (done) => {
    (authService as any).currentUser$ = of(null);

    runInInjectionContext(injector, () => {
      const result = authGuard({} as any, {} as any);
      if (result instanceof Promise) {
        result.then(res => {
          expect(res).toBe(false);
          expect(router.navigate).toHaveBeenCalledWith(['/login']);
          done();
        });
      } else {
        (result as any).subscribe((res: boolean) => {
          expect(res).toBe(false);
          expect(router.navigate).toHaveBeenCalledWith(['/login']);
          done();
        });
      }
    });
  });
});

