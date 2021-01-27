import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'app-view-dice',
  templateUrl: './view-dice.component.html',
  styleUrls: ['./view-dice.component.scss'],
})
export class ViewDiceComponent implements OnInit {
  @Input() num: number
  @Input() disabledClass: string
  @Input() mini: boolean

  colors = [
    'btn-success',
    'btn-warning',
    'btn-secondary',
    'btn-danger',
    'btn-info',
    'btn-primary',
  ]

  dotClass = 'dot'
  diceSizeClass = 'dice-size'

  ngOnInit(): void {
    this.dotClass = this.mini ? 'mini-dot' : 'dot'
    this.diceSizeClass = this.mini ? 'mini-dice-size' : 'dice-size'
  }
}
