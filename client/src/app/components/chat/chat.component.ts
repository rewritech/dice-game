import { Component, ElementRef, ViewChild, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { MessageService } from '../../services/message.service'
import { I18nService } from '../../services/i18n.service'
import { SocketConnectService } from '../../services/socket-connect.service'
import { Message } from '../../types'
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  planeIcon = faPaperPlane
  message: Message
  messages: Message[]
  newMsg = false

  private roomId = +this.route.snapshot.paramMap.get('id')
  playerId = sessionStorage.getItem('pId')

  @ViewChild('chat') private chatRef: ElementRef
  @ViewChild('chatSystem') private chatSystemRef: ElementRef

  constructor(
    private socket: SocketConnectService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    public i18n: I18nService
  ) {
    this.message = {
      _roomId: this.roomId,
      _playerId: this.playerId,
      systemMsgStatus: '',
      content: '',
    }
  }

  ngOnInit(): void {
    // messages 가져오기
    this.messageService.getMessages(this.roomId).subscribe((messages) => {
      this.messages = messages
      this.newMsg = true
    })
    // 소켓 연결
    this.socket.on(`chat-room-${this.roomId}`, (messages: Message[]) => {
      this.messages = messages
      this.newMsg = true
    })
  }

  ngAfterViewChecked(): void {
    if (this.newMsg) {
      this.newMsg = false
      this.scrollToBottom()
    }
  }

  onSubmit(): void {
    if (this.message.content.trim().length > 0) {
      this.messages.push({
        ...this.message,
        sendedAt: new Date().toISOString(),
      })
      this.socket.emit<Message>('send-message', this.message)
      this.message.content = ''
    }
  }

  private scrollToBottom(): void {
    this.chatRef.nativeElement.scrollTop = this.chatRef.nativeElement.scrollHeight
    this.chatSystemRef.nativeElement.scrollTop = this.chatSystemRef.nativeElement.scrollHeight
  }
}
