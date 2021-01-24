import { Component, OnInit } from '@angular/core'
import { faCaretRight, faCaretLeft } from '@fortawesome/free-solid-svg-icons'
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
  private totalPage = 0
  private currentPage = 0

  PAGE_LIMIT = 5
  faRight = faCaretRight
  faLeft = faCaretLeft
  rooms: Room[] = []
  filteredRooms: Room[] = []
  paginatedRooms: Room[] = []
  firstPage = true
  lastPage = false
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
      this.rooms = res
      this.filter()
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

  movePage(num: number): void {
    const nextPage = this.currentPage + Number(num)
    if (nextPage >= 0 && nextPage <= this.totalPage - 1) {
      this.currentPage += Number(num)
      this.setPage()
    }
  }

  private filter(): void {
    const reg = new RegExp(this.keyword)
    this.filteredRooms = this.rooms.filter((r) => {
      const limitCheck =
        this.limit === '0' ? true : r.playerLimit === Number(this.limit)
      return limitCheck && reg.test(r.title)
    })
    this.paging()
  }

  private paging(): void {
    this.totalPage = Math.ceil(this.filteredRooms.length / this.PAGE_LIMIT)
    this.currentPage = 0
    this.setPage()
  }

  private setPage(): void {
    this.firstPage = this.currentPage === 0
    this.lastPage = this.currentPage === this.totalPage - 1
    const start = this.currentPage * this.PAGE_LIMIT
    this.paginatedRooms = this.filteredRooms.slice(
      start,
      start + this.PAGE_LIMIT
    )
  }
}
