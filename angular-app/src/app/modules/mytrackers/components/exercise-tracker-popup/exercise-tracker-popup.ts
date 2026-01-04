import { Component, OnInit, AfterViewInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrackerService } from '../../../../core/services/tracker';
import { DailyExerciseLog, ExerciseEntry } from '../../../../core/models/exercise-entry.model';

@Component({
  selector: 'app-exercise-tracker-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exercise-tracker-popup.html',
  styleUrl: './exercise-tracker-popup.scss'
})
export class ExerciseTrackerPopupComponent implements OnInit, AfterViewInit {
  
  @Output() close = new EventEmitter<void>();

  selectedDate: string = '';
  dailyLog: DailyExerciseLog | null = null;
  
  totalToday: number = 0;
  entries: ExerciseEntry[] = [];
  
  customMinutes: number | null = null;
  exerciseType: string = '';
  
  loading:  boolean = false;
  allLogs: DailyExerciseLog[] = [];

  constructor(
    private trackerService: TrackerService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.allLogs = [];
    this.entries = [];
    this.totalToday = 0;
    this.loading = true;
    
    try {
      this.selectedDate = this.getTodayDate();
      await this.loadDataForDate(this.selectedDate);
      await this.loadAllLogs();
    } catch (error) {
      console.error('ERROR u ngOnInit:', error);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 50);
  }

  getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  async loadDataForDate(date: string) {
    this.loading = true;
    
    try {
      const data = await this.trackerService. getExerciseLogForDate(date);
      
      if (data) {
        this.dailyLog = { ... data };
        this.totalToday = data.totalToday;
        this.entries = [... data.entries];
      } else {
        this.dailyLog = null;
        this. totalToday = 0;
        this.entries = [];
      }
    } catch (error) {
      console.error('ERROR u loadDataForDate:', error);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async loadAllLogs() {
    try {
      const logs = await this.trackerService.getAllExerciseLogs();
      this.allLogs = logs;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('ERROR u loadAllLogs:', error);
      this.allLogs = [];
    }
  }

  async addExercise() {
    if (!this.customMinutes || this.customMinutes <= 0 || ! this.exerciseType. trim()) {
      alert('Unesi broj minuta i vrstu vježbe! ');
      return;
    }
    
    this.loading = true;
    const success = await this.trackerService. addExerciseEntry(
      this.selectedDate, 
      this.customMinutes, 
      this.exerciseType. trim()
    );
    
    if (success) {
      await this.loadDataForDate(this.selectedDate);
      await this.loadAllLogs();
      this.customMinutes = null;
      this.exerciseType = '';
    }
    
    this.loading = false;
  }

  async deleteEntry(entryId: string) {
    this.loading = true;
    const success = await this.trackerService.deleteExerciseEntry(this.selectedDate, entryId);
    
    if (success) {
      await this.loadDataForDate(this.selectedDate);
      await this.loadAllLogs();
    }
    
    this.loading = false;
  }

  onDateChange(event: any) {
    this.selectedDate = event.target.value;
    this.loadDataForDate(this.selectedDate);
  }

  formatMinutes(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}min`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${mins}min`;
    }
  }

  closePopup() {
    this.close.emit();
  }
}