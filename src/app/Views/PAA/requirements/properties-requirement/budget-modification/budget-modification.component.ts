import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-budget-modification',
  templateUrl: './budget-modification.component.html',
  styleUrls: ['./budget-modification.component.scss']
})
export class BudgetModificationComponent implements OnInit {
  isDisabled = true;
  constructor() { }

  ngOnInit(): void {
  }

  isDisableds(event:any) {
    console.log(event);
    if (event.checked == true) {
      this.isDisabled = false;
    } else {
      this.isDisabled = true;
    }
  }
    // this.isDisabled= false? true: false;
  
}
