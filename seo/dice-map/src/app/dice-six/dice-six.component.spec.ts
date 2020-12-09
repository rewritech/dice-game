import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiceSixComponent } from './dice-six.component';

describe('DiceSixComponent', () => {
  let component: DiceSixComponent;
  let fixture: ComponentFixture<DiceSixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DiceSixComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiceSixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
