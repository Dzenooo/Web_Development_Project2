import { Component, OnInit, AfterViewInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrackerService } from '../../../../core/services/tracker';
import { DailyTaskLog, Task } from '../../../../core/models/task-entry.model';

@Component({
  selector: 'app-task-planner-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-planner-popup.html',
  styleUrl: './task-planner-popup.scss'
})
export class TaskPlannerPopupComponent implements OnInit, AfterViewInit {
  
  @Output() close = new EventEmitter<void>();

  selectedDate: string = '';
  dailyLog: DailyTaskLog | null = null;
  
  tasks: Task[] = [];
  totalTasks: number = 0;
  completedTasks: number = 0;
  completionRate: number = 0;
  
  newTaskName: string = '';
  
  loading:  boolean = false;
  allLogs: DailyTaskLog[] = [];

  constructor(
    private trackerService: TrackerService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.allLogs = [];
    this.tasks = [];
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
      const data = await this.trackerService. getTasksForDate(date);
      
      if (data) {
        this.dailyLog = { ... data };
        this.tasks = [... data.tasks];
        this.totalTasks = data.totalTasks;
        this.completedTasks = data.completedTasks;
        this.completionRate = data.completionRate;
      } else {
        this.dailyLog = null;
        this. tasks = [];
        this.totalTasks = 0;
        this.completedTasks = 0;
        this.completionRate = 0;
      }
    } catch (error) {
      console.error('ERROR u loadDataForDate:', error);
    } finally {
      this. loading = false;
      this.cdr.detectChanges();
    }
  }

  async loadAllLogs() {
    try {
      const logs = await this.trackerService.getAllTaskLogs();
      this.allLogs = logs;
      this. cdr.detectChanges();
    } catch (error) {
      console.error('ERROR u loadAllLogs:', error);
      this.allLogs = [];
    }
  }

  async addTask() {
    if (!this.newTaskName.trim()) {
      alert('Unesi naziv taska!');
      return;
    }
    
    this.loading = true;
    const success = await this.trackerService. addTask(this.selectedDate, this.newTaskName. trim());
    
    if (success) {
      await this.loadDataForDate(this.selectedDate);
      await this.loadAllLogs();
      this.newTaskName = '';
    }
    
    this.loading = false;
  }

  async toggleTask(taskId: string) {
    this.loading = true;
    const success = await this.trackerService.toggleTask(this.selectedDate, taskId);
    
    if (success) {
      await this.loadDataForDate(this.selectedDate);
      await this.loadAllLogs();
    }
    
    this.loading = false;
  }

  async deleteTask(taskId: string) {
    this.loading = true;
    const success = await this.trackerService.deleteTask(this.selectedDate, taskId);
    
    if (success) {
      await this.loadDataForDate(this.selectedDate);
      await this.loadAllLogs();
    }
    
    this. loading = false;
  }

  onDateChange(event: any) {
    this.selectedDate = event.target.value;
    this.loadDataForDate(this.selectedDate);
  }

  closePopup() {
    this.close.emit();
  }
}