import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../core/services/user';

@Component({
  selector:  'app-theme-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-switcher.html',
  styleUrl: './theme-switcher.scss'
})
export class ThemeSwitcherComponent implements OnInit {
  currentTheme: 'light' | 'dark' | 'rainbow' = 'light';
  loading = false;

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    const userData = await this.userService. getCurrentUserData();
    
    if (userData?.['theme']) {
      this.currentTheme = userData['theme'];
      this.applyTheme(this.currentTheme);
      this.cdr.detectChanges();
    }
  }

  async selectTheme(theme: 'light' | 'dark' | 'rainbow') {
    this.loading = true;
    this.cdr.detectChanges();
    
    const result = await this.userService. updateTheme(theme);
    
    if (result.success) {
      this.currentTheme = theme;
      this.applyTheme(theme);
    }
    
    this.loading = false;
    this.cdr.detectChanges();
  }

  applyTheme(theme: string) {
    document.body.className = `theme-${theme}`;
  }
}