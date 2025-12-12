import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, TranslateModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  loading = signal(false);
  error = signal<string | null>(null);

  get emailCtrl(): AbstractControl | null {
    return this.form.get('email');
  }

  get passwordCtrl(): AbstractControl | null {
    return this.form.get('password');
  }

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const email = String(this.emailCtrl?.value || '');
    const password = String(this.passwordCtrl?.value || '');

    try {
      await this.auth.login(email, password);
      this.loading.set(false);
      this.router.navigate(['/profile']);
    } catch (e: any) {
      this.loading.set(false);
      this.error.set(e.message || 'Login failed');
    }
  }
}
