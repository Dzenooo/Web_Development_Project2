## Projekat 2 - Web Programiranje

Dokumentacija za projekt 2 iz predmeta "Web Programiranje".

## Pregled
Student Productivity Platform je kompleksna web aplikacija razvijena za studente IPI Akademije koja kombinuje:

Informacijski sistem - Prikaz informacija o kursevima, rasporedu i kontakt podacima
Productivity tracker - Praćenje dnevnih navika (voda, spavanje, vježbanje, raspoloženje)
Task management - Organizacija zadataka kroz Kanban ploču i task planner
Edukativni alati - Kvizovi i interaktivne igre
Kreativni alati - Whiteboard za crtanje, Vision Board za postavljanje ciljeva

## Tehnologije
-Frontend
  --Angular 18.2.0
  --TypeScript 5.5+
  --SCSS
  --RxJS 7.8.0
  --Angular Router 18.2.0
  --Reacitve Forms 18.2.0

-Native Browser APIs
  --localStorage
  --HTML5 Canvas API 
  --Drag&Drop API

-Backend
  --Firebase Authentication 11.1.0
  --Cloud Firestore 11.1.0
  --AngularFire 18.0.1

-Development Tools
  --Node.js (v18+) - JavaScript runtime za development server
  --npm (v9+) - Package manager za dependencies
  --Angular CLI (v18+) - Command-line interface za Angular development
  --Git - Version control sistem

## Struktura

