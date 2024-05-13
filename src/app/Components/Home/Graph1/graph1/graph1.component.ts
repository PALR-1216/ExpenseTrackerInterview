import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { ExpenseService } from '../../../../Services/ExpenseService/expense.service';
import { AuthService } from '../../../../Services/AuthService/auth.service';
import { Chart, ChartConfiguration, ChartData, registerables } from 'chart.js';
import { PiechartComponent } from "../../PieChart/piechart/piechart.component";

interface MonthlyExpenses {
  [key: string]: number; 
}


@Component({
    selector: 'app-graph1',
    standalone: true,
    templateUrl: "./graph1.component.html",
    styleUrl: './graph1.component.css',
    imports: [CommonModule, PiechartComponent]
})
export class Graph1Component implements OnInit, AfterViewInit{

  private _expenseService = inject(ExpenseService);
  private _authService = inject(AuthService);
  totalExpenses:any[] = [];
  @ViewChild('chart') chartRef!: ElementRef<HTMLCanvasElement>;
  private chart!: Chart;

  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.getAllExpenses();   
    // this.getExpenseByMonth();
    
  }

  ngAfterViewInit(): void {
      this.initChart();
  }

  getAllExpenses() {
    this._expenseService.getTotalExpensesForUser().then((result) => {
      this.totalExpenses.push(result);
    })
  }


  // getExpenseByMonth() {
  //   this._expenseService.getTotalExpenseByMonth().then((expensesByMonth) =>{
  //     console.log(expensesByMonth);
  //   })
  // }


  private initChart(): void {
    this._expenseService.getTotalExpenseByMonth().then((data:MonthlyExpenses) => {
      const labels = Object.keys(data);
      const values: number[] = Object.values(data).map(value => + value); // Ensure values are typed as numbers

      const chartData: ChartData<'bar', number[], string> = {
        labels: labels,
        datasets: [{
          label: 'Monthly Expenses',
          data: values,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      };

      const config: ChartConfiguration<'bar', number[], string> = {
        type: 'bar',
        data: chartData,
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      };

      this.chart = new Chart(this.chartRef.nativeElement.getContext('2d')!, config);
    });
  }
}


