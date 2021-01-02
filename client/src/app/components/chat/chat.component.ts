import { Component, ElementRef, ViewChild, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { MessageService } from 'src/app/services/message.service'
import { SocketConnectService } from 'src/app/services/socket-connect.service'
import { Message } from 'src/app/types'
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  planeIcon = faPaperPlane
  message: Message
  messages: Message[]

  private roomId = +this.route.snapshot.paramMap.get('id')
  playerId = localStorage.getItem('pId')

  @ViewChild('scrollMe') private chatRef: ElementRef

  constructor(
    private socket: SocketConnectService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.message = {
      _roomId: this.roomId,
      _playerId: this.playerId,
      content: '',
      sendedAt: new Date(),
    }
  }

  ngOnInit(): void {
    // messages 가져오기
    this.messageService.getMessages(this.roomId).subscribe((messages) => {
      this.messages = messages
    })
    // 소켓 연결
    this.socket.on(`chat-room-${this.roomId}`, (messages: Message[]) => {
      this.messages = messages
    })
  }

  ngAfterViewChecked() {
    this.scrollToBottom()
  }

  onSubmit(): void {
    if (this.message.content.trim().length > 0) {
      this.messages.push({ ...this.message })
      this.socket.emit<Message>('send-message', this.message)
      this.message.content = ''
    }
  }

  private scrollToBottom(): void {
    try {
      this.chatRef.nativeElement.scrollTop = this.chatRef.nativeElement.scrollHeight
    } catch (err) {}
  }
}
