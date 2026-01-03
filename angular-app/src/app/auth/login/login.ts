import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone:  true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl:  './login.html',
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
    private router: Router
  ) {
    this.loginForm = this. formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() {
    return this.loginForm. controls;
  }

  async onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';
    
    const result = await this.authService. login(
      this.loginForm.value.email,
      this.loginForm.value.password
    );

    this.loading = false;

    if (result. success) {
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 100);
    } else {
      if (result.error?.includes('invalid-credential')) {
        this.errorMessage = 'Pogrešan email ili lozinka. ';
      } else if (result.error?.includes('timeout')) {
        this.errorMessage = 'Zahtjev je istekao.  Provjerite internet konekciju.';
      } else if (result.error?.includes('too-many-requests')) {
        this.errorMessage = 'Previše pokušaja. Pokušajte ponovo kasnije.';
      } else if (result. error?.includes('user-not-found')) {
        this.errorMessage = 'Korisnik ne postoji.';
      } else if (result.error?.includes('wrong-password')) {
        this.errorMessage = 'Pogrešna lozinka. ';
      } else {
        this.errorMessage = 'Greška pri prijavljivanju.  Pokušajte ponovo. ';
      }
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}