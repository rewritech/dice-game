import { Component, Input, OnInit } from '@angular/core'
import { Message } from '../../types'

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss'],
})
export class ChatMessageComponent implements OnInit {
  @Input() message: Message
  @Input() playerId: string

  kindOfMessage: 'OTHERS' | 'SELF' | 'SYSTEM'
  textBlockClass: string
  smallClass: string

  constructor() {}

  ngOnInit(): void {
    console.log('this.message.systemMsgStatus:'+this.message.systemMsgStatus)
    if (this.message._playerId === null &&
      this.message.systemMsgStatus === 'success') {
      this.kindOfMessage = 'SYSTEM'
      this.smallClass = 'ml-2 d-flex'
      this.textBlockClass = 'text-white bg-success w-100'
    } else if (this.message._playerId === null &&
      this.message.systemMsgStatus === 'danger') {
      this.kindOfMessage = 'SYSTEM'
      this.smallClass = 'ml-2 d-flex'
      this.textBlockClass = 'text-white bg-danger w-100'
    } else if (this.message._playerId === this.playerId) {
      this.kindOfMessage = 'SELF'
      this.smallClass = 'mr-2 d-flex justify-content-end'
      this.textBlockClass = 'text-white ml-auto w-75 bg-primary'
    } else {
      this.kindOfMessage = 'OTHERS'
      this.smallClass = 'ml-2 d-flex'
      this.textBlockClass = 'text-dark mr-auto w-75 bg-light'
    }
  }

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
