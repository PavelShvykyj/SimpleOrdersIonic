import { Observable } from 'rxjs';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { OnecConnectorService } from 'src/app/onec/onec.connector.service';
import { map, filter } from 'rxjs/operators';

export interface invoiceDetail {
  header : {
    hallname : string,
    tablename : string,
    waitername : string,
    discountname : string,
    id: string,
    closedat : Date,
    cash : number,
    terminal : number,
  },

  content : Array<{
    goodname : string,
    quantity : number,
    price    : number, 
    summ     : number, 
    discount : number 
  }>
}

@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.page.html',
  styleUrls: ['./invoice-detail.page.scss'],
})
export class InvoiceDetailPage implements OnInit {

  private invoiceid : string = "";
  private invoiceDitail$ : Observable<invoiceDetail>


  constructor(private route: ActivatedRoute,
    private webdb : OnecConnectorService
    ) {
    

   }

  ngOnInit() {
    this.invoiceid = this.route.snapshot.paramMap.get('id');
    this.Refresh()

  }

  Refresh() {
    this.invoiceDitail$ = this.webdb.GetInvoiceData(this.invoiceid).pipe(
      filter(res => !!res),
      map(res=> {
      if (res) {
        return JSON.parse(res);
      }     
    }));
  }


}
