import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'app-dice',
  templateUrl: './dice.component.html',
  styleUrls: ['./dice.component.scss'],
})
export class DiceComponent implements OnInit {
  @Input() dice: number
  @Input() isDisabled: boolean

  disabled: string

  constructor() {}

  ngOnInit(): void {
    // console.log('this.isDisable:'+this.isDisabled )
    this.disabled = this.isDisabled ? 'disabled' : ''
    // console.log('this.disable:'+this.disabled )
  }
}
