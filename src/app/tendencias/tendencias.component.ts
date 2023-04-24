import { Component } from '@angular/core';
import Chart, { Legend, plugins } from 'chart.js/auto';

@Component({
  selector: 'app-tendencias',
  templateUrl: './tendencias.component.html',
  styleUrls: ['./tendencias.component.css']
})
export class TendenciasComponent {

  public chart: any;

  createChart(){

   
    this.chart = new Chart("MyChart", {
      type: 'line', //this denotes tha type of chart
      

      data: {// values on X-Axis
        labels: ['6:00 AM', '7:00 AM', '8:00 AM','9:00 AM',
								 '10:00 AM', '11:00 AM', '12:00 PM','1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM'], 
	       datasets: [
          {
            label: "Ingresos",
            data: ['2982', '556', '2021','2087',
            '2966', '2229', '3524','2246', '2995', '1052', '2658', '2098', '2302', '2676', '2525', '1503', '254'],
            backgroundColor: 'blue'
          }
        ]
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
