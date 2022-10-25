
import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { dateTableModificationI } from 'src/app/Models/ModelsPAA/modificatioRequest/ModificationRequest.interface';
import { addRequirementEdit, dataTableDataRequerimentI, filterDataRequerimentI } from 'src/app/Models/ModelsPAA/Requeriment/Requeriment.interface';
import { RequerimentService } from 'src/app/Services/ServicesPAA/Requeriment/requeriment.service';


export interface Transaction {
  numero: number;
  descripcion: string;
}

const ELEMENT_DATA: Transaction[] = [
  { numero: 100, descripcion: 'Prestar Servicios de transporte' },
  { numero: 200, descripcion: 'Prestar Servicios de transporte' },
  { numero: 300, descripcion: 'Prestar Servicios de transporte' },
]
@Component({
  selector: 'app-add-requeriments',
  templateUrl: './add-requeriments.component.html',
  styleUrls: ['./add-requeriments.component.scss']
})

export class AddrequirementsComponent implements OnInit {

  constructor(
    public serviceRequeriment: RequerimentService,
    public dialogRef: MatDialogRef<AddrequirementsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private spinner: NgxSpinnerService,) { dialogRef.disableClose = true; }
    
  pageSizeOptions: number[] = [3, 6, 12];
  paginationForm = new FormGroup({
    page: new FormControl(),
    take: new FormControl()
  });
  filterForm = new FormGroup({
    NumeroRequerimiento: new FormControl(),
    Descripcion: new FormControl('')
  })
  filterDataRequertiments = {} as filterDataRequerimentI;
  dataProjectID: string = '';
  viewFilter: boolean = true;
  viewDataRequeriment: any;
  displayedColumns: string[] = ['select', 'numero', 'descripcion'];
  numberPagination: any;
  numberPages: number = 0;
  numberPage: number = 0;
  numberTake: number = 0;
  dataSource!: MatTableDataSource<dataTableDataRequerimentI>;
  selection = new SelectionModel<dataTableDataRequerimentI>(true, []);

  //Elementos guardados
  requerimentsAdd: dataTableDataRequerimentI[] = [];

  ngOnInit(): void {
    this.dataProjectID = this.data;
    this.filterDataRequertiments.page = "1";
    this.filterDataRequertiments.take = 6;
    this.getDataRequeriment(+this.dataProjectID, this.filterDataRequertiments);
  }

  getDataRequeriment(projectId: number, filterDataRequertiments: filterDataRequerimentI) {
    this.filterDataRequertiments.NumeroRequerimiento = this.filterForm.get('NumeroRequerimiento')?.value || '';
    this.filterDataRequertiments.Descripcion = this.filterForm.get('Descripcion')?.value || '';
    // this.spinner.show();
    this.serviceRequeriment.getDataRequeriment(projectId, filterDataRequertiments).subscribe((data) => {
      this.viewDataRequeriment = data;
      this.numberPages = this.viewDataRequeriment.data.pages;
      this.numberPage = this.viewDataRequeriment.data.page;
      this.numberTake = filterDataRequertiments.take;
      this.paginationForm.setValue({
        take: filterDataRequertiments.take,
        page: filterDataRequertiments.page
      });
      this.dataSource = new MatTableDataSource(this.viewDataRequeriment.data.items);
      // console.log(data.data)
      // this.spinner.hide();
    }, error => {
      // this.spinner.hide();
    });
  }
  getPagination() {
    //console.log(this.paginationForm.value);
    this.filterDataRequertiments.page = this.paginationForm.get('page')?.value;
    this.filterDataRequertiments.take = this.paginationForm.get('take')?.value;
    this.getDataRequeriment(+this.dataProjectID, this.filterDataRequertiments);

  }

  openFilter() {
    this.viewFilter = false
  }
  closeFilter() {
    this.viewFilter = true
  }

  getFilter() {
    //console.log(this.filterForm.value)
    this.filterDataRequertiments.NumeroRequerimiento = this.filterForm.value.NumeroRequerimiento || '';
    this.filterDataRequertiments.Descripcion = this.filterForm.get('Descripcion')?.value || '';

    this.getDataRequeriment(+this.dataProjectID, this.filterDataRequertiments);

    this.closeFilter();
  }

  
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;

    this.requerimentsAdd = this.selection.selected;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.dataSource.data.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: dataTableDataRequerimentI): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row}`;
  }


  nextPage() {
    if (this.numberPage < this.numberPages) {
      this.numberPage++;
      this.filterDataRequertiments.page = this.numberPage.toString();
      this.getDataRequeriment(+this.dataProjectID, this.filterDataRequertiments);
    }
  }

  prevPage() {
    if (this.numberPage > 1) {
      this.numberPage--;
      this.filterDataRequertiments.page = this.numberPage.toString();
      this.getDataRequeriment(+this.dataProjectID, this.filterDataRequertiments);
    }
  }

  firstPage() {
    this.numberPage = 1;
    this.filterDataRequertiments.page = this.numberPage.toString();
    this.getDataRequeriment(+this.dataProjectID, this.filterDataRequertiments);
  }
  latestPage() {
    this.numberPage = this.numberPages;
    this.filterDataRequertiments.page = this.numberPage.toString();
    this.getDataRequeriment(+this.dataProjectID, this.filterDataRequertiments);
  }

  closeDialog(){
    this.dialogRef.close(this.requerimentsAdd);
  }

}