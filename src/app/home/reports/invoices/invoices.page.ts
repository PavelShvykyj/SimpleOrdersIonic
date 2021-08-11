import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OnecConnectorService } from 'src/app/onec/onec.connector.service';

export interface invoiceheader {
  hallname : string,
  tablename : string,
  id: string,
  closedat : Date,
  cash : number,
  terminal : number,
  sorttotal : {
    cash : number,
    terminal : number,
  }
}


@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.page.html',
  styleUrls: ['./invoices.page.scss'],
})
export class InvoicesPage implements OnInit {

  private isLoading : boolean = false
  private invoices$ : Observable<Array<invoiceheader>>

  constructor(private webdb : OnecConnectorService) { }

  ngOnInit() {
    setTimeout(this.Refresh.bind(this));
  }

  Refresh() {
    
    this.invoices$ = this.webdb.GetUserInvoices().pipe(map(res => JSON.parse(res)));
  }

}
