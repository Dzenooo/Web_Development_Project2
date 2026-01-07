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


  closePopup() {
    this.close.emit();
  }


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
  }

  cancelClear() {
    this.showClearModal = false;
    this.cdr.detectChanges();
  }


  onDragStart(task: KanbanTask, event: DragEvent) {
    this.draggedTask = task;
 
    
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', task.id); 
    }
    
    setTimeout(() => {
      (event.target as HTMLElement)?. classList.add('dragging');
    }, 0);
  }

  onDragEnd(event: DragEvent) {
    (event.target as HTMLElement)?.classList.remove('dragging');

  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation(); 
    
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onDrop(targetStatus: 'todo' | 'progress' | 'done', event: DragEvent) {
    event.preventDefault();
    event.stopPropagation(); 
    
    if (! this.draggedTask) {
      return;
    }

    const oldStatus = this.draggedTask. status;
    
    if (oldStatus === targetStatus) {
      this.draggedTask = null;
      return;
    }



    this.removeTaskFromList(this.draggedTask);
    this.draggedTask. status = targetStatus;
    this. addTaskToList(this.draggedTask, targetStatus);
    this.draggedTask = null;
    this.cdr.detectChanges();
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
    this.removeTaskFromList(task);
    this.cdr.detectChanges();
  }


  async saveBoard() {
    this.loading = true;
    this. saveSuccess = false;
    this.cdr.detectChanges();

    try {
      
      const allTasks = [
        ...this.todoTasks,
        ...this.progressTasks,
        ...this.doneTasks
      ];


      const success = await this.trackerService.saveKanbanBoard(allTasks);

      if (success) {
        this.saveSuccess = true;
        setTimeout(() => {
          this.saveSuccess = false;
          this.cdr.detectChanges();
        }, 3000);
      } else {
        alert('Greška pri čuvanju! ');
      }
    } catch (error) {
      alert('Greška pri čuvanju:  ' + error);
    } finally {
      this.loading = false;
      this.cdr. detectChanges();
    }
  }

  async loadBoard() {
    this.loading = true;
    this.cdr.detectChanges();

    try {
      const tasks = await this.trackerService.getKanbanBoard();
      

      if (! tasks || tasks.length === 0) {
        this.todoTasks = [];
        this.progressTasks = [];
        this. doneTasks = [];
        this.loading = false;
        this.cdr.detectChanges();
        return;
      }

  
      this.todoTasks = tasks
        .filter((t: any) => t.status === 'todo')
        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
      
      this.progressTasks = tasks
        .filter((t: any) => t.status === 'progress')
        .sort((a: any, b:  any) => (a.order || 0) - (b.order || 0));
      
      this.doneTasks = tasks
        .filter((t: any) => t.status === 'done')
        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));


    } catch (error) {
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