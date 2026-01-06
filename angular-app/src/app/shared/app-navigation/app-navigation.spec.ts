import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppNavigation } from './app-navigation';

describe('AppNavigation', () => {
  let component: AppNavigation;
  let fixture: ComponentFixture<AppNavigation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppNavigation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppNavigation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
