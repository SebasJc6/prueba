import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

export interface AlertData {
  type: string;
  title: string;
  message: string;
  message2?: string;
  value?: string;
}

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {

  constructor(private snackBar: MatSnackBar, 
    @Inject(MAT_SNACK_BAR_DATA) public data: AlertData) { }


  ngOnInit(): void {
    //  this.alertType();
  }

   dismissSnackbar(): void {
      this.snackBar.dismiss();
   }

  //  alertType() {
  //    this.message = this.data.message;
  //  }

  // onNoClick(): void {
  //   this.dialogRef.close();
  // }

}