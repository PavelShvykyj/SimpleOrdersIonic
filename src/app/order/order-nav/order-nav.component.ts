import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderPage } from '../order.page';

@Component({
  selector: 'app-order-nav',
  templateUrl: './order-nav.component.html',
  styleUrls: ['./order-nav.component.scss'],
})
export class OrderNavComponent implements OnInit {
  order = OrderPage
  //params : {[key:string] : string}


  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    
    // setTimeout(()=> {
    //   const qparams = this.route.snapshot.paramMap;
    //   const newparams : {[key:string] : string} = {};
    //   newparams.hallid = qparams.get('hallid');
    //   newparams.table = qparams.get('tableid');
    //   newparams.orderid = qparams.get('orderid');
    //   this.params = {...newparams};
    //   },5);
    
  }

}
