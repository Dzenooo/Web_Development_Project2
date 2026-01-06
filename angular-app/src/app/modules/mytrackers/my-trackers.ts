import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WaterTrackerPopupComponent } from './components/water-tracker-popup/water-tracker-popup';
import { MoodTrackerPopupComponent } from './components/mood-tracker-popup/mood-tracker-popup';
import { SleepTrackerPopupComponent } from './components/sleep-tracker-popup/sleep-tracker-popup';
import { ExerciseTrackerPopupComponent } from './components/exercise-tracker-popup/exercise-tracker-popup';
import { TaskPlannerPopupComponent } from './components/task-planner-popup/task-planner-popup';
import { GratitudeJournalPopupComponent } from './components/gratitude-journal-popup/gratitude-journal-popup';
import { AppNavigationComponent } from '../../shared/app-navigation/app-navigation';

@Component({
  selector: 'app-my-trackers',
  standalone: true,
  imports: [CommonModule, WaterTrackerPopupComponent, MoodTrackerPopupComponent, SleepTrackerPopupComponent, ExerciseTrackerPopupComponent, TaskPlannerPopupComponent, GratitudeJournalPopupComponent, AppNavigationComponent],
  templateUrl: './my-trackers.html',
  styleUrl: './my-trackers.scss'
})
export class MyTrackersComponent {
  
  showWaterPopup:  boolean = false;
  showMoodPopup: boolean = false;
  showSleepPopup: boolean = false; 
  showExercisePopup: boolean = false;
  showTaskPlannerPopup: boolean = false;
  showGratitudeJournalPopup: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {}

  openWaterTracker() {
    this.showWaterPopup = true;
    this.cdr.detectChanges();
  }

  closeWaterTracker() {
    this.showWaterPopup = false;
    this.cdr.detectChanges();
  }

  openMoodTracker() {
    this.showMoodPopup = true;
    this.cdr.detectChanges();
  }

  closeMoodTracker() {
    this.showMoodPopup = false;
    this.cdr.detectChanges();
  }

  openSleepTracker() {
  this.showSleepPopup = true;
  this.cdr.detectChanges();
}

closeSleepTracker() {
  this.showSleepPopup = false;
  this.cdr.detectChanges();
}

openExerciseTracker() {
  this.showExercisePopup = true;
  this.cdr.detectChanges();
}

closeExerciseTracker() {
  this.showExercisePopup = false;
  this.cdr.detectChanges();
}

openTaskPlanner() {
  this.showTaskPlannerPopup = true;
  this.cdr.detectChanges();
}

closeTaskPlanner() {
  this.showTaskPlannerPopup = false;
  this.cdr.detectChanges();
}

openGratitudeJournal() {
  this.showGratitudeJournalPopup = true;
  this.cdr.detectChanges();
}

closeGratitudeJournal() {
  this.showGratitudeJournalPopup = false;
  this. cdr.detectChanges();
}
}