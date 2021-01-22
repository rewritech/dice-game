import { Component, OnInit } from '@angular/core'
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap'
import { I18nService } from '../../services/i18n.service'

@Component({
  selector: 'app-how-to-play-modal',
  templateUrl: './how-to-play-modal.component.html',
  styleUrls: ['./how-to-play-modal.component.scss'],
})
export class HowToPlayModalComponent implements OnInit {
  constructor(
    private config: NgbModalConfig,
    private modalService: NgbModal,
    public i18n: I18nService
  ) {
    // this.config.backdrop = 'static'
    // this.config.keyboard = false
  }

  ngOnInit(): void {
    // onInit
  }

  open(content: HTMLElement): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
  }
}
