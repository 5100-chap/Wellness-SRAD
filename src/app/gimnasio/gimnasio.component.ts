import { Component } from '@angular/core';

import Chart, { Legend, plugins } from 'chart.js/auto';
import 'chartjs-plugin-labels';


@Component({
  selector: 'app-gimnasio',
  templateUrl: './gimnasio.component.html',
  styleUrls: ['./gimnasio.component.css'],

})
export class GimnasioComponent {


  public chart: any;

  createChart(){

    var xValues = ["Libre", "Ocupado"];
    var yValues = [55, 49];

    var barColors = [
      "#12BB2F",
      "#F41212",
      
    ];
    
    this.chart = new Chart("MyChart", {
      type: 'pie', //this denotes tha type of chart
      

      data: {// values on X-Axis
        labels: xValues, 
	       datasets: [
          {
            data: yValues,
            backgroundColor: barColors,

            hoverOffset: 4
          }]
      },
      options: {
        aspectRatio:2.5,

          }
    });
  }

  ngOnInit(): void {
    this.createChart();
   
  }

}







