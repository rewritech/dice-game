import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PlayerCreateModalComponent } from './player-create-modal.component'

describe('PlayerCreateModalComponent', () => {
  let component: PlayerCreateModalComponent
  let fixture: ComponentFixture<PlayerCreateModalComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlayerCreateModalComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerCreateModalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
