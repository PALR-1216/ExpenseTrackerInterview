import { Component, OnInit, inject } from '@angular/core';
import { ExpenseService } from '../../../../Services/ExpenseService/expense.service';
import { CommonModule } from '@angular/common';
import { Firestore, collection, getDoc, getDocs, query, where } from '@angular/fire/firestore';

import { AuthService } from '../../../../Services/AuthService/auth.service';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css'
})
export class StatsComponent implements OnInit {

  private _expenseService = inject(ExpenseService);
  public totalExpense:any;
  public totalCategorys:any;
  public isLoading = false;
  private _firestore = inject(Firestore);
  private _authService = inject(AuthService);

  async ngOnInit() {
    
    try {
      this.isLoading = true
      await this.getTotalExpenses();
      await this.getTotalCategorys();
      
    } catch (error) {
      
    }finally {
      this.isLoading = false
    }
  }


  async getTotalExpenses() {
    this._expenseService.getTotalExpenses().then((total) => {
      console.log(total);
      this.totalExpense = total;
    })
  }

  async getTotalCategorys() {
    const ref = collection(this._firestore, "ExpenseCategory");
    const q = query(ref, where("expenseUserID", "==", this._authService.checkCookie("userID")));
    const snapshot = await getDocs(q);
    this.totalCategorys = snapshot.docs.length;
  }

}
