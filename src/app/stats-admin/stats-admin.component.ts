import { Component } from '@angular/core';
import Chart, { Legend, plugins } from 'chart.js/auto';

@Component({
  selector: 'app-stats-admin',
  templateUrl: './stats-admin.component.html',
  styleUrls: ['./stats-admin.component.css']
})
export class StatsAdminComponent {
  public chart: any;

  createChart(){

   
    var xValues = ["Libre", "Reservado"];
    var yValues = [55, 49];

    var barColors = [
      "#12BB2F",
      "#F41212",
      
    ];
    
    this.chart = new Chart("pie", {
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

    this.chart = new Chart("Dia", {
      type: 'bar', //this denotes tha type of chart
      

      data: {// values on X-Axis
        labels: ['20/03/2023', '21/03/2023', '22/03/2023','23/03/2023',
								 '24/03/2023', '25/03/2023', '26/03/2023'], 
	       datasets: [
          {
            label: "Ingresos",
            data: ['2982', '556', '2021','2087',
            '2966', '2229', '2254'],
            backgroundColor: 'blue'
          }
        ]
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
