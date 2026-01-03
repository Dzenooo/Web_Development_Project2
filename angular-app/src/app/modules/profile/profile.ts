import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user';
import { AuthService } from '../../core/services/auth';
import { ThemeSwitcherComponent } from './components/theme-switcher/theme-switcher';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ThemeSwitcherComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class ProfileComponent implements OnInit {
  userData: any = null;
  editMode = false;
  changePasswordMode = false;
  
  profileForm: FormGroup;
  passwordForm: FormGroup;
  
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.profileForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators. minLength(2)]],
      displayName: ['', [Validators. required, Validators.minLength(3)]]
    });

    this.passwordForm = this. formBuilder.group({
      newPassword: ['', [Validators. required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  async ngOnInit() {
    await this.loadUserData();
  }

  async loadUserData() {
    this.loading = true;
    this.cdr.detectChanges();
    
    this.userData = await this.userService.getCurrentUserData();
    
    if (this.userData) {
      if (! this.userData.firstName && this.userData.displayName) {
        const nameParts = this.userData.displayName.split(' ');
        this.userData.firstName = nameParts[0] || '';
        this.userData. lastName = nameParts. slice(1).join(' ') || '';
      }

      this.profileForm.patchValue({
        firstName: this.userData.firstName || '',
        lastName: this.userData.lastName || '',
        displayName: this.userData.displayName || ''
      });
    }
    
    this.loading = false;
    this.cdr. detectChanges();
  }

  enableEditMode() {
    this.editMode = true;
    this.successMessage = '';
    this.errorMessage = '';
    this.cdr.detectChanges();
  }

  cancelEdit() {
    this.editMode = false;
    this.profileForm.patchValue({
      firstName: this.userData.firstName || '',
      lastName: this.userData.lastName || '',
      displayName: this. userData.displayName || ''
    });
    this.cdr.detectChanges();
  }

  async saveProfile() {
    
    if (this.profileForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.detectChanges();

    const formData = this.profileForm.value;
    
    try {
      const result = await this.userService.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        displayName: formData.displayName
      });

      this.loading = false;
      this.cdr.detectChanges();

      if (result.success) {
        this.userData = {
          ... this.userData,
          firstName: formData.firstName,
          lastName: formData.lastName,
          displayName: formData.displayName
        };

        this.successMessage = 'Profil uspješno ažuriran!';
        this.editMode = false;
        this. cdr.detectChanges();
        
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.detectChanges();
        }, 3000);
      } else {
        this.errorMessage = 'Greška pri ažuriranju profila. ';
        this.cdr. detectChanges();
      }
    } catch (error) {
      console.error('CATCH ERROR:', error);
      this.loading = false;
      this.errorMessage = 'Došlo je do greške. ';
      this.cdr. detectChanges();
    }
  }

  togglePasswordMode() {
    this.changePasswordMode = ! this.changePasswordMode;
    this.passwordForm.reset();
    this.successMessage = '';
    this.errorMessage = '';
    this.cdr.detectChanges();
  }

  async changePassword() {
    
    if (this.passwordForm.invalid) {
      return;
    }

    this. loading = true;
    this. errorMessage = '';
    this. successMessage = '';
    this. cdr.detectChanges();

    const newPassword = this.passwordForm.value.newPassword;
    
    const result = await this.userService.updatePassword(newPassword);

    this.loading = false;
    this.cdr.detectChanges();

    if (result.success) {
      this.successMessage = 'Lozinka uspješno promijenjena!';
      this.changePasswordMode = false;
      this.passwordForm.reset();
      this.cdr.detectChanges();
      
      setTimeout(() => {
        this.successMessage = '';
        this.cdr.detectChanges();
      }, 3000);
    } else {
      if (result.error?. includes('requires-recent-login')) {
        this.errorMessage = 'Morate se ponovo ulogirati da biste promijenili lozinku. ';
      } else {
        this.errorMessage = 'Greška pri promjeni lozinke.';
      }
      this.cdr.detectChanges();
    }
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    }
    return null;
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }

  get pf() {
    return this.profileForm.controls;
  }

  get pwf() {
    return this.passwordForm.controls;
  }
}