Web_Development_Project2/
│
├── angular-app/                                    # ANGULAR APLIKACIJA
│   │
│   ├── src/
│   │   │
│   │   ├── app/
│   │   │   │
│   │   │   ├── core/                               # CORE FUNKCIONALNOSTI
│   │   │   │   │
│   │   │   │   ├── guards/
│   │   │   │   │   └── auth.guard.ts               # Route zaštita
│   │   │   │   │       - Functional guard (modern pristup)
│   │   │   │   │       - Provjerava localStorage za user session
│   │   │   │   │       - Redirect na /login ako user nije prijavljen
│   │   │   │   │
│   │   │   │   └── services/
│   │   │   │       │
│   │   │   │       ├── auth.ts                     # Autentifikacija servis
│   │   │   │       │   - register(email, password)
│   │   │   │       │   - login(email, password)
│   │   │   │       │   - logout()
│   │   │   │       │   - getCurrentUser()
│   │   │   │       │   - Firebase Auth integracija
│   │   │   │       │
│   │   │   │       ├── user.ts                     # User management servis
│   │   │   │       │   - getCurrentUserData()
│   │   │   │       │   - updateProfile(data)
│   │   │   │       │   - updatePassword(newPass)
│   │   │   │       │   - updateTheme(theme)
│   │   │   │       │   - Firestore user CRUD operacije
│   │   │   │       │
│   │   │   │       └── tracker. ts                  # Tracker data servis
│   │   │   │           - saveWaterTracker(data)
│   │   │   │           - getMoodTracker()
│   │   │   │           - saveSleepTracker(data)
│   │   │   │           - saveExerciseTracker(data)
│   │   │   │           - saveTaskPlanner(data)
│   │   │   │           - saveGratitudeJournal(data)
│   │   │   │           - saveKanbanBoard(tasks)
│   │   │   │           - getKanbanBoard()
│   │   │   │           - Firestore trackers sub-kolekcija
│   │   │   │
│   │   │   ├── shared/                             # DIJELJENE KOMPONENTE
│   │   │   │   │
│   │   │   │   ├── navigation/                     # Public navigacija
│   │   │   │   │   ├── navigation.ts
│   │   │   │   │   │   - Navigacija za public stranice
│   │   │   │   │   │   - Logo IPI Akademije
│   │   │   │   │   │   - Linkovi:  O kursevima, Popis, Raspored, Kontakt
│   │   │   │   │   │   - Login/Registracija dugme (ako nije ulogovan)
│   │   │   │   │   │   - Profil/Trackers/FunZone (ako je ulogovan)
│   │   │   │   │   │   - isLoggedIn() metoda za conditional rendering
│   │   │   │   │   │
│   │   │   │   │   ├── navigation. html
│   │   │   │   │   │   - <header> sa logo-om
│   │   │   │   │   │   - <nav> sa routerLink direktivama
│   │   │   │   │   │   - *ngIf za login/logout state
│   │   │   │   │   │
│   │   │   │   │   └── navigation.scss
│   │   │   │   │       - Flexbox layout (logo + linkovi na istoj liniji)
│   │   │   │   │       - Hover efekti
│   │   │   │   │       - Responsive (@media queries)
│   │   │   │   │       - Gradient button za Login
│   │   │   │   │
│   │   │   │   └── app-navigation/                 # Protected navigacija
│   │   │   │       ├── app-navigation.ts
│   │   │   │       │   - Navigacija za logovane korisnike
│   │   │   │       │   - Linkovi: Profil, Trackers, FunZone
│   │   │   │       │   - logout() metoda
│   │   │   │       │   - AuthService injection
│   │   │   │       │
│   │   │   │       ├── app-navigation.html
│   │   │   │       │   - <header> sa app branding
│   │   │   │       │   - <nav> sa routerLinkActive
│   │   │   │       │   - Logout button sa (click) event
│   │   │   │       │
│   │   │   │       └── app-navigation.scss
│   │   │   │           - Gradient background
│   │   │   │           - Active link indicator
│   │   │   │           - Sticky positioning
│   │   │   │
│   │   │   ├── modules/                            # FEATURE MODULI
│   │   │   │   │
│   │   │   │   ├── auth/                           # AUTENTIFIKACIJA MODUL
│   │   │   │   │   │
│   │   │   │   │   ├── login/
│   │   │   │   │   │   ├── login.ts
│   │   │   │   │   │   │   - Reactive forma (FormBuilder)
│   │   │   │   │   │   │   - Validatori:  email (Validators.email), password (minLength:  6)
│   │   │   │   │   │   │   - async onSubmit() metoda
│   │   │   │   │   │   │   - AuthService. login() poziv
│   │   │   │   │   │   │   - Error handling (Firebase error codes)
│   │   │   │   │   │   │   - Redirect na /profile nakon uspjeha
│   │   │   │   │   │   │   - Loading state
│   │   │   │   │   │   │
│   │   │   │   │   │   ├── login.html
│   │   │   │   │   │   │   - [formGroup]="loginForm"
│   │   │   │   │   │   │   - formControlName direktivе
│   │   │   │   │   │   │   - *ngIf za error poruke
│   │   │   │   │   │   │   - (ngSubmit)="onSubmit()"
│   │   │   │   │   │   │   - [disabled]="loading || loginForm.invalid"
│   │   │   │   │   │   │
│   │   │   │   │   │   └── login.scss
│   │   │   │   │   │       - Centrirani layout
│   │   │   │   │   │       - Card design sa shadow
│   │   │   │   │   │       - Input focus states
│   │   │   │   │   │       - Error styling (. error-message class)
│   │   │   │   │   │
│   │   │   │   │   └── register/
│   │   │   │   │       ├── register.ts
│   │   │   │   │       │   - Reactive forma sa 3 polja
│   │   │   │   │       │   - email, password, confirmPassword
│   │   │   │   │       │   - Custom validator:  passwordMatchValidator
│   │   │   │   │       │   - AuthService.register() poziv
│   │   │   │   │       │   - Automatska kreacija Firestore user dokumenta
│   │   │   │   │       │   - Redirect na /profile
│   │   │   │   │       │
│   │   │   │   │       ├── register.html
│   │   │   │   │       │   - Tri input polja
│   │   │   │   │       │   - Password match error prikaz
│   │   │   │   │       │   - Link ka login stranici
│   │   │   │   │       │
│   │   │   │   │       └── register.scss
│   │   │   │   │           - Isti stil kao login
│   │   │   │   │           - Dodatni prostor za 3 polja
│   │   │   │   │
│   │   │   │   ├── pages/                          # PUBLIC STRANICE
│   │   │   │   │   │
│   │   │   │   │   ├── landing/
│   │   │   │   │   │   ├── landing.ts
│   │   │   │   │   │   │   - Jednostavan presentational component
│   │   │   │   │   │   │   - Nema business logike
│   │   │   │   │   │   │
│   │   │   │   │   │   ├── landing.html
│   │   │   │   │   │   │   - <app-navigation> komponenta
│   │   │   │   │   │   │   - <article> sa sadržajem
│   │   │   │   │   │   │   - Sekcije: O kursevima, IPI, Student Fun Zone
│   │   │   │   │   │   │   - <footer>
│   │   │   │   │   │   │
│   │   │   │   │   │   └── landing.scss
│   │   │   │   │   │       - max-width container (900px)
│   │   │   │   │   │       - Card layout sa border-radius
│   │   │   │   │   │       - Typography (heading stilovi)
│   │   │   │   │   │       - Responsive images
│   │   │   │   │   │
│   │   │   │   │   ├── popis/
│   │   │   │   │   │   ├── popis.ts
│   │   │   │   │   │   ├── popis.html
│   │   │   │   │   │   │   - <ol> lista kurseva
│   │   │   │   │   │   │   - Dvije sekcije sa start atributom
│   │   │   │   │   │   │   - Osnovni kursevi (8)
│   │   │   │   │   │   │   - Web tehnologije (4)
│   │   │   │   │   │   │
│   │   │   │   │   │   └── popis.scss
│   │   │   │   │   │       - List styling
│   │   │   │   │   │       - Hover efekti na <li>
│   │   │   │   │   │
│   │   │   │   │   ├── raspored/
│   │   │   │   │   │   ├── raspored.ts
│   │   │   │   │   │   ├── raspored. html
│   │   │   │   │   │   │   - <table> sa <thead> i <tbody>
│   │   │   │   │   │   │   - Kolone:  Kurs, Šifra, Početak, Sat, Trajanje, Učionica
│   │   │   │   │   │   │   - 12 redova podataka
│   │   │   │   │   │   │
│   │   │   │   │   │   └── raspored.scss
│   │   │   │   │   │       - Table styling
│   │   │   │   │   │       - Gradient header
│   │   │   │   │   │       - Zebra striping
│   │   │   │   │   │       - Responsive (horizontal scroll)
│   │   │   │   │   │
│   │   │   │   │   └── kontakt/
│   │   │   │   │       ├── kontakt.ts
│   │   │   │   │       │   - FormBuilder injection
│   │   │   │   │       │   - contactForm:  FormGroup
│   │   │   │   │       │   - Validatori: 
│   │   │   │   │       │   │   - fullname (required, minLength:  5)
│   │   │   │   │       │   │   - email (required, email)
│   │   │   │   │       │   │   - phone (required, pattern: /^[\d\s\+\-()]{7,20}$/)
│   │   │   │   │       │   │   - message (required)
│   │   │   │   │       │   │   - terms (requiredTrue)
│   │   │   │   │       │   │   - newsletter (optional)
│   │   │   │   │       │   - isFieldInvalid(fieldName) helper metoda
│   │   │   │   │       │   - onSubmit() sa simulacijom slanja
│   │   │   │   │       │
│   │   │   │   │       ├── kontakt.html
│   │   │   │   │       │   - [formGroup]="contactForm"
│   │   │   │   │       │   - Input polja sa formControlName
│   │   │   │   │       │   - Checkbox-ovi za terms i newsletter
│   │   │   │   │       │   - Conditional error messages
│   │   │   │   │       │   - Success message display
│   │   │   │   │       │
│   │   │   │   │       └── kontakt.scss
│   │   │   │   │           - Form layout
│   │   │   │   │           - Input focus states
│   │   │   │   │           - Error message styling
│   │   │   │   │           - Success alert styling
│   │   │   │   │
│   │   │   │   ├── profile/                        # USER PROFIL MODUL
│   │   │   │   │   │
│   │   │   │   │   ├── profile. ts
│   │   │   │   │   │   - UserService injection
│   │   │   │   │   │   - AuthService injection
│   │   │   │   │   │   - userData objekt
│   │   │   │   │   │   - profileForm: FormGroup (firstName, lastName, displayName)
│   │   │   │   │   │   - passwordForm: FormGroup (newPassword, confirmPassword)
│   │   │   │   │   │   - editMode boolean flag
│   │   │   │   │   │   - changePasswordMode boolean flag
│   │   │   │   │   │   - ngOnInit() → loadUserData()
│   │   │   │   │   │   - enableEditMode(), cancelEdit()
│   │   │   │   │   │   - saveProfile() → updateProfile()
│   │   │   │   │   │   - changePassword() → updatePassword()
│   │   │   │   │   │   - passwordMatchValidator custom validator
│   │   │   │   │   │
│   │   │   │   │   ├── profile.html
│   │   │   │   │   │   - <app-app-navigation> komponenta
│   │   │   │   │   │   - Loading state prikaz
│   │   │   │   │   │   - View mode (readonly display)
│   │   │   │   │   │   - Edit mode (reactive forma)
│   │   │   │   │   │   - Password change sekcija
│   │   │   │   │   │   - Theme switcher komponenta
│   │   │   │   │   │   - Success/error alerts
│   │   │   │   │   │
│   │   │   │   │   ├── profile.scss
���   │   │   │   │   │   - Card layout za sekcije
│   │   │   │   │   │   - Grid layout za info display
│   │   │   │   │   │   - Form styling
│   │   │   │   │   │   - Button groups
│   │   │   │   │   │
│   │   │   │   │   └── components/
│   │   │   │   │       └── theme-switcher/
│   │   │   │   │           ├── theme-switcher.ts
│   │   │   │   │           │   - DOCUMENT injection
│   │   │   │   │           │   - UserService injection
│   │   │   │   │           │   - currentTheme:   string
│   │   │   │   │           │   - themes array (light, dark, rainbow)
│   │   │   │   │           │   - ngOnInit() → getUserTheme()
│   │   │   │   │           │   - selectTheme(themeName)
│   │   │   │   │           │   - applyTheme(theme) → body.classList manipulation
│   │   │   │   │           │   - updateTheme() → Firestore save
│   │   │   │   │           │
│   │   │   │   │           ├── theme-switcher.html
│   │   │   │   │           │   - Tri theme opcije (clickable divs)
│   │   │   │   │           │   - Preview boxes sa bojama
│   │   │   │   │           │   - [class.active] binding
│   │   │   │   │           │   - (click)="selectTheme()"
│   │   │   │   │           │
│   │   │   │   │           └── theme-switcher.scss
│   │   │   │   │               - Flexbox layout za opcije
│   │   │   │   │               - Preview box styling
│   │   │   │   │               - Active state indicator
│   │   │   │   │               - Hover animations
│   │   │   │   │
│   │   │   │   ├── mytrackers/                     # HABIT TRACKERS MODUL
│   │   │   │   │   │
│   │   │   │   │   ├── my-trackers.ts
│   │   │   │   │   │   - showWaterPopup, showMoodPopup, ...  boolean flags
│   │   │   │   │   │   - openWaterTracker(), closWaterTracker()
│   │   │   │   │   │   - (isti pattern za sve trackere)
│   │   │   │   │   │
│   │   │   │   │   ├── my-trackers.html
│   │   │   │   │   │   - <app-app-navigation>
│   │   │   │   │   │   - Grid layout sa 6 tracker kartica
│   │   │   │   │   │   - Svaka kartica:  ikona, naslov, opis, dugme
│   │   │   │   │   │   - (click)="openXxxTracker()"
│   │   │   │   │   │   - *ngIf za prikaz popup-a
│   │   │   │   │   │   - (close)="closeXxxTracker()" event
│   │   │   │   │   │
│   │   │   │   │   ├── my-trackers.scss
│   │   │   │   │   │   - Grid layout (3 kolone)
│   │   │   │   │   │   - Card hover efekti
│   │   │   │   │   │   - Icon size
│   │   │   │   │   │   - Responsive (2 kolone → 1 kolona)
│   │   │   │   │   │
│   │   │   │   │   └── components/
│   │   │   │   │       │
│   │   │   │   │       ├── water-tracker-popup/
│   │   │   │   │       │   ├── water-tracker-popup. ts
│   │   │   │   │       │   │   - @Output() close EventEmitter
│   │   │   │   │       │   │   - TrackerService injection
│   │   │   │   │       │   │   - glasses:  number (0-10)
│   │   │   │   │       │   │   - goal: number (default 8)
│   │   │   │   │       │   │   - ngOnInit() → loadData()
│   │   │   │   │       │   │   - toggleGlass(index)
│   │   │   │   │       │   │   - saveData() → TrackerService.saveWaterTracker()
│   │   │   │   │       │   │   - reset()
│   │   │   │   │       │   │
│   │   │   │   │       │   ├── water-tracker-popup.html
│   │   │   │   │       │   │   - Popup overlay
│   │   │   │   │       │   │   - Close button
│   │   │   │   │       │   │   - Progress indicator (X/8 glasses)
│   │   │   │   │       │   │   - Grid sa 10 glass ikona
│   │   │   │   │       │   │   - (click) na svakoj ikoni
│   │   │   │   │       │   │   - Save i Reset dugmad
│   │   │   │   │       │   │
│   │   │   │   │       │   └── water-tracker-popup.scss
│   │   │   │   │       │       - Centered overlay
│   │   │   │   │       │       - Modal card styling
│   │   │   │   │       │       - Glass grid layout
│   │   │   │   │       │       - Empty/filled glass states
│   │   │   │   │       │
│   │   │   │   │       ├── mood-tracker-popup/
│   │   │   │   │       │   ├── mood-tracker-popup. ts
│   │   │   │   │       │   │   - selectedDate: string
│   │   │   │   │       │   │   - selectedMood: string
│   │   │   │   │       │   │   - moodNote: string
│   │   │   │   │       │   │   - moodHistory: array
│   │   │   │   │       │   │   - moods array (excellent, good, okay, bad, terrible)
│   │   │   │   │       │   │   - selectMood(mood)
│   │   │   │   │       │   │   - saveMood()
│   │   │   │   │       │   │   - generateCalendar() - prikaz mjeseca
│   │   │   │   │       │   │
│   │   │   │   │       │   ├── mood-tracker-popup. html
│   │   │   │   │       │   │   - Kalendarski prikaz (7x5 grid)
│   │   │   │   │       │   │   - Mood selector (5 emoji dugmadi)
│   │   │   │   │       │   │   - Textarea za note
│   │   │   │   │       │   │   - Save dugme
│   │   │   │   │       │   │
│   │   │   │   │       │   └── mood-tracker-popup.scss
│   │   │   │   │       │       - Calendar grid styling
│   │   │   │   │       │       - Color-coded cells po mood-u
│   │   │   │   │       │       - Mood selector buttons
│   │   │   │   │       │
│   │   │   │   │       ├── sleep-tracker-popup/
│   │   │   │   │       │   ├── sleep-tracker-popup.ts
│   │   │   │   │       │   │   - sleepHours: number
│   │   │   │   │       │   │   - sleepQuality: string
│   │   │   │   │       │   │   - sleepHistory: array
│   │   │   │   │       │   │   - saveSleep()
│   │   │   │   │       │   │   - deleteSleepEntry(entry)
│   │   │   │   │       │   │   - calculateAverage()
│   │   │   │   │       │   │
│   │   │   │   │       │   ├── sleep-tracker-popup. html
│   │   │   │   │       │   │   - Input type="number" za sate
│   │   │   │   │       │   │   - Select za quality
│   │   │   │   │       │   │   - Lista prethodnih unosa
│   │   │   │   │       │   │   - Weekly average display
│   │   │   │   │       │   │
│   │   │   │   │       │   └── sleep-tracker-popup.scss
│   │   │   │   │       │       - Form layout
│   │   │   │   │       │       - History list styling
│   │   │   │   │       │
│   │   │   │   │       ├── exercise-tracker-popup/
│   │   │   │   │       │   ├── exercise-tracker-popup.ts
│   │   │   │   │       │   │   - exercises: array
│   │   │   │   │       │   │   - exerciseType, duration, calories
│   │   │   │   │       │   │   - addExercise()
│   │   │   │   │       │   │   - removeExercise(index)
│   │   │   │   │       │   │   - saveExercises()
│   │   │   │   │       │   │   - calculateTotals()
│   │   │   │   │       │   │
│   │   │   │   │       │   ├── exercise-tracker-popup.html
│   │   │   │   │       │   │   - Forma za dodavanje vježbe
│   │   │   │   │       │   │   - Lista trenutnih vježbi
│   │   │   │   │       │   │   - Delete button po vježbi
│   │   │   │   │       │   │   - Total statistics display
│   │   │   │   │       │   │
│   │   │   │   │       │   └── exercise-tracker-popup.scss
│   │   │   │   │       │       - Exercise list layout
│   │   │   │   │       │       - Add form styling
│   │   │   │   │       │
│   │   │   │   │       ├── task-planner-popup/
│   │   │   │   │       │   ├── task-planner-popup.ts
│   │   │   │   │       │   │   - tasks: array
│   │   │   │   │       │   │   - newTaskText: string
│   │   │   │   │       │   │   - addTask()
│   │   │   │   │       │   │   - toggleTask(task)
│   │   │   │   │       │   │   - deleteTask(task)
│   │   │   │   │       │   │   - saveTasks()
│   │   │   │   │       │   │   - generateId() helper
│   │   │   │   │       │   │
│   │   │   │   │       │   ├── task-planner-popup.html
│   │   │   │   │       │   │   - Input za novi task
│   │   │   │   │       │   │   - Lista tasks sa checkboxima
│   │   │   │   │       │   │   - Strikethrough za completed
│   │   │   │   │       │   │   - Delete button
│   │   │   │   │       │   │
│   │   │   │   │       │   └── task-planner-popup.scss
│   │   │   │   │       │       - Checkbox styling
│   │   │   │   │       │       - Completed task styling
│   │   │   │   │       │
│   │   │   │   │       └── gratitude-journal-popup/
│   │   │   │   │           ├── gratitude-journal-popup.ts
│   │   │   │   │           │   - entries: string[]
│   │   │   │   │           │   - newEntry: string
│   │   │   │   │           │   - addEntry()
│   │   │   │   │           │   - deleteEntry(index)
│   │   │   │   │           │   - saveJournal()
│   │   │   │   │           │
│   │   │   │   │           ├── gratitude-journal-popup.html
│   │   │   │   │           │   - Textarea za novi entry
│   │   │   │   │           │   - Lista entries
│   │   │   │   │           │   - Delete opcija
│   │   │   │   │           │
│   │   │   │   │           └── gratitude-journal-popup.scss
│   │   │   │   │               - Journal entry styling
│   │   │   │   │               - Textarea appearance
│   │   │   │   │
│   │   │   │   └── funzone/                        # FUN ZONE MODUL
│   │   │   │       │
│   │   │   │       ├── funzone.ts
│   │   │   │       │   - showBingoPopup, showQuizPopup, ...  flags
│   │   │   │       │   - Open/close metode za svaki popup
│   │   │   │       │
│   │   │   │       ├── funzone.html
│   │   │   │       │   - <app-app-navigation>
│   │   │   │       │   - Grid sa 5 kartica
│   │   │   │       │   - Svaka kartica: ikona, naslov, opis
│   │   │   │       │   - Popup komponente sa *ngIf
│   │   │   │       │
│   │   │   │       ├── funzone.scss
│   │   │   │       │   - Grid layout
│   │   │   │       │   - Card animations
│   │   │   │       │
│   │   │   │       └── components/
│   │   │   │           │
│   │   │   │           ├── bingo-popup/
│   │   │   │           │   ├── bingo-popup.ts
│   │   │   │           │   │   - bingoNumbers: number[] (1-75)
│   │   │   │           │   │   - calledNumbers: Set<number>
│   │   │   │           │   │   - generateCard() - 5x5 grid
│   │   │   │           │   │   - callNumber() - random number
│   │   │   │           │   │   - checkWin() - row/column/diagonal check
│   │   │   │           │   │   - reset()
│   │   │   │           │   │
│   │   │   │           │   ├── bingo-popup.html
│   │   │   │           │   │   - 5x5 grid prikaz
│   │   │   │           │   │   - Called numbers display
│   │   │   │           │   │   - Call Number dugme
│   │   │   │           │   │   - Reset dugme
│   │   │   │           │   │   - Win notification
│   │   │   │           │   │
│   │   │   │           │   └── bingo-popup.scss
│   │   │   │           │       - Grid layout (5x5)
│   │   │   │           │       - Cell styling
│   │   │   │           │       - Called number highlighting
│   │   │   │           │       - Win animation
│   │   │   │           │
│   │   │   │           ├── quiz-popup/
│   │   │   │           │   ├── quiz-popup.ts
│   │   │   │           │   │   - questions: array
│   │   │   │           │   │   - currentQuestionIndex:  number
│   │   │   │           │   │   - score: number
│   │   │   │           │   │   - quizCompleted: boolean
│   │   │   │           │   │   - selectAnswer(answer)
│   │   │   │           │   │   - nextQuestion()
│   │   │   │           │   │   - restartQuiz()
│   │   │   │           │   │
│   │   │   │           │   ├── quiz-popup.html
│   │   │   │           │   │   - Question display
│   │   │   │           │   │   - Answer options (buttons)
│   │   │   │           │   │   - Score display
│   │   │   │           │   │   - Progress indicator
│   │   │   │           │   │   - Results screen
│   │   │   │           │   │
│   │   │   │           │   └── quiz-popup. scss
│   │   │   │           │       - Question container
│   │   │   │           │       - Answer button styling
│   │   │   │           │       - Correct/wrong feedback
│   │   │   │           │
│   │   │   │           ├── whiteboard-popup/
│   │   │   │           │   ├── whiteboard-popup.ts
│   │   │   │           │   │   - @ViewChild('canvas') canvas
│   │   │   │           │   │   - ctx: CanvasRenderingContext2D
│   │   │   │           │   │   - isDrawing: boolean
│   │   │   │           │   │   - currentColor: string
│   │   │   │           │   │   - brushSize: number
│   │   │   │           │   │   - ngAfterViewInit() → initCanvas()
│   │   │   │           │   │   - onMouseDown(), onMouseMove(), onMouseUp()
│   │   │   │           │   │   - clearCanvas()
│   │   │   │           │   │   - saveAsImage() → canvas.toDataURL()
│   │   │   │           │   │
│   │   │   │           │   ├── whiteboard-popup.html
│   │   │   │           │   │   - <canvas #canvas>
│   │   │   │           │   │   - Color picker
│   │   │   │           │   │   - Brush size slider
│   │   │   │           │   │   - Clear button
│   │   │   │           │   │   - Save button
│   │   │   │           │   │
│   │   │   │           │   └── whiteboard-popup.scss
│   │   │   │           │       - Canvas styling
│   │   │   │           │       - Toolbar layout
│   │   │   │           │       - Color picker appearance
│   │   │   │           │
│   │   │   │           ├── visionboard-popup/
│   │   │   │           │   ├── visionboard-popup.ts
│   │   │   │           │   │   - goals: array
│   │   │   │           │   │   - newGoalText: string
│   │   │   │           │   │   - addGoal()
│   │   │   │           │   │   - deleteGoal(index)
│   │   │   │           │   │   - onDragStart(event, goal)
│   │   │   │           │   │   - onDragOver(event)
│   │   │   │           │   │   - onDrop(event)
│   │   │   │           │   │   - saveBoard() → localStorage
│   │   │   │           │   │
│   │   │   │           │   ├── visionboard-popup. html
│   │   │   │           │   │   - Input za novi goal
│   │   │   │           │   │   - Drag & drop canvas
│   │   │   │           │   │   - Goal cards (draggable)
│   │   │   │           │   │   - Delete button
│   │   │   │           │   │
│   │   │   │           │   └── visionboard-popup. scss
│   │   │   │           │       - Drag area styling
│   ���   │   │           │       - Goal card design
│   │   │   │           │       - Dragging state
│   │   │   │           │
│   │   │   │           └── kanban-popup/
│   │   │   │               ├── kanban-popup.ts
│   │   │   │               │   - todoTasks: array
│   │   │   │               │   - progressTasks: array
│   │   │   │               │   - doneTasks: array
│   │   │   │               │   - draggedTask: KanbanTask | null
│   │   │   │               │   - showAddModal, showClearModal:  boolean
│   │   │   │               │   - newTaskText: string
│   │   │   │               │   - ngOnInit() → loadBoard()
│   │   │   │               │   - addTask()
│   │   │   │               │   - deleteTask(task)
│   │   │   │               │   - onDragStart(task, event)
│   │   │   │               │   - onDragOver(event)
│   │   │   │               │   - onDrop(targetStatus, event)
│   │   │   │               │   - saveBoard() → Firestore
│   │   │   │               │   - loadBoard() → Firestore
│   │   │   │               │   - removeTaskFromList(task)
│   │   │   │               │   - addTaskToList(task, status)
│   │   │   │               │
│   │   │   │               ├── kanban-popup. html
│   │   │   │               │   - Tri kolone:  To Do, Progress, Done
│   │   │   │               │   - Draggable task cards
│   │   │   │               │   - (dragstart), (dragover), (drop) eventi
│   │   │   │               │   - Add Task modal
│   │   │   │               │   - Clear Board modal
│   │   │   │               │   - Save button
│   │   │   │               │
│   │   │   │               └── kanban-popup.scss
│   │   │   │                   - 3-column layout
│   │   │   │                   - Column styling
│   │   │   │                   - Task card design
│   │   │   │                   - Dragging state
│   │   │   │                   - Modal styling
│   │   │   │
│   │   │   └── app. routes.ts                       # ROUTING KONFIGURACIJA
│   │   │       - Routes array
│   │   │       - Public routes (landing, popis, raspored, kontakt)
│   │   │       - Auth routes (login, register)
│   │   │       - Protected routes sa canActivate:  [AuthGuard]
│   │   │       - Wildcard route (404 redirect)
│   │   │
│   │   ├── environments/
│   │   │   ├── environment.ts                      # Development Firebase config
│   │   │   │   - production: false
│   │   │   │   - firebase: { apiKey, authDomain, ...  }
│   │   │   │
│   │   │   └── environment.prod.ts                 # Production Firebase config
│   │   │       - production: true
│   │   │       - firebase: { ...  }
│   │   │
│   │   ├── styles. scss                             # GLOBAL STILOVI
│   │   │   - CSS reset
│   │   │   - Theme varijable (--primary, --bg, --text, ...)
│   │   │   - . theme-light, .theme-dark, .theme-rainbow klase
│   │   │   - Global font (Inter, system fonts)
│   │   │   - Utility klase
│   │   │
│   │   └── index.html                              # Root HTML
│   │       - <app-root> mounting point
│   │       - <head> meta tags
│   │       - favicon
│   │
│   ├── angular.json                                # Angular CLI config
│   │   - Build configurations
│   │   - SCSS compiler settings
│   │   - Output paths
│   │
│   ├── package.json                                # Dependencies
│   │   - @angular/...  packages
│   │   - firebase, @angular/fire
│   │   - Scripts (start, build, test)
│   │
│   ├── tsconfig.json                               # TypeScript config
│   │   - Compiler options
│   │   - Strict mode enabled
│   │   - Module resolution
│   │
│   └── . gitignore
│       - node_modules/
│       - dist/
│       - . angular/
│       - environment. ts (lokalni)
│
├── (legacy files)                                  # STATIČKA VERZIJA
│   ├── index.html
│   ├── popis.html
│   ├── raspored.html
│   ├── kontakt.html
│   ├── StudentFunZone.html
│   ├── css/izgled.css
│   ├── slike/
│   ├── bingo/
│   ├── kviz_index.html
│   ├── visionboard/
│   ├── whiteboard/
│   └── kanban/
│
├── . gitignore                                      # Root gitignore
└── README.md                                       # Ova dokumentacija

