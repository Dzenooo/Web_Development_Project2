import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavigationComponent } from '../../../shared/navigation/navigation';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, NavigationComponent],
  templateUrl: './landing.html',
  styleUrl: './landing.scss'
})
export class LandingComponent {}