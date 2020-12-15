import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiceOneComponent } from './dice-one.component';

describe('DiceOneComponent', () => {
  let component: DiceOneComponent;
  let fixture: ComponentFixture<DiceOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DiceOneComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiceOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
