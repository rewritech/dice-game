import { Component, OnInit } from '@angular/core'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'
import { I18nService } from '../../services/i18n.service'
import { Locale } from '../../types'

@Component({
  selector: 'app-select-i18n',
  templateUrl: './select-i18n.component.html',
  styleUrls: ['./select-i18n.component.scss'],
})
export class SelectI18nComponent implements OnInit {
  locales = [
    { key: 'ko', name: '한국어' },
    { key: 'en', name: 'ENGLISH' },
    { key: 'jp', name: '日本語' },
  ]
  default: Locale
  globe = faGlobe

  constructor(private i18nService: I18nService) {
    this.default = this.i18nService.getLocale()
  }

  ngOnInit(): void {}

  onChange($event): void {
    this.default = $event.target.value
    this.i18nService.changeLocale(this.default)
  }
}
