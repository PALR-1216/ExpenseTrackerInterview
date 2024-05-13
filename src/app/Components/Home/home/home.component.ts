import { Component } from '@angular/core';
import { StatsComponent } from "../StatArea/stats/stats.component";
import { Graph1Component } from "../Graph1/graph1/graph1.component";
import { PiechartComponent } from "../PieChart/piechart/piechart.component";

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [StatsComponent, Graph1Component, PiechartComponent]
})
export class HomeComponent {

}
