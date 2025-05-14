import { Component, inject, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { TransactionService } from '../../services/transaction-service/transaction.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AddEditComponent } from '../add-edit/add-edit.component';
import { LoaderService } from '../../services/loader/loader.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-list',
  imports: [MatTableModule, MatPaginatorModule, MatIconModule, CommonModule, MatButtonModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
})
export class ListComponent {
  displayedColumns: string[] = [
    'id',
    'amount',
    'type',
    'category',
    'date',
    'description',
    'action',
  ];
  dataSource = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private transactionService: TransactionService,
    private dialog: MatDialog,
    private loaderService: LoaderService
  ) {
    // Example data
  }
  ngOnInit() {
    this.getTransactions();
  }
  getTransactions() {
    // Logic to fetch transactions from the server
    this.loaderService.show();
    this.transactionService.transactions().subscribe({
      next: (data) => {
        console.log('Transactions fetched successfully:', data);
        this.dataSource = data;
        this.loaderService.hide();
      },
      error: (error) => {
        console.error('Error fetching transactions:', error);
        this.loaderService.hide();
      },
    });
  }
  editTransaction(item: any) {
    // Logic to edit a transaction
    this.openDialog(item);
  }
  deleteTransaction(item: any) {
    // Logic to delete a transaction
    console.log('Deleting transaction:', item);

    this.transactionService.deleteTransaction(item).subscribe({
      next: (data) => {
        console.log('Transaction deleted successfully:', data);
        this.getTransactions();
      },
      error: (error) => {
        console.error('Error deleting transaction:', error);
      },
    });
  }
  addTransaction() {
    this.openDialog();
  }
  openDialog(item?: any): void {
    const dialogRef = this.dialog.open(AddEditComponent, {
      data: item,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (result === 'Success') {
        this.getTransactions();
      }
    });
  }
}
