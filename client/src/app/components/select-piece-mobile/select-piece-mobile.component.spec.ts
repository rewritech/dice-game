import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SelectPieceMobileComponent } from './select-piece-mobile.component'

describe('SelectPieceMobileComponent', () => {
  let component: SelectPieceMobileComponent
  let fixture: ComponentFixture<SelectPieceMobileComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectPieceMobileComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPieceMobileComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
