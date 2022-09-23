import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertData } from 'src/app/Views/PAA/task-tray/task-tray.component';

@Component({
  selector: 'app-alerts-pop-up',
  templateUrl: './alerts-pop-up.component.html',
  styleUrls: ['./alerts-pop-up.component.scss']
})
export class AlertsPopUpComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AlertsPopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AlertData) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
