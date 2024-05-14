import { AfterViewInit, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { Chart, registerables, ChartConfiguration, Tooltip } from 'chart.js';
import { ExpenseService } from '../../../../Services/ExpenseService/expense.service';

@Component({
  selector: 'app-piechart',
  standalone: true,
  imports: [],
  templateUrl: './piechart.component.html',
  styleUrl: './piechart.component.css'
})
export class PiechartComponent implements AfterViewInit{
  @ViewChild('chart') chartRef!: ElementRef<HTMLCanvasElement>;
  private _expenseService = inject(ExpenseService);
  labels:any;
  data:any;
  expenseData:any = {}
   chart: Chart | undefined

  constructor() {
    Chart.register(...registerables);
  }

  ngAfterViewInit(): void {
      this.initChart();
  }
  
  initChart() {
    this._expenseService.getTotalExpenseByCategory().then((result) => {
      this.labels = Object.keys(result.categoryPercentages);
  
      // Extracting the percentage values and converting them from strings to numbers
      const data = Object.values(result.categoryPercentages).map(value => parseFloat(value as string));
  
      this.chart = new Chart(this.chartRef.nativeElement, {
        type: 'pie',
        data: {
          labels: this.labels,  // Make sure this is not wrapped in another array
          datasets: [{
            data: data,  // Set the parsed data here
            backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
            borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: function(tooltipItem:any) {
                  let label = tooltipItem.chart.data.labels[tooltipItem.dataIndex];
                  let value = tooltipItem.chart.data.datasets[tooltipItem.datasetIndex].data[tooltipItem.dataIndex];
                  return `${label}: ${value}%`; // Ensuring the tooltip shows the value with a '%' sign
                }
              }
            }
          },
          animation: {
            animateScale: true,
            animateRotate: true
          }
        }
      } as any);  // Using 'as any' to bypass type checking, but consider refining types
    });
  }
  
  
  

}
