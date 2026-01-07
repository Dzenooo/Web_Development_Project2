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

    this.registerForm = this.formBuilder.group({
      displayName: ['', [Validators. required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
  
      validators: this.passwordMatchValidator
    });
  }


  get f() {
    return this.registerForm.controls;
  }

  

   
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

  

   
  async onSubmit() {
    this.submitted = true;
    this.errorMessage = '';

  
    if (this.registerForm.invalid) {
      return;
    }

    this. loading = true;


    const { displayName, email, password } = this.registerForm.value;

    const result = await this.authService. register(email, password, displayName);

    this.loading = false;

    if (result.success) {
      console.log('Registration successful!', result.user);
      
 
      this.router.navigate(['/profile']);
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


   
  goToLogin() {
    this.router.navigate(['/login']);
  }
}