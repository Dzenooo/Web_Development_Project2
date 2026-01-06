import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavigationComponent } from '../../../shared/navigation/navigation';

@Component({
  selector: 'app-raspored',
  standalone: true,
  imports: [CommonModule, RouterModule, NavigationComponent],
  templateUrl: './raspored.html',
  styleUrl: './raspored.scss'
})
export class RasporedComponent {}