## Arhitekturni Paterni

1. Standalone Component Architecture

    Moderan Angular pristup (Angular 14+)
    Eliminacija NgModule boilerplate koda
    Lakše tree-shaking i bundle optimization
    Bolji developer experience

2. Service Layer Pattern

    Separacija business logike od UI logike
    Reusability servisa kroz dependency injection
    Centralizovano upravljanje podacima
    Lakše testiranje

3. Reactive Programming (RxJS)

    Efikasan handling asinhronih operacija
    Automatsko upravljanje subscriptions-ima
    Lakše komponovanje async operacija

4. Route Guards

    Zaštita sensitive ruta
    Kontrola pristupa bazirana na autentifikaciji
    Automatski redirect neautorizovanih korisnika


## Struktura baze podataka


firestore/
│
└── users/                                          # Root kolekcija
    └── {userId}/                                   # Document (ID = Firebase Auth UID)
        │
        ├── POLJA:
        │   ├── email: string                       # User email (iz Firebase Auth)
        │   ├── firstName: string                   # Ime korisnika
        │   ├── lastName: string                    # Prezime korisnika
        │   ├── displayName: string                 # Puno ime za prikaz
        │   ├── theme: 'light' | 'dark' | 'rainbow' # Odabrana tema
        │   └── createdAt: timestamp                # Datum registracije
        │
        └── trackers/                               # SUB-KOLEKCIJA
            │
            ├── water-tracker/                      # Document
            │   └── {
            │       date: string,                   # Format: 'YYYY-MM-DD'
            │       glasses: number,                # Broj popijenih čaša (0-10)
            │       goal: number,                   # Cilj (default 8)
            │       timestamp: timestamp            # Vrijeme unosa
            │   }
            │
            ├── mood-tracker/                       # Document
            │   └── {
            │       date: string,
            │       mood: 'excellent' | 'good' | 'okay' | 'bad' | 'terrible',
            │       note: string,                   # Opcionalni text
            │       timestamp: timestamp
            │   }
            │
            ├── sleep-tracker/                      # Document
            │   └── {
            │       date: string,
            │       hours: number,                  # Broj sati spavanja
            │       quality: 'excellent' | 'good' | 'poor',
            │       timestamp: timestamp
            │   }
            │
            ├── exercise-tracker/                   # Document
            │   └── {
            │       date: string,
            │       exercises: [                    # Array vježbi
            │         {
            │           type: string,               # Naziv vježbe
            │           duration: number,           # Trajanje u minutima
            │           calories: number            # Potrošene kalorije
            │         }
            │       ],
            │       timestamp: timestamp
            │   }
            │
            ├── task-planner/                       # Document
            │   └── {
            │       date: string,
            │       tasks: [                        # Array zadataka
            │         {
            │           id: string,                 # Unique ID
            │           text: string,               # Tekst zadatka
            │           completed:  boolean          # Status
            │         }
            │       ],
            │       timestamp: timestamp
            │   }
            │
            ├── gratitude-journal/                  # Document
            │   └── {
            │       date: string,
            │       entries: string[],              # Array unosa
            │       timestamp: timestamp
            │   }
            │
            └── kanban-board/                       # Document
                └── {
                    tasks: [                        # Array svih taskova
                      {
                        id: string,                 # Unique ID
                        text: string,               # Tekst taska
                        status: 'todo' | 'progress' | 'done',
                        order: number               # Pozicija u koloni
                      }
                    ],
                    timestamp: timestamp
                }

