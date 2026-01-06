import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavigationComponent } from '../../../shared/navigation/navigation';

@Component({
  selector:  'app-popis',
  standalone: true,
  imports: [CommonModule, RouterModule, NavigationComponent],
  templateUrl: './popis.html',
  styleUrl: './popis.scss'
})
export class PopisComponent {}