import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'app-dice-all',
  templateUrl: './dice-all.component.html',
  styleUrls: ['./dice-all.component.scss']
})
export class DiceAllComponent implements OnInit {
  @Input() dice: number
  @Input() isDisabled: boolean

  disabled: string;

  constructor() { }

  ngOnInit(): void {
    console.log('this.isDisable:'+this.isDisabled )
    this.disabled = this.isDisabled ? 'disabled' : ''
    console.log('this.disable:'+this.disabled )

  }
}
