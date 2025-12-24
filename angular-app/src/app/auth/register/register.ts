import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector:  'app-register',
  standalone: true,
  imports:  [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  loading = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Inicijalizuj formu
    this.registerForm = this.formBuilder.group({
      displayName: ['', [Validators. required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      // Custom validator za provjeru da li se passwordi podudaraju
      validators: this.passwordMatchValidator
    });
  }

  // Getter za lakši pristup poljima
  get f() {
    return this.registerForm.controls;
  }

  
   // Custom validator - provjera da li se password i confirmPassword podudaraju
   
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      return null;
    }
    return null;
  }

  
   // Submit funkcija za registraciju
   
  async onSubmit() {
    this.submitted = true;
    this.errorMessage = '';

    // Zaustavi ako forma nije validna
    if (this.registerForm.invalid) {
      return;
    }

    this. loading = true;

    // Dohvati vrijednosti
    const { displayName, email, password } = this.registerForm.value;

    // Pozovi register funkciju
    const result = await this.authService. register(email, password, displayName);

    this.loading = false;

    if (result.success) {
      console.log('Registration successful!', result.user);
      
      // Redirektuj na dashboard
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage = this.getErrorMessage(result.error);
    }
  }

  
   // Error poruke
   
  private getErrorMessage(error: string): string {
    if (error.includes('email-already-in-use')) {
      return 'Korisnik sa ovim email-om već postoji.';
    } else if (error. includes('invalid-email')) {
      return 'Nevažeća email adresa.';
    } else if (error.includes('weak-password')) {
      return 'Lozinka je preslaba.  Koristite minimum 6 karaktera.';
    } else {
      return 'Došlo je do greške. Pokušajte ponovo.';
    }
  }

  // Navigacija na Login
   
  goToLogin() {
    this.router.navigate(['/login']);
  }
}