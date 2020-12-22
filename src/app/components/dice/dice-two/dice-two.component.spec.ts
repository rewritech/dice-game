import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DiceTwoComponent } from './dice-two.component'

describe('DiceTwoComponent', () => {
  let component: DiceTwoComponent
  let fixture: ComponentFixture<DiceTwoComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DiceTwoComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(DiceTwoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
