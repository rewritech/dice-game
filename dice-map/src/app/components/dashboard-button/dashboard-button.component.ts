import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-button',
  templateUrl: './dashboard-button.component.html',
  styleUrls: ['./dashboard-button.component.scss']
})
export class DashboardButtonComponent implements OnInit {
  @Input() buttonTitle: string;

  @Input() linkPath: string;

  constructor() { }

  ngOnInit(): void {
  }

}
