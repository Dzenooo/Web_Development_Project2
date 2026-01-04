import { Component, OnInit, AfterViewInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrackerService } from '../../../../core/services/tracker';
import { DailyMoodLog, MoodEntry } from '../../../../core/models/mood-entry.model';

@Component({
  selector: 'app-mood-tracker-popup',
  standalone:  true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mood-tracker-popup.html',
  styleUrl: './mood-tracker-popup.scss'
})
export class MoodTrackerPopupComponent implements OnInit, AfterViewInit {
  
  @Output() close = new EventEmitter<void>();

  selectedDate: string = '';
  dailyLog: DailyMoodLog | null = null;
  entries: MoodEntry[] = [];
  
  selectedMood: 'sretno' | 'neutralno' | 'tuzno' | 'ljuto' | 'umorno' = 'sretno';
  note: string = '';
  
  loading: boolean = false;
  allLogs: DailyMoodLog[] = [];

  moods = [
    { value: 'sretno' as const, emoji: '😊', label: 'Sretno' },
    { value: 'neutralno' as const, emoji: '😐', label: 'Neutralno' },
    { value: 'tuzno' as const, emoji:  '😢', label: 'Tužno' },
    { value:  'ljuto' as const, emoji: '😡', label: 'Ljuto' },
    { value: 'umorno' as const, emoji: '😴', label: 'Umorno' }
  ];

  constructor(
    private trackerService:  TrackerService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.allLogs = [];
    this. entries = [];
    this.loading = true;
    
    try {
      this.selectedDate = this.getTodayDate();
      await this.loadDataForDate(this.selectedDate);
      await this.loadAllLogs();
    } catch (error) {
      console.error('ERROR u ngOnInit:', error);
    } finally {
      this. loading = false;
      this. cdr.detectChanges();
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 50);
  }

  getTodayDate(): string {
    const today = new Date();
    const year = today. getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  async loadDataForDate(date: string) {
    this.loading = true;
    
    try {
      const data = await this.trackerService.getMoodLogForDate(date);
      
      if (data) {
        this.dailyLog = { ...data };
        this.entries = [...data.entries];
      } else {
        this.dailyLog = null;
        this. entries = [];
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
      const logs = await this.trackerService.getAllMoodLogs();
      this.allLogs = logs;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('ERROR u loadAllLogs:', error);
      this.allLogs = [];
    }
  }

  async addMood() {
    this.loading = true;
    const success = await this.trackerService.addMoodEntry(this. selectedDate, this.selectedMood, this.note);
    
    if (success) {
      await this.loadDataForDate(this.selectedDate);
      await this.loadAllLogs();
      this.note = '';
    }
    
    this.loading = false;
  }

  async deleteEntry(entryId: string) {
    this.loading = true;
    const success = await this.trackerService.deleteMoodEntry(this.selectedDate, entryId);
    
    if (success) {
      await this.loadDataForDate(this. selectedDate);
      await this.loadAllLogs();
    }
    
    this.loading = false;
  }

  onDateChange(event: any) {
    this.selectedDate = event.target.value;
    this.loadDataForDate(this. selectedDate);
  }

  getMoodForDate(date: string): string {
    const log = this.allLogs.find(l => l.date === date);
    if (log && log.entries.length > 0) {
      return log.entries[log.entries.length - 1]. emoji;
    }
    return '⚪';
  }

  selectMood(mood: 'sretno' | 'neutralno' | 'tuzno' | 'ljuto' | 'umorno') {
    this.selectedMood = mood;
    this.cdr.detectChanges();
  }

  closePopup() {
    this.close.emit();
  }
}