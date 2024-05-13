import { AfterViewInit, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { Chart, registerables } from 'chart.js';
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
  private chart!: Chart;

  constructor() {
    Chart.register(...registerables);
  }

  ngAfterViewInit(): void {
      this.initChart();
  }
  
  initChart() {
    throw new Error('Method not implemented.');

  }


}
