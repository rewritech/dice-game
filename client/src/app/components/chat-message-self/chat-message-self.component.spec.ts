import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ChatMessageSelfComponent } from './chat-message-self.component'

describe('ChatMessageSelfComponent', () => {
  let component: ChatMessageSelfComponent
  let fixture: ComponentFixture<ChatMessageSelfComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatMessageSelfComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatMessageSelfComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
