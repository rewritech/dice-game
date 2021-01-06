import { Component, OnInit } from '@angular/core'
import { RoomService } from '../../services/room.service'
import { I18nService } from '../../services/i18n.service'
import { Room } from '../../types'

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss'],
})
export class RoomsComponent implements OnInit {
  rooms: Room[]
  i18n: I18nService

  constructor(
    private roomService: RoomService,
    private i18nService: I18nService
  ) {
    this.i18n = i18nService
  }

  ngOnInit(): void {
    this.roomService.getRooms().subscribe((res) => {
      this.rooms = res
    })
  }
}
