import { Component, OnInit, inject } from '@angular/core';
import { ExpenseService } from '../../../Services/ExpenseService/expense.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { Firestore, collection, getDoc, getDocs, query, where } from '@angular/fire/firestore';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';


@Component({
    selector: 'app-expenses',
    standalone: true,
    templateUrl: './expenses.component.html',
    styleUrl: './expenses.component.css',
    imports: [NgFor, NgIf,RouterLink, CommonModule, FormsModule]
})
export class ExpensesComponent implements OnInit {
  

  public expenseCategoryList:any = [];
  private _expenseService = inject(ExpenseService);
  selectedCategory: string = '';
  public isLoading = false;
  public expensesArray:any = []
  private _firestore = inject(Firestore);
  async ngOnInit() {
    this.isLoading = true;
    try {
      await this._expenseService.getAllCategories().then((categorys) => {
        this.expenseCategoryList = categorys
      })
       this.getAllExpenses();
    } catch (error) {
      
    }finally {
      this.isLoading = false;
    }

   
      
  }


  getAllExpenses() {
    this._expenseService.getExpenses().then((expenseData) => {
      this.expensesArray = expenseData;
    })
  }

  reloadTable() {
    this.getAllExpenses();
    console.log(this.selectedCategory);
  }


  //TODO:need to get all the dates in between
  async dateRangeFilter(firstDate:any, secondDate:any){
    const ref =  collection(this._firestore, "Expenses" );
    const querySnapshot = query(ref, where("expenseDate", ">=", firstDate), where("expenseDate", "<=", secondDate));
    const snapshot = await getDocs(querySnapshot);
    if(snapshot.empty) {

      Swal.fire({
        title: 'No Expenses',
        text: 'There are no expenses for the selected date range.',
        icon: 'info'
      });

    } else {
      snapshot.docs.map(doc => {
        Swal.fire({
          title: 'Expenses',
          text: 'Expense range found',
          icon: 'success',
          showConfirmButton:false,
          timer:1200
        });
        this.expensesArray = [];
        let array = []
        array.push(doc.data())
        this.expensesArray = array;
        // this.expensesArray = doc.data();

      })
    }

    return null;


  }

 
  showCategoryFilter() {
    let optionsHtml = '<select id="categorySelect">';
    this.expenseCategoryList.forEach((category: any) => {
      optionsHtml += `<option>${category.categoryName}</option>`;
    });
    optionsHtml += '</select>';

    Swal.fire({
      title: 'Expense Filter',
      html: optionsHtml,
      showCancelButton: true,
      confirmButtonText: 'Search'
    }).then((result) => {
      if (result.isConfirmed) {
        // Retrieve selected value from the modal
        const selectedValue = (document.getElementById('categorySelect') as HTMLSelectElement).value;
        // Update selectedCategory variable
        this.selectedCategory = selectedValue;
        // Do something with selectedCategory
        console.log('Selected Category:', this.selectedCategory);
      }
    });
  }


  openDateRangePicker() {
    Swal.fire({
      title: 'Select Date Range',
      html: `
        <input id="start-date" type="date" placeholder="Start Date" class="swal2-input">
        <p class='pt-5'>To</p>
        <input id="end-date" type="date" placeholder="End Date" class="swal2-input">
      `,
      preConfirm: () => {
        return [
          (document.getElementById('start-date') as HTMLInputElement).value,
          (document.getElementById('end-date') as HTMLInputElement).value
        ];
      },
      didOpen: () => {
        flatpickr('#start-date', {
          dateFormat: 'Y-m-d',
        });
        flatpickr('#end-date', {
          dateFormat: 'Y-m-d',
        });
      }
    }).then((result:any) => {
      if (result.isConfirmed) {
        const startDate = result.value[0];
        const endDate = result.value[1];
        this.dateRangeFilter(startDate, endDate); 
        //send the date range to the database to validate
        console.log('Start Date:', startDate);
        console.log('End Date:', endDate);
      }
    });
  }

  handleInputChange(event: Event) {
    // Handle input change here
    const inputValue = (event.target as HTMLInputElement).value;
    console.log('Input value:', inputValue);
    this.searchExpenseNameFilter(inputValue);
  }
  async searchExpenseNameFilter(inputValue: string) {
    const ref = collection(this._firestore, "Expenses");
    const querySnapshot = query(ref, where("expenseName", ">=", inputValue));
    const snapshot = await getDocs(querySnapshot);
    
    if (snapshot.empty) {
      return null;
    } else {
      this.expensesArray = snapshot.docs.map(doc => doc.data());
      return this.expensesArray;
    }
  }
}






function flatpickr(arg0: string, arg1: { dateFormat: string; }) {
  throw new Error('Function not implemented.');
}

