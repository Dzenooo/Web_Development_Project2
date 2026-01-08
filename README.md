## Projekat 2 - Web Programiranje

Dokumentacija za projekt 2 iz predmeta "Web Programiranje".

## 📚 Dodatna Dokumentacija

- **[CHARTOVI_DOKUMENTACIJA.md](./CHARTOVI_DOKUMENTACIJA.md)** - Detaljna analiza chart biblioteka i implementacije (na srpskom)
- **[CHARTS_IMPLEMENTATION_SUMMARY.md](./CHARTS_IMPLEMENTATION_SUMMARY.md)** - Chart implementation summary (in English)

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

-Data Visualization
  --Custom CSS Charts (zero external dependencies)
  --HTML5 Canvas API (Whiteboard)
  --html2canvas (PDF export)
  --html2pdf.js (PDF generation)

-Backend
  --Firebase Authentication 11.1.0
  --Cloud Firestore 11.1.0
  --AngularFire 18.0.1

-Development Tools
  --Node.js (v18+) - JavaScript runtime za development server
  --npm (v9+) - Package manager za dependencies
  --Angular CLI (v18+) - Command-line interface za Angular development
  --Git - Version control sistem



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

Standalone components | 
Reactive Forms sa custom validatorima | 
Firebase integracija (Auth + Firestore) | 
Route Guards | 
Drag & Drop API | 
Canvas API | 
Change Detection optimizacije | 
SCSS modularizacija | 
Responsive dizajn | 
Theme switching sistem




Autor: Dženan (Dzenooo)
GitHub: github.com/Dzenooo/Web_Development_Project2






