import { Component, OnInit } from '@angular/core';
import { RoomService } from '../../services/room.service';
import { Room } from '../../types';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss'],
})
export class RoomsComponent implements OnInit {
  rooms: Room[];

  pid: string;

  constructor(private roomService: RoomService) {}

  ngOnInit(): void {
    this.pid = sessionStorage.getItem('pid');
    this.roomService.getRooms().subscribe((res) => {
      this.rooms = res;
    });
  }
}