## Autentifikacija i Autorizacija

  # Firebase Authentication

  1. Registracija

      1. User popuni formu (email, password, confirmPassword)
      2. Angular validacija (client-side)
      3. AuthService. register() poziv
      4. Firebase createUserWithEmailAndPassword()
      5. Success → Firestore user dokument kreacija
      6. localStorage. setItem('user', JSON.stringify(user))
      7. Redirect na /profile

  
  2. Login

      1. User unese email i password
      2. AuthService.login() poziv
      3. Firebase signInWithEmailAndPassword()
      4. Success → localStorage save
      5. Redirect na /profile
 

   3. Logout

      1. User klikne "Odjavi se"
      2. AuthService.logout() poziv
      3. Firebase signOut()
      4. localStorage.removeItem('user')
      5. Redirect na / (landing)
      6. window.location.reload() (clear state)



  # AuthGuard Implementacija

    Functional guard (moderna Angular sintaksa)
    Provjerava da li user postoji u localStorage
    Dozvoljava pristup ako postoji
    Redirect na /login ako ne postoji



## Core Servisi

  1. AuthService

  -Centralizovano upravljanje autentifikacijom kroz Firebase Auth.

    Kljucne metode:

      # register(email, password)
      # login(email, password)
      # logout()
      # getCurrentuser()

  2. UserService

  -Upravljanje user profilom i podacima u Firestore.

    Ključne metode:

      # getCurrentUserData()
      # updateProfile()
      # updatePassword()
      # updateTheme()
      # getUserTheme()

  3. TrackerService

  -Centralizovano upravljanje svim tracker podacima u Firestore sub-kolekciji.

    Ključne metode:

      # saveWaterTracker(data)
      # getWaterTracker()
      # saveMoodTracker()
      # saveSleepTracker()
      # saveExerciseTracker()
      # saveTaskPlanner()
      # saveGratitudeJournal()
      # getKanbanBoard()




