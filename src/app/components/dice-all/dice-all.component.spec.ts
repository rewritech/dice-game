import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiceAllComponent } from './dice-all.component';

describe('DiceAllComponent', () => {
  let component: DiceAllComponent;
  let fixture: ComponentFixture<DiceAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiceAllComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiceAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
