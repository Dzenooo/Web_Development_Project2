import { Component, Output, EventEmitter, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackerService } from '../../../../core/services/tracker';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface BoardItem {
  type: string;
  className:  string;
  text: string;
  left: string;
  top: string;
  imageSrc?:  string;
}

@Component({
  selector: 'app-visionboard-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visionboard-popup.html',
  styleUrl: './visionboard-popup.scss'
})
export class VisionboardPopupComponent implements AfterViewInit {
  
  @Output() close = new EventEmitter<void>();

  loading = false;
  saveSuccess = false;

  private readonly colors = ["color1", "color2", "color3", "color4", "color5", "color6"];
  
  private readonly sampleImages = [
    "/visionboard/slika1.png",
    "/visionboard/slika2.png",
    "/visionboard/slika3.png",
    "/visionboard/slika4.png"
  ];

  private readonly sampleQuotes = [
    "Svaka dovoljno napredna tehnologija jednaka je magiji.  - Arthur C. Clarke",
    "Tehnologija je riječ koja opisuje nešto što još ne funkcionira. - Douglas Adams",
    "Ne osnivate zajednice.  Zajednice već postoje.  Pitanje koje treba postaviti je kako im možete pomoći da budu bolje. - Mark Zuckerberg"
  ];

  constructor(
    private trackerService:  TrackerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.loadSavedBoard();
    }, 200);
  }

 
  private makeDraggable(el: HTMLElement, textContainer?:  HTMLElement) {
    let offsetX: number, offsetY: number;

    const delBtn = document.createElement("button");
    delBtn.textContent = "×";
    delBtn.className = "delete-btn";
    delBtn.type = "button";
    
    el.appendChild(delBtn);

    delBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      el.remove();
    });

    el.addEventListener("mousedown", dragStart);

    function dragStart(e:  MouseEvent) {
      const target = e.target as HTMLElement;
      
      if (target === delBtn || target.className === 'delete-btn') {
        return;
      }

      if (textContainer && target === textContainer) {
        return;
      }
      
      offsetX = e. clientX - el.offsetLeft;
      offsetY = e.clientY - el.offsetTop;
      
      document.addEventListener("mousemove", drag);
      document.addEventListener("mouseup", dragEnd);
    }

    function drag(e: MouseEvent) {
      e.preventDefault();
      el.style.left = e.clientX - offsetX + "px";
      el.style.top = e. clientY - offsetY + "px";
    }

    function dragEnd() {
      document.removeEventListener("mousemove", drag);
      document.removeEventListener("mouseup", dragEnd);
    }
  }


  addNote() {
    const board = document.getElementById("board");
    if (!board) return;

    const wrapper = document.createElement("div");
    wrapper.className = "note-wrapper";
    wrapper.style.position = "absolute";
    wrapper.style.left = Math. random() * 500 + "px";
    wrapper.style.top = Math.random() * 300 + "px";

    const note = document.createElement("div");
    note.className = "note";
    note.contentEditable = "true";
    note.textContent = "Napiši nešto...";
    
    
    note.style.background = "white";
    note.style.color = "#1a1a1a";
    note.style.border = "2px solid #e0e0e0";
    note.style.padding = "12px";
    note.style. borderRadius = "6px";
    note.style. minWidth = "140px";
    note.style. minHeight = "80px";
    note.style.fontSize = "14px";
    note.style. boxShadow = "0 3px 8px rgba(0, 0, 0, 0.15)";
    
    wrapper.appendChild(note);
    this.makeDraggable(wrapper, note);
    board.appendChild(wrapper);
  }


  addImage() {
    const board = document. getElementById("board");
    if (!board) return;

    const wrapper = document.createElement("div");
    wrapper.className = "img-wrapper";
    wrapper.style. position = "absolute";
    wrapper.style.left = Math.random() * 400 + "px";
    wrapper.style.top = Math.random() * 250 + "px";
    
    // FORCE white frame styles
    wrapper.style.padding = "8px";
    wrapper.style. background = "white";
    wrapper. style.borderRadius = "8px";
    wrapper.style. border = "2px solid #e0e0e0";
    wrapper.style. boxShadow = "0 3px 8px rgba(0, 0, 0, 0.15)";
    wrapper.style.width = "116px";
    wrapper.style. height = "116px";
    
    const img = document.createElement("img");
    const randomImg = this.sampleImages[Math.floor(Math.random() * this.sampleImages.length)];
    
    img.src = randomImg;
    img.className = "pinned-img";
    img. style.width = "100px";
    img.style.height = "100px";
    img.style.objectFit = "cover";
    img.style. borderRadius = "4px";
    img.style. display = "block";
    
    wrapper.appendChild(img);
    this.makeDraggable(wrapper);
    board.appendChild(wrapper);
  }

  addQuote() {
    const board = document.getElementById("board");
    if (!board) return;

    const wrapper = document. createElement("div");
    wrapper.className = "quote-wrapper";
    wrapper.style.position = "absolute";
    wrapper.style. left = Math.random() * 400 + "px";
    wrapper.style.top = Math. random() * 250 + "px";

    const q = document.createElement("div");
    q.className = "quote";
    q.textContent = this.sampleQuotes[Math.floor(Math.random() * this.sampleQuotes.length)];
    q.contentEditable = "false";
    

    q.style.background = "white";
    q.style. color = "#1a1a1a";
    q.style. border = "2px solid #e0e0e0";
    q.style.padding = "15px";
    q.style. borderRadius = "6px";
    q.style.width = "220px";
    q.style. fontSize = "14px";
    q.style.fontStyle = "italic";
    q.style.textAlign = "center";
    q.style.boxShadow = "0 3px 8px rgba(0, 0, 0, 0.15)";
    q.style.cursor = "default";
    
    wrapper.appendChild(q);
    this.makeDraggable(wrapper, q);
    board.appendChild(wrapper);
  }


  async saveToFirestore() {
    const board = document.getElementById("board");
    if (!board) return;

    this.loading = true;
    this.saveSuccess = false;
    this.cdr.detectChanges();

    try {
      const items: BoardItem[] = [];
      

      const wrappers = board.querySelectorAll(".note-wrapper, .quote-wrapper, .img-wrapper");
      
      wrappers.forEach((wrapper:  Element) => {
        const wrapperEl = wrapper as HTMLElement;
        
        let type = "";
        let text = "";
        let imageSrc = "";
        let className = "";

        if (wrapper.classList.contains("note-wrapper")) {
          type = "note";
          const noteEl = wrapper. querySelector(".note") as HTMLElement;
          text = noteEl?. textContent || "";
          className = noteEl?.className || "";
        } else if (wrapper.classList. contains("quote-wrapper")) {
          type = "quote";
          const quoteEl = wrapper.querySelector(".quote") as HTMLElement;
          text = quoteEl?.textContent || "";
          className = quoteEl?.className || "";
        } else if (wrapper.classList. contains("img-wrapper")) {
          type = "image";
          const imgEl = wrapper.querySelector("img") as HTMLImageElement;
          imageSrc = imgEl?.src || "";
          className = "pinned-img";
        }

        const data:  BoardItem = {
          type,
          className,
          text,
          left: wrapperEl.style.left,
          top: wrapperEl.style.top,
          imageSrc
        };
        
        items.push(data);
      });

      console.log('Saving items:', items);

      const success = await this.trackerService. saveVisionBoard(items);

      if (success) {
        this.saveSuccess = true;
        setTimeout(() => {
          this.saveSuccess = false;
          this. cdr.detectChanges();
        }, 2000);
      } else {
        alert('Greška pri čuvanju! ');
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('Greška! ');
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }


  async loadSavedBoard() {
    try {
      const items = await this.trackerService. getVisionBoard();
      if (!items || items.length === 0) return;

      const board = document.getElementById("board");
      if (!board) return;

      board.innerHTML = '';

      items.forEach((item: BoardItem) => {
        const wrapper = document.createElement("div");
        wrapper.style.position = "absolute";
        wrapper.style.left = item. left;
        wrapper.style.top = item.top;

        if (item.type === "note") {
          wrapper.className = "note-wrapper";
          const note = document.createElement("div");
          note.className = item.className;
          note.contentEditable = "true";
          note.textContent = item.text;
          
      
          note.style.background = "white";
          note.style.color = "#1a1a1a";
          note.style.border = "2px solid #e0e0e0";
          note.style.padding = "12px";
          note.style.borderRadius = "6px";
          note.style.minWidth = "140px";
          note.style.minHeight = "80px";
          note.style. fontSize = "14px";
          note.style.boxShadow = "0 3px 8px rgba(0, 0, 0, 0.15)";
          
          wrapper.appendChild(note);
          this.makeDraggable(wrapper, note);
        } else if (item.type === "quote") {
          wrapper.className = "quote-wrapper";
          const quote = document.createElement("div");
          quote.className = item.className;
          quote.contentEditable = "false";
          quote.textContent = item.text;
          
    
          quote.style.background = "white";
          quote.style.color = "#1a1a1a";
          quote.style.border = "2px solid #e0e0e0";
          quote.style.padding = "15px";
          quote.style.borderRadius = "6px";
          quote.style.width = "220px";
          quote.style. fontSize = "14px";
          quote.style.fontStyle = "italic";
          quote.style. textAlign = "center";
          quote.style.boxShadow = "0 3px 8px rgba(0, 0, 0, 0.15)";
          quote.style.cursor = "default";
          
          wrapper.appendChild(quote);
          this.makeDraggable(wrapper, quote);
        } else if (item.type === "image") {
          wrapper.className = "img-wrapper";
          
       
          wrapper.style.padding = "8px";
          wrapper.style.background = "white";
          wrapper.style.borderRadius = "8px";
          wrapper.style.border = "2px solid #e0e0e0";
          wrapper.style.boxShadow = "0 3px 8px rgba(0, 0, 0, 0.15)";
          wrapper. style.width = "116px";
          wrapper.style.height = "116px";
          
          const img = document.createElement("img");
          img.className = "pinned-img";
          img.src = item.imageSrc || "";
          
          img.style.width = "100px";
          img.style.height = "100px";
          img.style.objectFit = "cover";
          img.style. borderRadius = "4px";
          img.style.display = "block";
          
          wrapper. appendChild(img);
          this.makeDraggable(wrapper);
        }

        board.appendChild(wrapper);
      });
    } catch (error) {
      console.error('Error loading:', error);
    }
  }

  clearBoard() {
    if (confirm("Očisti ploču? (Sačuvani board se NEĆE obrisati)")) {
      const board = document.getElementById("board");
      if (board) {
        board.innerHTML = "";
      }
    }
  }

  async exportToPDF() {
    const board = document.getElementById("board");
    if (!board) return;

    try {
      const canvas = await html2canvas(board, {
        backgroundColor: null,
        scale: 2
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('vision-board.pdf');
    } catch (error) {
      console.error('Error:', error);
      alert('Greška pri export-u!');
    }
  }

  closePopup() {
    this.close.emit();
  }
}