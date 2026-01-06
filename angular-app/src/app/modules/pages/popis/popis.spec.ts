import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Popis } from './popis';

describe('Popis', () => {
  let component: Popis;
  let fixture: ComponentFixture<Popis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Popis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Popis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
