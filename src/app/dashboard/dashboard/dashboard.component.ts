import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import * as d3 from 'd3';
import { LoaderService } from '../../services/loader/loader.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  totalIncome = 0;
  totalExpenses = 0;
  balance = 0;
  monthlyBudget = 0;
  remainingBudget = 0;
  constructor(private dashboardService: DashboardService, private loaderService: LoaderService) {}

  ngOnInit(): void {
    this.getDashboardData();
  }
  getDashboardData() {
    this.loaderService.show();
    this.dashboardService.getData().subscribe((data) => {
      this.totalIncome = data.total_income;
      this.totalExpenses = data.total_expenses;
      this.balance = data.balance;
      this.monthlyBudget = data.monthly_budget;
      this.remainingBudget = data.budget_remaining;
      setTimeout(() => {
        this.drawDonutChart(
          'income-expense-chart',
          [
            { label: 'Income', value: data.total_income },
            { label: 'Expenses', value: data.total_expenses },
          ],
          'Income vs Expenses'
        );

        this.drawDonutChart(
          'budget-chart',
          [
            { label: 'Used', value: data.total_expenses },
            { label: 'Remaining', value: Math.max(data.budget_remaining, 0) },
          ],
          'Budget Usage'
        );
    this.loaderService.hide();

      }, 1000);
    });
  }
  drawDonutChart(elementId: string, data: any[], title: string) {
    const width = 350;
    const height = 350;
    const margin = 30;
    const radius = Math.min(width, height) / 2 - margin;

    d3.select(`#${elementId}`).selectAll('*').remove();

    const svg = d3
      .select(`#${elementId}`)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const color = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.label))
      .range(d3.schemeSet2);

    const pie = d3.pie<any>().value((d) => d.value);
    const data_ready = pie(data);

    const arc = d3
      .arc<d3.PieArcDatum<any>>()
      .innerRadius(70)
      .outerRadius(radius);

    svg
      .selectAll('path')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', (d) => arc(d) as string)
      .attr('fill', (d) => color(d.data.label) as string)
      .attr('stroke', 'white')
      .style('stroke-width', '2px');

    svg
      .selectAll('text')
      .data(data_ready)
      .enter()
      .append('text')
      .text((d) => `${d.data.label}: ${d.data.value}`)
      .attr('transform', (d) => `translate(${arc.centroid(d)})`)
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', 'white');

    d3.select(`#${elementId}`)
      .append('div')
      .style('text-align', 'center')
      .style('margin-top', '10px')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .style('color', 'rgb(108 159 206)')
      .text(title);
  }
}
