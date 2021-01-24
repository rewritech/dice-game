import { Component, OnInit, SimpleChanges } from '@angular/core'
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
  filteredRooms: Room[]
  rooms: Room[]
  keyword = ''
  limit = '0'

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
      this.filter()
    })

    this.roomService.getRooms().subscribe((res) => {
      this.filteredRooms = res
      this.rooms = res
    })
  }

  onSelectChange(value: string): void {
    this.limit = value
    this.filter()
  }

  onTextChange(value: string): void {
    this.keyword = value.trim()
    this.filter()
  }

  private filter(): void {
    const reg = new RegExp(this.keyword)
    this.filteredRooms = this.rooms.filter((r) => {
      const limitCheck =
        this.limit === '0' ? true : r.playerLimit === Number(this.limit)
      return limitCheck && reg.test(r.title)
    })
  }
}
