import { Component, OnInit } from '@angular/core'
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-how-to-play-modal',
  templateUrl: './how-to-play-modal.component.html',
  styleUrls: ['./how-to-play-modal.component.scss'],
})
export class HowToPlayModalComponent implements OnInit {
  constructor(private config: NgbModalConfig, private modalService: NgbModal) {
    // this.config.backdrop = 'static'
    // this.config.keyboard = false
  }

  ngOnInit(): void {}

  open(content: any): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
  }
}
