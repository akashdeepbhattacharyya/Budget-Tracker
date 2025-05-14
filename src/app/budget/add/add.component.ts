import { Component, inject, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter, provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import moment, { Moment } from 'moment';
import { BudgetService } from '../../services/budget/budget.service';

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
  selector: 'app-add',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  templateUrl: './add.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './add.component.css',
})
export class AddComponent {
  budgetForm!: FormGroup;
  readonly dialogRef = inject(MatDialogRef<AddComponent>);
  readonly data = inject(MAT_DIALOG_DATA, { optional: true });

  isSubmitting = false;
  constructor(private fb: FormBuilder, private budgetService: BudgetService) {}
  ngOnInit(): void {
    this.budgetForm = this.fb.group({
      date: [new Date(), [Validators.required]],
      budget: [null, [Validators.required]],
    });
  }
  setMonthAndYear(
    normalizedMonthAndYear: Date,
    datepicker: MatDatepicker<Moment>
  ) {
    const selectedMonth = moment(normalizedMonthAndYear); // ✅ Convert to Moment
    const ctrlValue = moment(this.budgetForm.value.date ?? new Date());

    ctrlValue.month(selectedMonth.month());
    ctrlValue.year(selectedMonth.year());
    console.log(ctrlValue);
    this.budgetForm.patchValue({ date: ctrlValue.toDate() });
    datepicker.close();
  }

  onSubmit() {
    if (this.budgetForm.valid) {
      const formattedDate = moment(this.budgetForm.value.date).format(
        'YYYY-MM'
      );
      const budgetData = {
        date: formattedDate,
        budget: this.budgetForm.value.budget,
      };
      console.log(budgetData);
      this.isSubmitting = true;
      this.budgetService.addBudget(budgetData).subscribe({
        next: (response) => {
          console.log('Budget added successfully:', response);
          this.dialogRef.close('Success');
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Error adding budget:', error);
          this.isSubmitting = false;
        },
      });
    }
  }
}
