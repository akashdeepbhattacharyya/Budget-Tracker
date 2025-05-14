import {
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { BudgetService } from '../../services/budget/budget.service';
import * as d3 from 'd3';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatDatepicker,
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import moment from 'moment';
import { AddComponent } from '../add/add.component';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '../../services/loader/loader.service';
import { MatButtonModule } from '@angular/material/button';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-view',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule
  ],
  providers: [provideMomentDateAdapter(MY_FORMATS)],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './view.component.html',
  styleUrl: './view.component.css',
})
export class ViewComponent {
  data: { label: string; value: number }[] = [];
  date: Date = new Date();
  @ViewChild('chart') private chartContainer!: ElementRef;
  constructor(
    private budgetService: BudgetService,
    private dialog: MatDialog,
    private loaderService: LoaderService
  ) {}
  ngOnInit() {
    const formattedDate = moment(this.date).format('YYYY-MM');
    this.getBudgets(formattedDate);
  }

  getBudgets(value: string) {
    this.loaderService.show();
    this.budgetService.getBudgets(value).subscribe({
      next: (data) => {
        this.data = [
          { label: 'Budget', value: data.total_budget },
          { label: 'Expense', value: data.total_expenses },
          { label: 'Balance', value: data.balance },
        ];
        setTimeout(() => {
          this.drawChart();
          this.loaderService.hide();
        }, 1000);
      },
      error: (error) => {
        console.error('Error fetching budgets:', error);
        this.loaderService.hide();
      },
    });
  }
  drawChart(): void {
    const element = this.chartContainer.nativeElement;
    d3.select(element).selectAll('*').remove(); // Clear previous chart

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3
      .select(element)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(this.data.map((d) => d.label))
      .range([0, width])
      .padding(0.4);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(this.data, (d) => d.value)!])
      .nice()
      .range([height, 0]);

    svg
      .append('g')
      .selectAll('rect')
      .data(this.data)
      .join('rect')
      .attr('x', (d) => x(d.label)!)
      .attr('y', (d) => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', (d) => height - y(d.value))
      .attr('fill', '#2196f3');

    svg
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    svg.append('g').call(d3.axisLeft(y));
  }

  setMonthAndYear(
    normalizedMonthAndYear: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    const ctrlValue = moment(this.date ?? new Date()); // Convert to Moment object
    ctrlValue?.month(normalizedMonthAndYear.month());
    ctrlValue?.year(normalizedMonthAndYear.year());
    this.date = ctrlValue?.toDate();
    datepicker.close();
    const formattedDate = moment(this.date).format('YYYY-MM');
    this.getBudgets(formattedDate);
    console.log('Selected date:', this.date); // this is a JS Date object
  }
  addBudget() {
    const dialogRef = this.dialog.open(AddComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (result === 'Success') {
        const formattedDate = moment(this.date).format('YYYY-MM');
        this.getBudgets(formattedDate);
      }
    });
  }
}
