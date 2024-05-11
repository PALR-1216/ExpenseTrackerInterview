import { Component, OnInit, inject } from '@angular/core';
import { confirmPasswordReset } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-editexpense',
  standalone: true,
  imports: [],
  templateUrl: './editexpense.component.html',
  styleUrl: './editexpense.component.css'
})
export class EditexpenseComponent implements OnInit {

  private _router = inject(ActivatedRoute);
  public isLoading = false;
  userID: any

  async ngOnInit() {
    this.isLoading = true;
    try {
      this.getexpenseID();
      
    } catch (error) {
      
    }finally {
      this.isLoading = false;
    }
    
    
   
  }

  getexpenseID() {
    this._router.paramMap.subscribe(params  => {
      this.userID = params.get("expenseID");

    })
  }



}
