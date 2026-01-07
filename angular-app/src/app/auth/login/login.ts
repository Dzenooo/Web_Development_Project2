import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { AuthStateService } from '../../core/services/auth-state';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  loading = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private authStateService: AuthStateService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators. email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm. get('password')?.value;

    try {
      const result = await this.authService.login(email, password);

      if (result.success) {
        this.loading = false;
        await this.router.navigate(['/profile']);
      } else {
        throw new Error(result.error);
      }

    } catch (error:  any) {
      this.loading = false;

      const errorCode = error.message || error.code || '';

      if (errorCode. includes('invalid-credential') || errorCode.includes('user-not-found') || errorCode.includes('wrong-password')) {
        this.errorMessage = 'Pogrešan email ili lozinka. ';
      } else if (errorCode.includes('too-many-requests')) {
        this.errorMessage = 'Previše pokušaja.  Pokušajte ponovo kasnije.';
      } else if (errorCode.includes('network-request-failed')) {
        this.errorMessage = 'Greška sa mrežom. Provjerite internet konekciju.';
      } else if (errorCode === 'timeout') {
        this.errorMessage = 'Zahtjev je istekao. Pokušajte ponovo.';
      } else {
        this.errorMessage = 'Greška pri prijavi. Pokušajte ponovo.';
      }
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}