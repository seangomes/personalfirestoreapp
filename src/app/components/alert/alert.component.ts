import { Component, OnInit } from '@angular/core';
import { AlertService } from "../../providers/alert/alert.service";
import { Alert, AlertType } from "../../models/alert";

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  alerts: Alert[] = [];

  constructor(private alertService: AlertService) { }

  ngOnInit() {
    this.alertService.getAlert().subscribe((alert: Alert) => {
      if (!alert) {
        // clear alerts when an empty alert is received
        this.alerts = [];
        return;
      }
      // add alert to array
      this.alerts = [];
      this.alerts.push(alert);
    });
  }

  removeAlert(alert: Alert) {
    //this.alerts = this.alerts.filter(x => x !== alert);
    this.alertService.clear();
    //console.log(this.alerts);
  }

  cssClass(alert: Alert) {
    if (!alert) {
      return;
    }
    //return css cass based on alert type
    switch (alert.type) {
      case AlertType.Success:
        return 'alert alert-success';
      case AlertType.Error:
        return 'alert alert-danger';
      case AlertType.Info:
        return 'alert alert-info';
      case AlertType.Warning:
        return 'alert alert-warning';
    }
  }

}