## Moduli i Komponente


  # Auth Modul

  1. Login Komponenta - omogućava postojećim korisnicima da se uloguju na svoj račun
  2. Register Komponenta - omogućava novim korisnicima da naprave novi račun

  # Pages Modul

  1. Landing Komponenta - početna stranica aplikacije sa informacijama o IPI Akademiji
  2. Popis Komponenta - sadrži listu svih kurseva
  3. Raspored Komponenta - tabelarni prikaz rasporeda kurseva
  4. Kontakt Komponenta - forma sa validacijom i prikazom kontakt informacija


  # Profile Modul

  1. Profile Komponenta - prikaz i uređivanje korisničkih informacija
  2. Theme Switcher Komponenta - omogućava promjenu teme aplikacije (Light/Dark/Rainbow)


  # MyTrackers Modul

  1. MyTrackers Komponenta - kontejner komponenta koja sadrži sve trackere i upravlja njima
  2. Komponente:
      -WaterTracker
      -SleepTracker
      -MoodTracker
      -ExerciseTracker
      -Gratitude Journal
      -Task Planner


  # FunZone Modul

  1. Funzone Komponenta - prikazuje sve igrice i alate u Student Funzone-u i upravlja njima
  2. Komponente :
      -Bingo
      -Kviz
      -Whiteboard
      -Visionboard
      -Kanban ploča
  



