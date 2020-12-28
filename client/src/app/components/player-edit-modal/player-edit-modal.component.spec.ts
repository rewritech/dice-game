import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PlayerEditModalComponent } from './player-edit-modal.component'

describe('PlayerEditModalComponent', () => {
  let component: PlayerEditModalComponent
  let fixture: ComponentFixture<PlayerEditModalComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlayerEditModalComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerEditModalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
