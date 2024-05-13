import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-piechart',
  standalone: true,
  imports: [],
  templateUrl: './piechart.component.html',
  styleUrl: './piechart.component.css'
})
export class PiechartComponent implements AfterViewInit{
  @ViewChild('chart') chartRef!: ElementRef<HTMLCanvasElement>;
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