## Routing Flow Dijagram

User Request
    ↓
Angular Router
    ↓
┌─────────────────────┐
│ Je li Public Route?  │
└────────────���────────┘
    ↓ YES             ↓ NO
    ↓                 ↓
Load Component    AuthGuard Check
                      ↓
              ┌───────────────────┐
              │ User Authenticated? │
              └───────────────────┘
                  ↓ YES        ↓ NO
                  ↓            ↓
            Load Component   Redirect /login



## Zaključak

Ova dokumentacija pokriva kompletan tehnički overview Student Productivity Platform aplikacije, uključujući:

✅ Arhitekturni paterni i dizajn odluke
✅ Detaljna struktura projekta sa objašnjenjima
✅ Firebase Firestore schema i security rules
✅ Autentifikacija i autorizacija flow
✅ Svi core servisi sa implementacijom
✅ Sve komponente sa kodom i objašnjenjima
✅ Routing sistem i guard implementacija
✅ Ključne funkcionalnosti (Water Tracker, Kanban Board)


Projekat demonstrira napredne Angular koncepte:

Standalone components
Reactive Forms sa custom validatorima
Firebase integracija (Auth + Firestore)
Route Guards
Drag & Drop API
Canvas API
Change Detection optimizacije
SCSS modularizacija
Responsive dizajn
Theme switching sistem




Autor: Dženan (Dzenooo)
GitHub: github.com/Dzenooo/Web_Development_Project2






