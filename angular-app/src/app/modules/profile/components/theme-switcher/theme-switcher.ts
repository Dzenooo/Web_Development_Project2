import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { UserService } from '../../../../core/services/user';

@Component({
  selector:  'app-theme-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-switcher.html',
  styleUrl: './theme-switcher.scss'
})
export class ThemeSwitcherComponent implements OnInit {
  
  currentTheme: string = 'light';
  loading:  boolean = false;
  
  themes = [
    { name: 'light', label: 'Light' },
    { name: 'dark', label: 'Dark' },
    { name: 'rainbow', label: 'Rainbow' }
  ];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private userService: UserService
  ) {}

  async ngOnInit() {
    this.loading = true;
    
    try {
      const theme = await this.userService.getUserTheme();
      if (theme) {
        this.currentTheme = theme;
        this.applyTheme(theme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      this.loading = false;
    }
  }

  async selectTheme(themeName: string) {
    this.loading = true;
    this.currentTheme = themeName;
    this.applyTheme(themeName);
    
    try {
      await this.userService.updateTheme(themeName as 'light' | 'dark' | 'rainbow');
    } catch (error) {
      console.error('Error saving theme:', error);
    } finally {
      this.loading = false;
    }
  }

  private applyTheme(theme: string) {
    const body = this.document.body;
    body.classList.remove('theme-light', 'theme-dark', 'theme-rainbow');
    body.classList.add(`theme-${theme}`);
  }
}