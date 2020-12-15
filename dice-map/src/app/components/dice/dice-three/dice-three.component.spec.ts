import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiceThreeComponent } from './dice-three.component';

describe('DiceThreeComponent', () => {
  let component: DiceThreeComponent;
  let fixture: ComponentFixture<DiceThreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DiceThreeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiceThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
