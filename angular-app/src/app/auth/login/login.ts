import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  // Forma za login
  loginForm: FormGroup;
  
  // Da li je forma submitovana (za prikaz errora)
  submitted = false;
  
  // Da li se učitava (loading state)
  loading = false;
  
  // Poruka greške
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Inicijalizuj formu sa validacijom
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators. email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Getter za lakši pristup poljima forme u HTML-u
  get f() {
    return this.loginForm. controls;
  }

  
   // Funkcija koja se poziva kada korisnik klikne "Login"
   
  async onSubmit() {
    this.submitted = true;
    this.errorMessage = '';

    // Zaustavi ako forma nije validna
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    // Dohvati vrijednosti iz forme
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    // Pozovi login funkciju iz AuthService-a
    const result = await this.authService. login(email, password);

    this.loading = false;

    if (result.success) {
      console.log('Login successful! ', result.user);
      
      // Redirektuj na dashboard
      this.router.navigate(['/dashboard']);
    } else {
      // Prikaži error poruku
      this.errorMessage = this.getErrorMessage(result.error);
    }
  }

  
   //Konvertuj Firebase error kodove u normalne poruke
   
  private getErrorMessage(error: string): string {
    if (error.includes('user-not-found')) {
      return 'Korisnik sa ovim email-om ne postoji. ';
    } else if (error.includes('wrong-password')) {
      return 'Pogrešna lozinka. ';
    } else if (error.includes('invalid-email')) {
      return 'Nevažeća email adresa.';
    } else if (error.includes('invalid-credential')) {
      return 'Neispravni podaci za prijavu.';
    } else {
      return 'Došlo je do greške.  Pokušajte ponovo.';
    }
  }

  
   // Navigacija na Register stranicu
   
  goToRegister() {
    this.router.navigate(['/register']);
  }
}