import { Component, OnInit } from '@angular/core'
import { I18nService } from '../../services/i18n.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  i18n: I18nService

  constructor(private i18nService: I18nService) {
    this.i18n = i18nService
  }

  ngOnInit(): void {}
}
