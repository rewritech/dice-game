import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { PlayerService } from '../../services/player.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  private playerId = localStorage.getItem('pId')

  constructor(private playerService: PlayerService, private router: Router) {}

  ngOnInit(): void {}

  logout(): void {
    this.playerService.deletePlayer(this.playerId).subscribe(() => {
      localStorage.removeItem('pId')
      this.router.navigate(['/login'])
    })
  }
}
