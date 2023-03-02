import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

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

  constructor(private snackBar: MatSnackBar, private router: Router,
    @Inject(MAT_SNACK_BAR_DATA) public data: AlertData) { }


  ngOnInit(): void {
    //  this.alertType();
  }

   dismissSnackbar( router?: string ): void {
    if (router) {
      this.router.navigate([`/WAPI/PAA/${router}`]);
    }
    
      this.snackBar.dismiss();
   }

  //  alertType() {
  //    this.message = this.data.message;
  //  }

  // onNoClick(): void {
  //   this.dialogRef.close();
  // }

}