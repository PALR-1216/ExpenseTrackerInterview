import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-viewexpense',
  standalone: true,
  imports: [],
  templateUrl: './viewexpense.component.html',
  styleUrl: './viewexpense.component.css'
})
export class ViewexpenseComponent implements OnInit {

  private _router = inject(ActivatedRoute);
  private _route = inject(Router);
  expenseID:any;
  ngOnInit() {
    this.getExpenseID();
    this.fetchExpenseData();
      
  }
  fetchExpenseData() {
    //here fetch info about the expense


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

}
