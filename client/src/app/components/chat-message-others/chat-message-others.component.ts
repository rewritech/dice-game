import { Component, Input, OnInit } from '@angular/core'
import { Message } from '../../types'

@Component({
  selector: 'app-chat-message-others',
  templateUrl: './chat-message-others.component.html',
  styleUrls: ['./chat-message-others.component.scss'],
})
export class ChatMessageOthersComponent implements OnInit {
  @Input() message: Message

  constructor() {}

  ngOnInit(): void {}

  // YY/MM:DD hh:mm:ss
  formatDate(sendedAt: string): string {
    const date = new Date(sendedAt)
    return `${String(date.getFullYear()).slice(2, 4)}/${String(
      date.getMonth() + 1
    ).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')} ${String(
      date.getHours()
    ).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(
      date.getSeconds()
    ).padStart(2, '0')}`
  }
}
