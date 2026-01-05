import { Component, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface QuizQuestion {
  id: string;
  question: string;
  type: 'radio' | 'checkbox';
  options: { value: string; label: string }[];
  correctAnswers: string[];
}

@Component({
  selector: 'app-quiz-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quiz-popup.html',
  styleUrl: './quiz-popup.scss'
})
export class QuizPopupComponent {
  
  @Output() close = new EventEmitter<void>();

  selectedAnswers: { [key: string]: string[] } = {
    q1: [],
    q2: [],
    q3: [],
    q4: [],
    q5: []
  };

  score: number | null = null;
  totalQuestions: number = 5;
  showResult: boolean = false;

  questions: QuizQuestion[] = [
    {
      id:  'q1',
      question: 'Šta je skraćenica HTML? ',
      type: 'radio',
      options: [
        { value: 'a', label: 'HyperText Markup Language' },
        { value: 'b', label: 'HighText Markdown Language' },
        { value: 'c', label: 'HyperText Makeup Language' }
      ],
      correctAnswers: ['a']
    },
    {
      id: 'q2',
      question: 'Koje se oznake koriste za izradu popisa u HTML-u?',
      type: 'checkbox',
      options: [
        { value: 'a', label: '<ul>' },
        { value: 'b', label: '<ol>' },
        { value: 'c', label: '<li>' },
        { value: 'd', label: '<br>' }
      ],
      correctAnswers: ['a', 'b', 'c']
    },
    {
      id: 'q3',
      question: 'Koja se oznaka koristi za umetanje slike? ',
      type: 'radio',
      options: [
        { value: 'a', label: '<image>' },
        { value: 'b', label: '<img>' },
        { value: 'c', label: '<src>' }
      ],
      correctAnswers: ['b']
    },
    {
      id: 'q4',
      question: 'Koji od sljedećih su valjani HTML atributi?',
      type: 'checkbox',
      options: [
        { value:  'a', label: 'href' },
        { value:  'b', label: 'src' },
        { value:  'c', label: 'bold' },
        { value:  'd', label: 'alt' }
      ],
      correctAnswers: ['a', 'b', 'd']
    },
    {
      id: 'q5',
      question:  'Koji je ispravan način za stvaranje linkova u HTML-u?',
      type:  'radio',
      options:  [
        { value: 'a', label: '<a url="example.com">Click</a>' },
        { value:  'b', label: '<a href="example.com">Click</a>' },
        { value:  'c', label: '<link>Click</link>' }
      ],
      correctAnswers: ['b']
    }
  ];

  constructor(private cdr:  ChangeDetectorRef) {}

  closePopup() {
    this.close.emit();
  }

  onRadioChange(questionId: string, value: string) {
    this.selectedAnswers[questionId] = [value];
    this.cdr.detectChanges();
  }

  onCheckboxChange(questionId: string, value: string, event: any) {
    const checked = event.target.checked;
    
    if (checked) {
      if (!this.selectedAnswers[questionId].includes(value)) {
        this.selectedAnswers[questionId].push(value);
      }
    } else {
      this.selectedAnswers[questionId] = this.selectedAnswers[questionId].filter(v => v !== value);
    }
    
    this.cdr. detectChanges();
  }

  checkAnswers() {
    console.log('=== CHECKING ANSWERS ===');
    
    let correctCount = 0;

    this.questions.forEach(question => {
      const selected = this.selectedAnswers[question.id] || [];
      const correct = question.correctAnswers;

      const sortedSelected = [...selected]. sort();
      const sortedCorrect = [...correct].sort();

      if (sortedSelected.length === sortedCorrect.length &&
          sortedSelected.every((val, index) => val === sortedCorrect[index])) {
        correctCount++;
      }
    });


    this.score = correctCount;
    this.showResult = true;
    
    console.log('Score:', this.score);
    console.log('Show result:', this.showResult);
    
    
    this.cdr.detectChanges();
    
    setTimeout(() => {
      this.cdr.detectChanges();
      console.log('After timeout - showResult:', this.showResult);
    }, 0);
  }

  restartQuiz() {
    this.selectedAnswers = {
      q1: [],
      q2: [],
      q3: [],
      q4: [],
      q5: []
    };
    this.score = null;
    this.showResult = false;
    this.cdr.detectChanges();
  }

  isChecked(questionId: string, value: string): boolean {
    return this.selectedAnswers[questionId]?.includes(value) || false;
  }

  getScorePercentage(): number {
    if (this.score === null) return 0;
    return Math.round((this.score / this.totalQuestions) * 100);
  }

  getScoreClass(): string {
    const percentage = this.getScorePercentage();
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'error';
  }
}