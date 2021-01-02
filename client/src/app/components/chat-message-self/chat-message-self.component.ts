import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-chat-message-self',
  templateUrl: './chat-message-self.component.html',
  styleUrls: ['./chat-message-self.component.scss'],
})
export class ChatMessageSelfComponent implements OnInit {
  @Input() message: string

  constructor() {}

  ngOnInit(): void {}
}
