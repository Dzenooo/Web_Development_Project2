# Dokumentacija - Chartovi i Biblioteke

## Pregled

Ovaj dokument objašnjava koje sam chart biblioteke koristio u projektu i zašto sam donio te odluke.

## Korištene Biblioteke

### 1. **NIJEDNA EKSTERNA CHART BIBLIOTEKA** ❌

**Iznenađujuće, ali istinito!** Projekat **ne koristi** popularne chart biblioteke kao što su:
- ❌ Chart.js
- ❌ D3.js
- ❌ ApexCharts
- ❌ Recharts
- ❌ Highcharts

### 2. **Custom CSS-based Charts** ✅ (Primarno rješenje)

Umjesto eksternih biblioteka, implementirao sam **potpuno custom chartove korištenjem čistog HTML-a, CSS-a i Angular data binding-a**.

#### Implementacija:

**Lokacije:**
- `/angular-app/src/app/modules/mytrackers/components/water-tracker-popup/`
- `/angular-app/src/app/modules/mytrackers/components/sleep-tracker-popup/`
- `/angular-app/src/app/modules/mytrackers/components/exercise-tracker-popup/`
- `/angular-app/src/app/modules/mytrackers/components/task-planner-popup/`
- `/angular-app/src/app/modules/mytrackers/components/gratitude-journal-popup/`
- `/angular-app/src/app/modules/mytrackers/components/mood-tracker-popup/`

#### Primjer - Water Tracker Bar Chart:

**HTML (`water-tracker-popup.html`):**
```html
<div class="chart-section" *ngIf="allLogs && allLogs.length > 0">
  <h3>Statistika (Zadnjih 30 dana)</h3>
  <div class="simple-chart">
    <div 
      class="chart-bar" 
      *ngFor="let log of allLogs.slice(0, 30).reverse()"
      [title]="log.date + ': ' + log.totalToday + 'ml / ' + log.goal + 'ml'"
    >
      <div 
        class="chart-bar-fill" 
        [style.height.%]="log.goal > 0 ? (log.totalToday / log.goal) * 100 : 0"
        [attr.data-height]="log.totalToday + 'ml / ' + log.goal + 'ml'"
      ></div>
      <span class="chart-label">{{ log.date.substring(8) }}</span>
    </div>
  </div>
</div>
```

**CSS (`water-tracker-popup.scss`):**
```scss
.simple-chart {
  display: flex;
  align-items: flex-end;  
  justify-content: space-between;
  height: 150px;  
  gap: 4px;
  padding: 15px 10px;
  background: var(--bg-secondary);
  border-radius: 8px;
  position: relative;  
}

.chart-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end; 
  height: 100%; 
  position: relative;
}

.chart-bar-fill {
  width: 100%;
  background: linear-gradient(180deg, var(--primary), var(--primary-hover));
  border-radius: 4px 4px 0 0;
  min-height: 4px;  
  transition: all 0.3s ease;
  position: relative;

  .chart-bar:hover & {
    background: linear-gradient(180deg, var(--primary-hover), var(--primary));
    filter: brightness(1.1);
    transform: scaleY(1.05);
  }
}

.chart-label {
  font-size: 11px;
  color: var(--text-secondary);
  margin-top: 5px;
  font-weight: 600;
  position: absolute; 
  bottom: -20px;  
  white-space: nowrap;
}
```

#### Primjer - Mood Tracker Emoji Chart:

**HTML (`mood-tracker-popup.html`):**
```html
<div class="chart-section" *ngIf="allLogs && allLogs.length > 0">
  <h3>Mood History (Zadnjih 30 dana)</h3>
  <div class="mood-chart">
    <div 
      class="mood-chart-item" 
      *ngFor="let log of allLogs.slice(0, 30).reverse()"
      [title]="log.date + ': ' + (log.entries.length > 0 ? log.entries[log.entries.length - 1].mood : 'No mood')"
    >
      <span class="chart-emoji">{{ getMoodForDate(log.date) }}</span>
      <span class="chart-label">{{ log.date.substring(8) }}</span>
    </div>
  </div>
</div>
```

**CSS (`mood-tracker-popup.scss`):**
```scss
.mood-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 4px;
  padding: 15px 10px 30px 10px;
  background: var(--bg-secondary);
  border-radius: 8px;
  position: relative;
}

.mood-chart-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  cursor: pointer;
  transition: transform 0.2s;
  position: relative;
  min-width: 25px;

  &:hover {
    transform: translateY(-5px);
    z-index: 10;
  }
}

.chart-emoji {
  font-size: 24px;
  display: block;
  line-height: 1;
  margin-bottom: 5px;
}
```

### 3. **HTML5 Canvas API** ✅ (Za Whiteboard)

**Lokacija:** `/angular-app/src/app/modules/funzone/components/whiteboard-popup/`

