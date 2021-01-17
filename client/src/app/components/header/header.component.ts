import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { PlayerService } from '../../services/player.service'
import { I18nService } from '../../services/i18n.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  private playerId = sessionStorage.getItem('pId')
  i18n: I18nService

  constructor(
    private playerService: PlayerService,
    private router: Router,
    private i18nService: I18nService
  ) {
    this.i18n = i18nService
  }

  ngOnInit(): void {
    // onInit
  }

  logout(): void {
    this.playerService.deletePlayer(this.playerId).subscribe(() => {
      sessionStorage.removeItem('pId')
      this.router.navigate(['/login'])
    })
  }
}
