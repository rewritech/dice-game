import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DiceMapService } from '../../services/dice-map.service';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'app-new-room',
  templateUrl: './new-room.component.html',
  styleUrls: ['./new-room.component.scss'],
})
export class NewRoomComponent implements OnInit {
  checkoutForm;

  constructor(
    private formBuilder: FormBuilder,
    private roomService: RoomService,
    private diceMapService: DiceMapService
  ) {
    this.checkoutForm = this.formBuilder.group({
      title: '',
      memberLimit: '',
    });
  }

  ngOnInit(): void {}
}
