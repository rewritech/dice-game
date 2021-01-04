import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'app-view-dice',
  templateUrl: './view-dice.component.html',
  styleUrls: ['./view-dice.component.scss'],
})
export class ViewDiceComponent implements OnInit {
  @Input() num: number
  @Input() disabledClass: string

  colors = [
    'btn-success',
    'btn-warning',
    'btn-secondary',
    'btn-danger',
    'btn-info',
    'btn-primary',
  ]

  constructor() {}

  ngOnInit(): void {}
}
