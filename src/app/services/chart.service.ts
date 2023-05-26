import { Injectable } from '@angular/core';
import {
  Chart,
  ChartConfiguration,
  ChartType,
  CategoryScale,
  BarController,
  LineController,
  BarElement,
  LineElement,
  PointElement,
  PieController,
  ArcElement,
  Tooltip,
  LinearScale
} from 'chart.js';

Chart.register(
  BarController,
  LineController,
  BarElement,
  LineElement,
  PointElement,
  PieController,
  CategoryScale,
  ArcElement,
  Tooltip,
  LinearScale,
);

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  private charts: Chart[] = [];

  constructor() {}

  createChart(
    chartId: string,
    labels: string[],
    data: number[],
    chartType: ChartType
  ): Chart {
    const chartConfig: ChartConfiguration = {
      type: chartType,
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Ingresos',
            data: data,
            backgroundColor: chartType === 'bar' ? 'blue' : undefined,
            borderColor: chartType === 'line' ? 'blue' : undefined,
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
        scales: {
          x: {
            title: {
              display: true,
              text: chartType === 'bar' ? 'Dia' : 'Hora',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Ingresos',
            },
          },
        },
      },
    };

    const chart = new Chart(chartId, chartConfig);
    this.charts.push(chart);
    return chart;
  }

  createPieChart(chartId: string, labels: string[], data: number[]): Chart {
    const chartConfig: ChartConfiguration = {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: ['#003366', '#5B6C70'],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
      },
    };

    const chart = new Chart(chartId, chartConfig);
    this.charts.push(chart);
    return chart;
  }

  destroyChart(chart: Chart | undefined): void {
    if (!chart) {
      return;
    }

    const chartIndex = this.charts.indexOf(chart);
    if (chartIndex > -1) {
      this.charts[chartIndex].destroy();
      this.charts.splice(chartIndex, 1);
    }
  }
}
