import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-bingo-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bingo-popup.html',
  styleUrl: './bingo-popup.scss'
})
export class BingoPopupComponent {
  
  @Output() close = new EventEmitter<void>();

  closePopup() {
    this.close.emit();
  }

  exportToPDF() {
    const element = document.getElementById('bingo-content');

    if (!element) {
      console.error('Bingo content element not found');
      return;
    }

    const options = {
      margin: 0.5,
      filename: 'Bingo.pdf',
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF:  { unit: 'in' as const, format: 'letter' as const, orientation: 'portrait' as const }
    };

    html2pdf().set(options).from(element).save();
  }
}