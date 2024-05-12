import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseService } from '../../../../Services/ExpenseService/expense.service';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-viewexpense',
  standalone: true,
  imports: [NgIf, CommonModule],
  templateUrl: './viewexpense.component.html',
  styleUrl: './viewexpense.component.css'
})
export class ViewexpenseComponent implements OnInit {

  private _router = inject(ActivatedRoute);
  private _route = inject(Router);
  private _expenseService = inject(ExpenseService);
  public isLoading = false
  year = new Date().getFullYear()
  public expenseObj:any;
  expenseID:any;
  async ngOnInit() {
    try {
      this.isLoading = true;
  
      await Promise.all([this.getExpenseID(), this.fetchExpenseData()]);
      
    } catch (error) {

    } finally {
      this.isLoading = false;
    }
  }

  async fetchExpenseData() {
    //here fetch info about the expense
    this._expenseService.getExpenseWithID(this.expenseID).then((data) => {
      console.log("data here: ", data);
      this.expenseObj = data;
    })


  }

  


  getExpenseID() {
    this._router.paramMap.subscribe(params => {
      const id = params.get('expenseID');
      this.expenseID = id;
    });
  }

  goBack() {
    this._route.navigate(['/expenses']);

  }

  printPage() {
    window.print();
  }

}
