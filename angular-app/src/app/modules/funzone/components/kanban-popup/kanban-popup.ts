import { Component, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrackerService } from '../../../../core/services/tracker';

interface KanbanTask {
  id: string;
  text: string;
  status: 'todo' | 'progress' | 'done';
  order: number;
}

@Component({
  selector:  'app-kanban-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './kanban-popup.html',
  styleUrl: './kanban-popup.scss'
})
export class KanbanPopupComponent implements OnInit {
  
  @Output() close = new EventEmitter<void>();

  showAddModal = false;
  showClearModal = false;
  newTaskText = '';
  loading = false;
  saveSuccess = false;

  todoTasks: KanbanTask[] = [];
  progressTasks:  KanbanTask[] = [];
  doneTasks: KanbanTask[] = [];

  private draggedTask: KanbanTask | null = null;

  constructor(
    private trackerService: TrackerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadBoard();
  }

  // ✅ CLOSE POPUP
  closePopup() {
    this.close.emit();
  }

  // ✅ ADD TASK MODAL
  openAddModal() {
    this.showAddModal = true;
    this.newTaskText = '';
    this.cdr.detectChanges();
    
    setTimeout(() => {
      const input = document.getElementById('taskInput') as HTMLInputElement;
      if (input) {
        input.focus();
      }
    }, 100);
  }

  addTask() {
    const text = this.newTaskText.trim();
    
    if (! text) {
      console.log('❌ Task text is empty');
      return;
    }

    const newTask: KanbanTask = {
      id: this.generateId(),
      text: text,
      status: 'todo',
      order: this.todoTasks.length
    };

    this.todoTasks.push(newTask);
    console.log('✅ Task added:', newTask);
    
    this.showAddModal = false;
    this.newTaskText = '';
    this.cdr.detectChanges();
  }

  cancelAdd() {
    this.showAddModal = false;
    this. newTaskText = '';
    this.cdr.detectChanges();
  }

  // ✅ CLEAR BOARD MODAL
  openClearModal() {
    this.showClearModal = true;
    this.cdr.detectChanges();
  }

  confirmClear() {
    this.todoTasks = [];
    this. progressTasks = [];
    this.doneTasks = [];
    this.showClearModal = false;
    this.cdr. detectChanges();
    console.log('✅ Board cleared');
  }

  cancelClear() {
    this.showClearModal = false;
    this.cdr.detectChanges();
  }

  // ✅ DRAG & DROP - POBOLJŠANO
  onDragStart(task: KanbanTask, event: DragEvent) {
    this.draggedTask = task;
    console.log('🎯 Drag started:', task. text, '(from', task.status + ')');
    
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', task.id);  // ← DODANO
    }
    
    setTimeout(() => {
      (event.target as HTMLElement)?. classList.add('dragging');
    }, 0);
  }

  onDragEnd(event: DragEvent) {
    (event.target as HTMLElement)?.classList.remove('dragging');
    console.log('🏁 Drag ended');
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();  // ← DODANO
    
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onDrop(targetStatus: 'todo' | 'progress' | 'done', event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();  // ← DODANO
    
    if (! this.draggedTask) {
      console.log('❌ No dragged task');
      return;
    }

    const oldStatus = this.draggedTask. status;
    
    if (oldStatus === targetStatus) {
      console.log('⚠️ Same column, no action');
      this.draggedTask = null;
      return;
    }

    console.log(`✅ Moving task from ${oldStatus} → ${targetStatus}`);

    // Remove from old list
    this.removeTaskFromList(this.draggedTask);

    // Update status
    this.draggedTask. status = targetStatus;

    // Add to new list
    this. addTaskToList(this.draggedTask, targetStatus);

    // Clear dragged task
    this.draggedTask = null;
    
    // Force change detection
    this.cdr.detectChanges();
    
    console.log('📊 Updated lists - Todo:', this.todoTasks.length, 'Progress:', this.progressTasks.length, 'Done:', this.doneTasks.length);
  }

  private removeTaskFromList(task: KanbanTask) {
    this.todoTasks = this.todoTasks.filter(t => t. id !== task.id);
    this.progressTasks = this. progressTasks.filter(t => t.id !== task.id);
    this.doneTasks = this.doneTasks.filter(t => t.id !== task. id);
  }

  private addTaskToList(task: KanbanTask, status: 'todo' | 'progress' | 'done') {
    switch (status) {
      case 'todo':
        task.order = this.todoTasks.length;
        this.todoTasks.push(task);
        break;
      case 'progress': 
        task.order = this. progressTasks.length;
        this.progressTasks.push(task);
        break;
      case 'done':
        task.order = this.doneTasks.length;
        this.doneTasks.push(task);
        break;
    }
  }

  deleteTask(task: KanbanTask) {
    console.log('🗑️ Deleting task:', task.text);
    this.removeTaskFromList(task);
    this.cdr.detectChanges();
  }

  // ✅ SAVE BOARD
  async saveBoard() {
    this.loading = true;
    this. saveSuccess = false;
    this.cdr.detectChanges();

    try {
      console.log('💾 Saving board...');
      
      const allTasks = [
        ...this.todoTasks,
        ...this.progressTasks,
        ...this.doneTasks
      ];

      console.log('📦 Tasks to save:', allTasks.length);

      const success = await this.trackerService.saveKanbanBoard(allTasks);

      if (success) {
        console.log('✅ Board saved successfully');
        this.saveSuccess = true;
        setTimeout(() => {
          this.saveSuccess = false;
          this.cdr.detectChanges();
        }, 3000);
      } else {
        console.error('❌ Save failed');
        alert('Greška pri čuvanju! ');
      }
    } catch (error) {
      console.error('❌ Error saving Kanban board:', error);
      alert('Greška pri čuvanju:  ' + error);
    } finally {
      this.loading = false;
      this.cdr. detectChanges();
    }
  }

  // ✅ LOAD BOARD - OPTIMIZED
  async loadBoard() {
    console.log('📥 Loading Kanban board...');
    this.loading = true;
    this.cdr.detectChanges();

    try {
      const tasks = await this.trackerService.getKanbanBoard();
      
      console.log('📦 Raw tasks from DB:', tasks);

      if (! tasks || tasks.length === 0) {
        console.log('⚠️ No tasks found, initializing empty board');
        this.todoTasks = [];
        this.progressTasks = [];
        this. doneTasks = [];
        this.loading = false;
        this.cdr.detectChanges();
        return;
      }

      // Sort tasks by status
      this.todoTasks = tasks
        .filter((t: any) => t.status === 'todo')
        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
      
      this.progressTasks = tasks
        .filter((t: any) => t.status === 'progress')
        .sort((a: any, b:  any) => (a.order || 0) - (b.order || 0));
      
      this.doneTasks = tasks
        .filter((t: any) => t.status === 'done')
        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

      console.log('✅ Loaded - Todo:', this.todoTasks. length, 'Progress:', this. progressTasks.length, 'Done:', this.doneTasks. length);

    } catch (error) {
      console.error('❌ Error loading Kanban board:', error);
      this.todoTasks = [];
      this. progressTasks = [];
      this.doneTasks = [];
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}