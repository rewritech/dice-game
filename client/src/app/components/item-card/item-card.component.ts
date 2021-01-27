import { Component, OnInit, Input } from '@angular/core'
import {
  faBomb,
  faHeart,
  faRandom,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss'],
})
export class ItemCardComponent implements OnInit {
  @Input() num: number
  @Input() disabledClass: string

  icon: IconDefinition
  colors = ['text-dark', 'text-danger', 'text-warning']

  ngOnInit(): void {
    // init
    switch (this.num) {
      case 7:
        this.icon = faBomb
        break
      case 8:
        this.icon = faHeart
        break
      case 9:
        this.icon = faRandom
        break
      default:
        break
    }
  }
}
