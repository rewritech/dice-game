import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Room } from '../../types'
import { DiceMapService } from '../../services/dice-map.service'
import { RoomService } from '../../services/room.service'

@Component({
  selector: 'app-new-room',
  templateUrl: './new-room.component.html',
  styleUrls: ['./new-room.component.scss'],
})
export class NewRoomComponent implements OnInit {
  room: Room

  constructor(
    private router: Router,
    private roomService: RoomService,
    private diceMapService: DiceMapService
  ) {}

  ngOnInit(): void {
    this.diceMapService.createNewMap()
    this.room = {
      title: '',
      players: [],
      playerLimit: 2,
      map: this.diceMapService.getDiceMap(),
    }
  }

  onSubmit(form: Room): void {
    this.room.title = form.title
    this.room.playerLimit = form.playerLimit
    this.roomService.createRoom(this.room).subscribe((res) => {
      this.router.navigate([`/rooms/${res._id}`])
    })
  }
}
