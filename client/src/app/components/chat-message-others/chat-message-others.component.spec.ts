import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ChatMessageOthersComponent } from './chat-message-others.component'

describe('ChatMessageOthersComponent', () => {
  let component: ChatMessageOthersComponent
  let fixture: ComponentFixture<ChatMessageOthersComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatMessageOthersComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatMessageOthersComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
