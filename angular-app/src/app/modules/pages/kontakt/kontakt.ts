import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NavigationComponent } from '../../../shared/navigation/navigation';

@Component({
  selector: 'app-kontakt',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NavigationComponent],
  templateUrl: './kontakt.html',
  styleUrl: './kontakt.scss'
})
export class KontaktComponent {
  contactForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;

  constructor(private fb: FormBuilder) {
    this.contactForm = this. fb.group({
      fullname: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[\d\s\+\-()]{7,20}$/)]],
      message: ['', [Validators.required]],
      terms: [false, [Validators.requiredTrue]],
      newsletter:  [false]
    });
  }

  isFieldInvalid(fieldName:  string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit() {
    
    Object.keys(this.contactForm. controls).forEach(key => {
      this.contactForm.get(key)?.markAsTouched();
    });

    if (this.contactForm. invalid) {
      return;
    }

    this. isSubmitting = true;


    setTimeout(() => {
      console.log('Form submitted:', this.contactForm.value);
      this.isSubmitting = false;
      this.submitSuccess = true;
      this.contactForm.reset();

   
      setTimeout(() => {
        this.submitSuccess = false;
      }, 5000);
    }, 2000);
  }
}