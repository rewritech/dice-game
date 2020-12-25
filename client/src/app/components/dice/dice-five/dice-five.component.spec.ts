import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DiceFiveComponent } from './dice-five.component'

describe('DiceFiveComponent', () => {
  let component: DiceFiveComponent
  let fixture: ComponentFixture<DiceFiveComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DiceFiveComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(DiceFiveComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
