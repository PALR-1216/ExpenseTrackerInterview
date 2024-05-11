import { Component, OnInit, inject } from '@angular/core';
import { ExpenseService } from '../../../../Services/ExpenseService/expense.service';
import { NgFor } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addexpense',
  standalone: true,
  imports: [NgFor, FormsModule, ReactiveFormsModule],
  templateUrl: './addexpense.component.html',
  styleUrl: './addexpense.component.css'
})
export class AddexpenseComponent implements OnInit{
  private _expenseService = inject(ExpenseService);
  receiptFile: any | ArrayBuffer | null = null;
  fileName:any = ""
  public allCategorys:any = []
  private _router = inject(Router);

  ngOnInit() {
    this.getCategorys();
      
  }

  addExpenseForm = new FormGroup({
    expenseName:new FormControl("", Validators.required),
    expenseCategory: new FormControl("", Validators.required),
    expenseDate:new FormControl("", Validators.required),
    expenseAmount: new FormControl('', [
      Validators.required,
      Validators.min(1),
      Validators.pattern(/^\d+(\.\d+)?$/)
    ])
  })

  getCategorys() {
    this._expenseService.getAllCategories().then((allCategory) => {
      this.allCategorys = allCategory;
    })
  }

  addExpense() {
    if(this.addExpenseForm.valid) {
      //addData to the database
      this._expenseService.addExpense(this.addExpenseForm.value, this.receiptFile).then(async (expenseData) => {
        await this.showAlert("success", "Expense Added to the Database")
        await this._router.navigate(['/expenses'])
      })
    } else {
      this.showAlert("error", "Please enter all fields correctly");
    }
  }


  private showAlert(icon: any, message: string) {
    Swal.fire({
      icon: icon,
      title: message,
      showConfirmButton: false,
      timer: 1500
    });
  }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    // Safely check if files exist and the first file is present
    if (element.files && element.files.length > 0) {
      const file = element.files[0];

      if(file){
      const reader = new FileReader();
        reader.onload = () => {
          this.receiptFile = reader.result; // Assign the result to variable for display
          console.log('FileReader result:', reader.result);
          this.fileName = file.name

          
        };
        reader.readAsDataURL(file); // Read the file as a Data URL to display as an image
      } else {
        // Optionally handle the case where no file was selected
        console.log('No file selected');

      } 
    }
    
  }

}


// Create expenses page. This section will have an add button, filters, and a table displaying expenses. On add button, fields are:
// Expense Name
// Expense Category (dropdown, data comes from expense categories section)
// Date (date picker)
// Amount (in dollars)
// Receipt (image or pdf upload)
// Once created, display on table with a view button and an edit button at the end of each item row. 
// Filters are:
// Date range
// Category
// A search field