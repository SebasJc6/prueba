import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { AlertData } from 'src/app/Views/PAA/task-tray/task-tray.component';

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