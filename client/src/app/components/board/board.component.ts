import { Component, Input, OnInit } from '@angular/core'
import { AnimationOption, Map } from '../../types'

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  @Input() pieces: Map[][]
  @Input() callBackOnClick: (x: number, y: number) => void
  @Input() aniConfig: AnimationOption

  // constructor() {}

  ngOnInit(): void {
    //
  }
}
