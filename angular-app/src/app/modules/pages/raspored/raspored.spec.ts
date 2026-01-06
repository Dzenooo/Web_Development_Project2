import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Raspored } from './raspored';

describe('Raspored', () => {
  let component: Raspored;
  let fixture: ComponentFixture<Raspored>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Raspored]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Raspored);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
