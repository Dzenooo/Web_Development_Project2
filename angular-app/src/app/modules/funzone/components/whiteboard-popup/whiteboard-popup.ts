import { Component, Output, EventEmitter, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackerService } from '../../../../core/services/tracker';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-whiteboard-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './whiteboard-popup.html',
  styleUrl: './whiteboard-popup.scss'
})
export class WhiteboardPopupComponent implements OnInit, AfterViewInit {
  
  @Output() close = new EventEmitter<void>();

  // Canvas references
  private canvas! : HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;

  // Drawing state
  private drawing = false;
  private currentColor = '#000000';
  private isErasing = false;

  // UI state
  loading = false;
  saveSuccess = false;

  constructor(
    private trackerService: TrackerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadSavedCanvas();
  }

  ngAfterViewInit() {
    this.setupCanvas();
  }

  setupCanvas() {
    this.canvas = document.getElementById('board') as HTMLCanvasElement;
    const context = this.canvas.getContext('2d');
    
    if (!context) {
      console.error('Could not get canvas context');
      return;
    }
    
    this.ctx = context;

    // Mouse Events
    this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
    this.canvas.addEventListener('mouseup', () => this.endDrawing());
    this.canvas.addEventListener('mousemove', (e) => this.draw(e));

    // Touch Events (mobile / tablets)
    this.canvas.addEventListener('touchstart', (e) => this.startDrawing(e));
    this.canvas.addEventListener('touchend', () => this.endDrawing());
    this.canvas.addEventListener('touchmove', (e) => {
      this.draw(e);
      e.preventDefault();
    });
  }

  startDrawing(e: MouseEvent | TouchEvent) {
    this.drawing = true;
    this.draw(e);
  }

  endDrawing() {
    this.drawing = false;
    this.ctx.beginPath();
  }

  draw(e: MouseEvent | TouchEvent) {
    if (!this.drawing) return;

    const rect = this.canvas.getBoundingClientRect();

    // Prilagodite polozaj misa velicini ploce
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect. height;

    const clientX = (e as MouseEvent).clientX || (e as TouchEvent).touches?.[0]?.clientX;
    const clientY = (e as MouseEvent).clientY || (e as TouchEvent).touches?.[0]?.clientY;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect. top) * scaleY;

    const brushSize = (document.getElementById('brushSize') as HTMLInputElement)?.value || '3';

    this.ctx.lineWidth = parseInt(brushSize);
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = this.isErasing ? '#FFFFFF' :  this.currentColor;

    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
  }

  onColorChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.currentColor = input.value;
    this. isErasing = false;
  }

  toggleEraser() {
    this.isErasing = !this.isErasing;
    const eraserBtn = document.getElementById('eraserBtn');
    if (eraserBtn) {
      eraserBtn.textContent = this.isErasing ? 'Piši' : 'Briši';
    }
  }

  clearCanvas() {
    if (! this.ctx || !this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  async saveToFirestore() {
    if (!this.canvas) return;

    this.loading = true;
    this.saveSuccess = false;
    this.cdr.detectChanges();

    try {
      const imageData = this.canvas.toDataURL('image/png');
      const success = await this.trackerService. saveWhiteboardCanvas(imageData);

      if (success) {
        this.saveSuccess = true;
        setTimeout(() => {
          this.saveSuccess = false;
          this.cdr.detectChanges();
        }, 2000);
      } else {
        alert('Greška pri čuvanju whiteboard-a! ');
      }
    } catch (error) {
      console.error('Error saving whiteboard:', error);
      alert('Greška pri čuvanju! ');
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async loadSavedCanvas() {
    try {
      const savedCanvas = await this.trackerService.getWhiteboardCanvas();

      if (savedCanvas) {
        // Wait for canvas to be ready
        setTimeout(() => {
          if (! this.ctx) return;

          const img = new Image();
          img.onload = () => {
            this.ctx.drawImage(img, 0, 0);
          };
          img.src = savedCanvas;
        }, 100);
      }
    } catch (error) {
      console.error('Error loading whiteboard:', error);
    }
  }

  exportToPDF() {
    if (!this.canvas) return;

    const imgData = this.canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [this.canvas.width, this.canvas.height]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, this.canvas.width, this.canvas.height);
    pdf.save('whiteboard.pdf');
  }

  closePopup() {
    this.close.emit();
  }
}