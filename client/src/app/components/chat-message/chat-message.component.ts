import { Component, Input, OnInit } from '@angular/core'
import { I18nService } from '../../services/i18n.service'
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

  constructor(public i18n: I18nService) {}

  ngOnInit(): void {
    const { _playerId, systemMsgStatus } = this.message

    if (_playerId === null) {
      this.kindOfMessage = 'SYSTEM'
      this.smallClass = 'ml-2 d-flex'
      this.textBlockClass = `text-white bg-${systemMsgStatus} w-100`
    } else if (_playerId === this.playerId) {
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

  convertI18nMessage(msg: string): string {
    return msg
      .split('&')
      .map((m) => this.i18n.get(m) || m)
      .join('')
  }
}
