import { Component, OnInit } from '@angular/core'
import { RoomService } from '../../services/room.service'
import { I18nService } from '../../services/i18n.service'
import { SocketConnectService } from '../../services/socket-connect.service'
import { PlayerService } from '../../services/player.service'
import { Room } from '../../types'

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss'],
})
export class RoomsComponent implements OnInit {
  rooms: Room[]

  constructor(
    private roomService: RoomService,
    public i18n: I18nService,
    private socket: SocketConnectService,
    private playerService: PlayerService
  ) {
    this.playerService.checkPlayer()
  }

  ngOnInit(): void {
    // websocket 연결
    this.socket.connect()
    this.socket.on<Room[]>(`refresh-rooms`, (rooms: Room[]) => {
      this.rooms = rooms
    })

    this.roomService.getRooms().subscribe((res) => {
      this.rooms = res
    })
  }
}
