import { Injectable } from '@angular/core'
import { i18n } from '../i18n'
import { Locale } from '../types'

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  private locale: Locale

  constructor() {
    const cookieLocale = sessionStorage.getItem('dice-map-locale') || 'ko'
    this.changeLocale(cookieLocale as Locale)
  }

  changeLocale(locale: Locale): void {
    this.locale = locale
    sessionStorage.setItem('dice-map-locale', this.locale)
  }

  getLocale(): Locale {
    return this.locale
  }

  get(key: string): string {
    return i18n[this.locale][key]
  }
}
