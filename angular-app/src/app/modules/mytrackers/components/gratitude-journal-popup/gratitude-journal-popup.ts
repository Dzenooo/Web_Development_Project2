import { Component, OnInit, AfterViewInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrackerService } from '../../../../core/services/tracker';
import { GratitudeEntry } from '../../../../core/models/gratitude-entry.model';

@Component({
  selector: 'app-gratitude-journal-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gratitude-journal-popup.html',
  styleUrl: './gratitude-journal-popup.scss'
})
export class GratitudeJournalPopupComponent implements OnInit, AfterViewInit {
  
  @Output() close = new EventEmitter<void>();

  selectedDate: string = '';
  entryText: string = '';
  hasEntry: boolean = false;
  
  loading:  boolean = false;
  showSuccessMessage: boolean = false;
  
  allEntries: GratitudeEntry[] = [];

  constructor(
    private trackerService: TrackerService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.allEntries = [];
    this.entryText = '';
    this. loading = true;
    
    try {
      this.selectedDate = this.getTodayDate();
      await this.loadEntryForDate(this.selectedDate);
      await this.loadAllEntries();
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

  async loadEntryForDate(date: string) {
    this.loading = true;
    this.showSuccessMessage = false;
    
    try {
      const data = await this.trackerService. getGratitudeEntry(date);
      
      if (data) {
        this.entryText = data. entry;
        this.hasEntry = data.hasEntry;
      } else {
        this.entryText = '';
        this.hasEntry = false;
      }
    } catch (error) {
      console.error('ERROR u loadEntryForDate:', error);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async loadAllEntries() {
    try {
      const entries = await this.trackerService.getAllGratitudeEntries();
      this.allEntries = entries;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('ERROR u loadAllEntries:', error);
      this.allEntries = [];
    }
  }

  async saveEntry() {
    if (!this.entryText.trim()) {
      alert('Napiši nešto prije nego sačuvaš!');
      return;
    }
    
    this.loading = true;
    this.showSuccessMessage = false;
    
    const success = await this.trackerService. saveGratitudeEntry(this.selectedDate, this.entryText);
    
    if (success) {
      await this.loadEntryForDate(this.selectedDate);
      await this.loadAllEntries();
      this.showSuccessMessage = true;
      
     
      setTimeout(() => {
        this.showSuccessMessage = false;
        this.cdr.detectChanges();
      }, 3000);
    }
    
    this.loading = false;
    this.cdr.detectChanges();
  }


  async deleteEntry() {
  const confirmDelete = confirm('Da li si siguran da želiš obrisati ovaj entry?');
  
  if (! confirmDelete) return;
  
  this.loading = true;
  this.showSuccessMessage = false;
  
  const success = await this.trackerService.deleteGratitudeEntry(this.selectedDate);
  
  if (success) {
    this.entryText = '';
    this.hasEntry = false;
    await this.loadAllEntries();
    alert('Entry obrisan!  ✅');
  } else {
    alert('Greška pri brisanju entry-a!');
  }
  
  this.loading = false;
  this.cdr.detectChanges();
}

  onDateChange(event: any) {
    this.selectedDate = event.target.value;
    this.loadEntryForDate(this.selectedDate);
  }

  closePopup() {
    this.close.emit();
  }
}