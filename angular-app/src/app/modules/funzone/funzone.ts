import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BingoPopupComponent } from './components/bingo-popup/bingo-popup';
import { QuizPopupComponent } from './components/quiz-popup/quiz-popup';
import { WhiteboardPopupComponent } from './components/whiteboard-popup/whiteboard-popup';

@Component({
  selector: 'app-funzone',
  standalone: true,
  imports: [
    CommonModule,
    BingoPopupComponent,
    QuizPopupComponent,
    WhiteboardPopupComponent
  ],
  templateUrl: './funzone.html',
  styleUrl: './funzone.scss'
})
export class FunzoneComponent {
  
  showBingoPopup:  boolean = false;
  showQuizPopup: boolean = false;
  showWhiteboardPopup: boolean = false;
  showVisionBoardPopup: boolean = false;
  showKanbanPopup: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {}

  openBingo() {
    this.showBingoPopup = true;
    this.cdr.detectChanges();
  }

  closeBingo() {
    this.showBingoPopup = false;
    this.cdr. detectChanges();
  }

  openQuiz() {
    this.showQuizPopup = true;
    this.cdr.detectChanges();
  }

  closeQuiz() {
    this.showQuizPopup = false;
    this.cdr.detectChanges();
  }

  openWhiteboard() {
    this.showWhiteboardPopup = true;
    this.cdr.detectChanges();
  }

  closeWhiteboard() {
    this.showWhiteboardPopup = false;
    this.cdr.detectChanges();
  }

  openVisionBoard() {
    this.showVisionBoardPopup = true;
    this.cdr.detectChanges();
  }

  closeVisionBoard() {
    this.showVisionBoardPopup = false;
    this.cdr.detectChanges();
  }

  openKanban() {
    this.showKanbanPopup = true;
    this.cdr. detectChanges();
  }

  closeKanban() {
    this.showKanbanPopup = false;
    this. cdr.detectChanges();
  }
}