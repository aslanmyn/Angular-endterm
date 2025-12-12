import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';

function passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
  const value = String(control.value || '');
  if (!value) return null;

  const hasNumber = /\d/.test(value);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>_\-\\[\]/+~]/.test(value);
  const hasMinLength = value.length >= 8;

  if (hasNumber && hasSpecial && hasMinLength) {
    return null;
  }

  return { weakPassword: true };
}

function passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  if (password && confirm && password !== confirm) {
    return { passwordsMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form: FormGroup = this.fb.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordStrengthValidator]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordsMatchValidator },
  );

  loading = signal(false);
  error = signal<string | null>(null);

  get emailCtrl(): AbstractControl | null {
    return this.form.get('email');
  }

  get passwordCtrl(): AbstractControl | null {
    return this.form.get('password');
  }

  get confirmCtrl(): AbstractControl | null {
    return this.form.get('confirmPassword');
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const email = String(this.emailCtrl?.value || '');
    const password = String(this.passwordCtrl?.value || '');

    try {
      await this.auth.signup(email, password);
      this.loading.set(false);
      this.router.navigateByUrl('/profile');
    } catch (err: any) {
      const message = this.mapFirebaseError(err);
      this.error.set(message);
      this.loading.set(false);
    }
  }

  private mapFirebaseError(err: any): string {
    const message = err?.message ?? '';
    const code = err?.code ?? '';

    if (typeof code === 'string') {
      if (code.includes('auth/email-already-in-use')) {
        return 'This email is already registered.';
      }
      if (code.includes('auth/invalid-email')) {
        return 'Invalid email format.';
      }
      if (code.includes('auth/weak-password')) {
        return 'Password is too weak.';
      }
    }

    if (typeof message === 'string' && message.length > 0) {
      return message;
    }

    return 'Failed to create account. Please try again.';
  }
}
