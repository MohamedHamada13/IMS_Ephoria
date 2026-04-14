import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../services/auth.service';

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value as string | null;
  const confirmPassword = group.get('confirmPassword')?.value as string | null;

  if (!password || !confirmPassword) return null;
  return password === confirmPassword ? null : { passwordsNotMatch: true };
}

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register {
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: [passwordsMatch] },
  );

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const { name, email, password } = this.form.getRawValue();

    this.auth
      .register({ name, email, password })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          if (this.auth.isLoggedIn()) {
            this.router.navigateByUrl('/products');
          } else {
            this.router.navigateByUrl('/login');
          }
        },
        error: (err: unknown) => {
          this.isSubmitting.set(false);

          if (err instanceof HttpErrorResponse) {
            if (err.status === 0) {
              this.errorMessage.set('Cannot reach the server.');
              return;
            }

            if (err.status === 409) {
              this.errorMessage.set('This email is already registered.');
              return;
            }
          }

          this.errorMessage.set('Register failed. Please try again.');
        },
        complete: () => {
          this.isSubmitting.set(false);
        },
      });
  }
}
