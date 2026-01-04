import { Component, OnInit, AfterViewInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrackerService } from '../../../../core/services/tracker';
import { DailySleepLog, SleepEntry } from '../../../../core/models/sleep-entry.model';

@Component({
  selector: 'app-sleep-tracker-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sleep-tracker-popup.html',
  styleUrl: './sleep-tracker-popup.scss'
})
export class SleepTrackerPopupComponent implements OnInit, AfterViewInit {
  
  @Output() close = new EventEmitter<void>();

  selectedDate: string = '';
  dailyLog: DailySleepLog | null = null;
  
  totalToday: number = 0;
  entries: SleepEntry[] = [];
  
  customHours: number = 0;
  
  loading:  boolean = false;
  allLogs: DailySleepLog[] = [];

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
      const data = await this.trackerService. getSleepLogForDate(date);
      
      if (data) {
        this.dailyLog = { ...data };
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
    const logs = await this.trackerService.getAllSleepLogs();
    this.allLogs = logs;
    
    console.log('🔍 ALL LOGS:', this.allLogs);
    this.allLogs.forEach(log => {
      console.log(`📊 ${log.date}: ${log.totalToday}h`);
    });
    
    this.cdr.detectChanges();
  } catch (error) {
    console.error('ERROR u loadAllLogs:', error);
    this.allLogs = [];
  }
}

  async addSleep() {
    if (this.customHours <= 0) return;
    
    this.loading = true;
    const success = await this.trackerService. addSleepEntry(this.selectedDate, this.customHours);
    
    if (success) {
      await this.loadDataForDate(this.selectedDate);
      await this.loadAllLogs();
      this.customHours = 0;
    }
    
    this.loading = false;
  }

  async deleteEntry(entryId: string) {
    this.loading = true;
    const success = await this.trackerService.deleteSleepEntry(this.selectedDate, entryId);
    
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

  getSleepForDate(date: string): number {
    const log = this.allLogs.find(l => l.date === date);
    return log ? log.totalToday : 0;
  }

  closePopup() {
    this.close.emit();
  }

  
}