**Korištenje:** Native HTML5 Canvas API za crtanje i interaktivni whiteboard.

**TypeScript (`whiteboard-popup.ts`):**
```typescript
private canvas!: HTMLCanvasElement;
private ctx!: CanvasRenderingContext2D;

setupCanvas() {
  this.canvas = document.getElementById('board') as HTMLCanvasElement;
  const context = this.canvas.getContext('2d');
  
  if (!context) {
    console.error('Could not get canvas context');
    return;
  }
  
  this.ctx = context;
  this.ctx.lineWidth = this.lineWidth;
  this.ctx.lineCap = 'round';
  this.ctx.strokeStyle = this.color;
  
  // Event listeners za mouse i touch
  this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
  this.canvas.addEventListener('mouseup', () => this.endDrawing());
  this.canvas.addEventListener('mousemove', (e) => this.draw(e));
}
```

### 4. **html2canvas** ✅ (Za PDF Export)

**Biblioteka:** `html2canvas` v1.4.1  
**Dodatak:** `html2pdf.js` v0.12.1

**Lokacije:**
- `/angular-app/src/app/modules/funzone/components/visionboard-popup/`
- `/angular-app/src/app/modules/funzone/components/bingo-popup/`
- `/angular-app/src/app/modules/funzone/components/whiteboard-popup/`

**Korištenje:** Konverzija HTML elemenata u slike za kreiranje PDF-ova.

**TypeScript (`visionboard-popup.ts`):**
```typescript
import html2canvas from 'html2canvas';

async downloadBoardAsPDF() {
  try {
    if (this.downloadingPDF) return;
    this.downloadingPDF = true;
    
    const board = document.getElementById('vision-board');
    if (!board) return;
    
    const canvas = await html2canvas(board, {
      scale: 2,
      useCORS: true,
      logging: false
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
    console.error('Error generating PDF:', error);
  }
}
```

---

## Zašto Sam Izabrao Ovaj Pristup?

### ✅ **Prednosti Custom CSS Charts:**

#### 1. **Zero Dependencies za Chartove** 🎯
- Nema dodatnih biblioteka koje povećavaju bundle size
- Brža inicijalizacija aplikacije
- Manje HTTP request-ova
- Jednostavnije dependency management

#### 2. **Potpuna Kontrola** 🎨
- 100% kontrola nad izgledom i animacijama
- Lakše prilagođavanje dizajnu aplikacije
- Responsive design bez dodatnih konfiguracija
- Direktna integracija sa Angular theming sistemom (light/dark/rainbow themes)

**Primjer - Theming:**
```scss
.chart-bar-fill {
  background: linear-gradient(180deg, var(--primary), var(--primary-hover));
  // Automatski prati trenutnu temu aplikacije!
}
```

#### 3. **Performance** ⚡
- Nema overhead velikih charting biblioteka
- Browser-native rendering (CSS Flexbox)
- Minimalan JavaScript execution
- Odlična performansa na mobilnim uređajima

#### 4. **Jednostavnost** 📦
- Lako razumljiv kod
- Nema komplikovanih API-ja za učenje
- Lakše održavanje
- Direktan Angular data binding bez wrapper-a

**Primjer - Angular Binding:**
```html
<div 
  class="chart-bar-fill" 
  [style.height.%]="log.goal > 0 ? (log.totalToday / log.goal) * 100 : 0"
></div>
```

#### 5. **Specifične Potrebe Projekta** 🎯
Projekat zahtijeva samo **basic visualizacije**:
- Simple bar charts (water, sleep, exercise, tasks, gratitude)
- Emoji-based mood tracker
- Ovo **ne zahtijeva** kompleksne chart biblioteke

---

### ✅ **Zašto html2canvas?**

#### 1. **Specifična Potreba - PDF Export** 📄
- Potrebno je eksportovati custom HTML boards u PDF
- html2canvas je industry standard za HTML-to-Canvas konverziju
- Radi odlično sa html2pdf.js za generiranje PDF-ova

#### 2. **Lightweight & Reliable** 🔧
- Samo 1.4.1 version (stabilna)
- Provjerena biblioteka sa 30k+ GitHub stars
- Aktivno održavana
- Dobra browser kompatibilnost

#### 3. **Use Cases u Projektu:**
- **Vision Board** - Download custom vision board-a kao PDF
- **Bingo** - Sačuvaj bingo karticu
- **Whiteboard** - Eksportuj crtež kao PDF

---

## Kada BI Trebalo Koristiti Eksterne Chart Biblioteke?

### Scenariji gdje bih preporučio Chart.js ili D3.js:

❗ **Kompleksni Chartovi:**
- Line charts sa multiple datasets
- Scatter plots
- Radar charts
- Pie/Donut charts sa interaktivnim slice-ovima
- Real-time data streaming visualizations

