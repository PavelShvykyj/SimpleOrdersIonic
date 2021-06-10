import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartType } from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';
import { map, take } from 'rxjs/operators';
import { OnecConnectorService } from 'src/app/onec/onec.connector.service';

export interface ChartParametrs {
  ChartLabels: Label[],
  ChartData: SingleDataSet,
  Legend : boolean
  ChartType: ChartType 
}



@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {

  @ViewChild('WaitersSaleCanvas') private WaitersSaleCanvas: ElementRef;

  WaitersSaleChart: any;

  sale: ChartParametrs = {
    ChartLabels: [],
    ChartData: [],
    Legend : false,
    ChartType: 'radar'  
  };

  cancel : ChartParametrs = {
    ChartLabels: [],
    ChartData: [],
    Legend : false,
    ChartType: 'radar'  
  };

  ownSales;   


  public polarAreaChartLabels: Label[] = ['Download Sales', 'In-Store Sales', 'Mail Sales', 'Telesales', 'Corporate Sales'];
  public polarAreaChartData: SingleDataSet = [300, 1500, 1000, 400, 1200];
  public polarAreaLegend = false;
  public polarAreaChartType: ChartType = 'radar';

  constructor(private dataservice : OnecConnectorService) { }

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    this.WaitersSaleMethod();
  
  }

  ionViewWillEnter() {
    
  }

  WaitersSaleMethod() {
    this.dataservice.GetReportsData().pipe(
      take(1),
      map(
      data => {
        this.sale = data.sale;
        this.cancel = data.cancel;
        this.ownSales = data.ownSales;
      }
    )).subscribe();
  }

}
