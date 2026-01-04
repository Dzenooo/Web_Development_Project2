import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WaterTrackerPopupComponent } from './components/water-tracker-popup/water-tracker-popup';

@Component({
  selector:  'app-my-trackers',
  standalone: true,
  imports: [CommonModule, WaterTrackerPopupComponent],
  templateUrl: './my-trackers.html',
  styleUrl: './my-trackers.scss'
})
export class MyTrackersComponent {
  
  showWaterPopup: boolean = false;

  constructor(private cdr:  ChangeDetectorRef) {}

  openWaterTracker() {
    this.showWaterPopup = true;
    this.cdr. detectChanges();
  }

  closeWaterTracker() {
    this.showWaterPopup = false;
    this.cdr.detectChanges();
  }
}