❗ **Advanced Interaktivnost:**
- Zoom & pan funkcionalnosti
- Cross-chart filtering
- Drill-down capabilities
- Complex tooltips i legends

❗ **Large Datasets:**
- Hiljadu+ data pointova
- Data virtualization
- Dynamic aggregation

### Za Ovaj Projekat - Custom CSS je Savršeno Rješenje! ✅

---

## Statistika Bundle Size-a

### Sa Custom CSS Charts (Trenutno):
```
angular-app/package.json dependencies:
- NO Chart.js (0 KB saved)
- NO D3.js (0 KB saved)
- html2canvas: ~84 KB (potrebno za PDF export)
- html2pdf.js: ~35 KB (potrebno za PDF export)
```

### Kada bi koristio Chart.js:
```
Chart.js: ~160 KB (minified)
+ još veći bundle ako su potrebni custom plugin-ovi
```

### Bundle Size Razlika: ~160 KB uštede! 🎉

---

## TypeScript Integracija

Custom charts koriste **pun Angular TypeScript typing** bez potrebe za eksternim type definitions:

```typescript
// Water Tracker Popup
allLogs: Array<{
  date: string;
  totalToday: number;
  goal: number;
  entries: WaterEntry[];
}> = [];

// Chart data se direktno bind-uje
<div 
  *ngFor="let log of allLogs.slice(0, 30).reverse()"
  [style.height.%]="log.goal > 0 ? (log.totalToday / log.goal) * 100 : 0"
></div>
```

Nema potrebe za:
- `npm install @types/chart.js`
- Wrapper komponente
- Complex configuration objects
- Chart instance management

---

## Responsive Design

Custom CSS charts su **fully responsive** korištenjem SCSS media queries:

```scss
@media (max-width: 768px) {
  .simple-chart {
    height: 120px;  // Manji na mobilnim uređajima
  }

  .mood-chart {
    padding: 15px 5px 30px 5px;
    gap: 2px;
  }

  .chart-emoji {
    font-size: 20px;  // Manji emojis
  }

  .chart-label {
    font-size: 9px;  // Manji text
  }
}
```

---

## Accessibility

Custom implementation omogućava jednostavnu implementaciju accessibility features:

```html
<div 
  class="chart-bar" 
  [title]="log.date + ': ' + log.totalToday + 'ml / ' + log.goal + 'ml'"
  role="img"
  [attr.aria-label]="'Water intake for ' + log.date + ': ' + log.totalToday + ' out of ' + log.goal + ' milliliters'"
>
```

---

## Animacije i Transicije

CSS transitions pružaju smooth, performantne animacije:

```scss
.chart-bar-fill {
  transition: all 0.3s ease;
  
  .chart-bar:hover & {
    filter: brightness(1.1);
    transform: scaleY(1.05);
  }
}

.mood-chart-item {
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    z-index: 10;
  }
}
```

---

## Zaključak

### **Chart Library Odluka: Custom CSS Charts** ✅

**Razlozi:**
1. ✅ **Zero Dependencies** - Nema potrebe za eksternim bibliotekama
2. ✅ **Perfect Fit** - Jednostavne visualizacije za tracking podataka
3. ✅ **Performance** - Native CSS rendering, brži load time
4. ✅ **Bundle Size** - ~160 KB manje u bundle size-u
5. ✅ **Full Control** - Potpuna kontrola nad dizajnom i behaviour-om
6. ✅ **Theme Integration** - Seamless integracija sa Angular theming sistemom
7. ✅ **Maintainability** - Jednostavan, čitljiv kod bez learning curve-a
8. ✅ **Responsive** - Native CSS media queries

### **HTML5 Canvas API** ✅
- Koristi se za Whiteboard feature
- Native browser API, nema dodatnih dependencies
- Odličan za drawing aplikacije

### **html2canvas** ✅
- Jedina "helper" biblioteka
- Neophodna za PDF export functionality
- Lightweight (84 KB) i pouzdana
- Industry standard za HTML-to-image konverziju

---

## Dodatna Razmatranja

### Buduća Proširenja

Ako bi projekat u budućnosti trebao:
- **Advanced Analytics Dashboard** → Razmotri Chart.js
- **Complex Data Relationships** → Razmotri D3.js
- **Real-time Monitoring** → Razmotri lightweight charting sa Canvas

### Trenutno Rješenje je Optimalno! 🎯

Za potrebe **Student Productivity Platform**, custom CSS charts pružaju:
- Best performance
- Smallest bundle size
- Complete design control
- Zero external dependencies (za chartove)
- Jednostavnost održavanja

---

**Autor:** Dženan (Dzenooo)  
**Datum:** Januar 2026  
**GitHub:** [github.com/Dzenooo/Web_Development_Project2](https://github.com/Dzenooo/Web_Development_Project2)
