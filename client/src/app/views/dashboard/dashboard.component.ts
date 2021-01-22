import { Component, OnInit } from '@angular/core'
import { I18nService } from '../../services/i18n.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(public i18n: I18nService) {}

  ngOnInit(): void {
    // onInit
  }
}
