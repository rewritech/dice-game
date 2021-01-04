import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ViewDiceComponent } from './view-dice.component'

describe('ViewDiceComponent', () => {
  let component: ViewDiceComponent
  let fixture: ComponentFixture<ViewDiceComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewDiceComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDiceComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
