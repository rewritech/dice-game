import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { PlayerService } from '../../services/player.service';
import { Player, Room } from '../../types';

@Component({
  selector: 'app-player-create-modal',
  templateUrl: './player-create-modal.component.html',
  styleUrls: ['./player-create-modal.component.scss'],
})
export class PlayerCreateModalComponent implements OnInit {
  player: Player;

  @Input() room: Room;

  constructor(
    private config: NgbModalConfig,
    private modalService: NgbModal,
    private router: Router,
    private playerService: PlayerService
  ) {
    this.config.backdrop = 'static';
    this.config.keyboard = false;
  }

  ngOnInit(): void {
    this.player = {
      id: 0,
      roomId: this.room.id,
      name: '',
    };
  }

  open(content: any): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  onSubmit(form: Player): void {
    this.playerService.createPlayer(form).subscribe((res) => {
      this.router.navigate([`/rooms/${res.roomId}`], {
        queryParams: { pid: res.id },
      });
    });
  }
}
