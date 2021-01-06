import { Injectable } from '@angular/core'
import { i18n } from '../i18n'
import { Locale } from '../types'

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  private locale: Locale

  constructor() {
    this.locale = 'ko'
  }

  changeLocale(locale: Locale): void {
    this.locale = locale
  }

  getLocale(): Locale {
    return this.locale
  }

  get(key: string): string {
    return i18n[this.locale][key]
  }
}
