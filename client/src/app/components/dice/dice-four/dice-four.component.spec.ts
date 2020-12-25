import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DiceFourComponent } from './dice-four.component'

describe('DiceFourComponent', () => {
  let component: DiceFourComponent
  let fixture: ComponentFixture<DiceFourComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DiceFourComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(DiceFourComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
