import { Component, OnInit, AfterViewInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrackerService } from '../../../../core/services/tracker';
import { DailyWaterLog, WaterEntry } from '../../../../core/models/water-entry.model';

@Component({
  selector: 'app-water-tracker-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './water-tracker-popup.html',
  styleUrl: './water-tracker-popup.scss'
})export class WaterTrackerPopupComponent implements OnInit, AfterViewInit {
  
  @Output() close = new EventEmitter<void>();

  selectedDate: string = '';
  dailyLog: DailyWaterLog | null = null;
  
  goal: number = 3000;
  totalToday: number = 0;
  entries: WaterEntry[] = [];
  
  customAmount: number = 0;
  newGoal: number = 3000;
  
  loading:  boolean = false;
  progressPercentage: number = 0;

  allLogs: DailyWaterLog[] = [];

  constructor(
    private trackerService: TrackerService,
    private cdr:  ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.allLogs = [];
    this.entries = [];
    this.goal = 3000;
    this.totalToday = 0;
    this.loading = true;
    
    try {
      this.selectedDate = this.getTodayDate();
      await this.loadDataForDate(this.selectedDate);
      await this.loadAllLogs();
    } catch (error) {
      console.error('❌ ERROR u ngOnInit:', error);
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
      const data = await this.trackerService. getWaterLogForDate(date);
      
      if (data) {
        this.dailyLog = { ... data };
        this.goal = data.goal;
        this.totalToday = data.totalToday;
        this.entries = [... data.entries];
        this.newGoal = data.goal;
        this.calculateProgress();
      } else {
        this.dailyLog = null;
        this.goal = 3000;
        this.totalToday = 0;
        this. entries = [];
        this.newGoal = 3000;
        this.progressPercentage = 0;
      }
    } catch (error) {
      console.error('❌ ERROR u loadDataForDate:', error);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async loadAllLogs() {
    try {
      const logs = await this.trackerService. getAllWaterLogs();
      this.allLogs = logs;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('❌ ERROR u loadAllLogs:', error);
      this.allLogs = [];
    }
  }

  async addWater(amount: number) {
    if (amount <= 0) return;
    
    this.loading = true;
    const success = await this.trackerService. addWaterEntry(this.selectedDate, amount);
    
    if (success) {
      await this.loadDataForDate(this.selectedDate);
      await this.loadAllLogs();
      this.customAmount = 0;
    }
    
    this.loading = false;
  }

  async updateGoal() {
    if (this.newGoal <= 0) return;
    
    this.loading = true;
    const success = await this.trackerService.updateWaterGoal(this.selectedDate, this.newGoal);
    
    if (success) {
      await this.loadDataForDate(this.selectedDate);
    }
    
    this.loading = false;
  }

  async deleteEntry(entryId: string) {
    this.loading = true;
    const success = await this.trackerService.deleteWaterEntry(this. selectedDate, entryId);
    
    if (success) {
      await this.loadDataForDate(this.selectedDate);
      await this.loadAllLogs();
    }
    
    this.loading = false;
  }

  changeDate(direction: 'prev' | 'next') {
    const currentDate = new Date(this.selectedDate);
    
    if (direction === 'prev') {
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      currentDate.setDate(currentDate. getDate() + 1);
    }
    
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    this.selectedDate = `${year}-${month}-${day}`;
    
    this.loadDataForDate(this.selectedDate);
  }

  onDateChange(event: any) {
    this.selectedDate = event.target.value;
    this.loadDataForDate(this.selectedDate);
  }

  calculateProgress() {
    if (this.goal === 0) {
      this.progressPercentage = 0;
    } else {
      this.progressPercentage = Math.min((this.totalToday / this. goal) * 100, 100);
    }
  }

  closePopup() {
    this.close.emit();
  }
}