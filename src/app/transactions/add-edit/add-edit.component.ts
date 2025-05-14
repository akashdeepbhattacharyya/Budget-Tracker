import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TransactionService } from '../../services/transaction-service/transaction.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-add-edit',
 
  providers: [],
  templateUrl: './add-edit.component.html',
  styleUrl: './add-edit.component.css',
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
  ],
})
export class AddEditComponent {
  transActionForm!: FormGroup;
  readonly dialogRef = inject(MatDialogRef<AddEditComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  isSubmitting = false;
  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService
  ) {}
  ngOnInit(): void {
    this.transActionForm = this.fb.group({
      amount: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      type: ['', Validators.required], // e.g., 'income' or 'expense'
      category: ['', Validators.required],
      date: ['', Validators.required],
      description: [''],
    });
    console.log(this.data);
    if (this.data) {
      this.transActionForm.patchValue({
        amount: this.data.amount,
        type: this.data.type,
        category: this.data.category,
        date: this.data.date,
        description: this.data.description,
      });
    }
  }
  onSubmit() {
    this.isSubmitting = true;
    if (this.data) {
      if (this.transActionForm.valid) {
        this.transactionService
          .updateTransaction(this.data.id, this.transActionForm.value)
          .subscribe({
            next: (response) => {
              console.log('Transaction updated successfully:', response);
              this.dialogRef.close('Success');
              this.isSubmitting = false;
            },
            error: (error) => {
              console.error('Error updating transaction:', error);
              this.isSubmitting = false;
            },
          });
      }
    } else {
      if (this.transActionForm.valid) {
        this.transactionService
          .addTransaction(this.transActionForm.value)
          .subscribe({
            next: (response) => {
              console.log('Transaction updated successfully:', response);
              this.dialogRef.close('Success');
              this.isSubmitting = false;
            },
            error: (error) => {
              console.error('Error adding transaction:', error);
              this.isSubmitting = false;
            },
          });
      }
    }
  }
}
