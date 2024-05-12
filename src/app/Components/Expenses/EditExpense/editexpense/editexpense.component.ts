import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { confirmPasswordReset } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseService } from '../../../../Services/ExpenseService/expense.service';
import { FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editexpense',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './editexpense.component.html',
  styleUrl: './editexpense.component.css'
})
export class EditexpenseComponent implements OnInit {


  private _router = inject(ActivatedRoute);
  private _route = inject(Router);
  private _expenseService = inject(ExpenseService);
  public isLoading = false;
  oldImage:any;
  categorysArrray:any = []
  
  public expenseObj:any
  expenseID: any


  editExpenseForm = new FormGroup({
    expenseName:new FormControl(""),
    expenseCategory: new FormControl(""),
    expenseAmount:new FormControl(""),
    expenseDate:new FormControl("")

  })
  

  async ngOnInit() {
    this.isLoading = true;
    try {
      await this.getexpenseID();
      this._expenseService.getExpenseWithID(this.expenseID).then((expenseData) => {
        this.expenseObj = expenseData;
        this.oldImage = expenseData.ReceiptImage;
      })
      this.getCategorys();



      
    } catch (error) {
      
    }finally {
      this.isLoading = false;
    }
    
    
   
  }

  getexpenseID() {
    this._router.paramMap.subscribe(params  => {
      this.expenseID = params.get("expenseID");

    })
  }

  getCategorys() {
    this._expenseService.getAllCategories().then((data) => {
      this.categorysArrray = data;
      console.log("categorys here: ", data);


    })
  }

  submit() {

    let expenseFormData = {
      expenseName:this.editExpenseForm.value.expenseName || this.expenseObj.expenseName,
      expenseID:this.expenseID,
      expenseAmount:this.editExpenseForm.value.expenseAmount || this.expenseObj.expenseAmount,
      expenseCategory: this.editExpenseForm.value.expenseCategory || this.expenseObj.expenseCategory,
      expenseUserID:this.expenseObj.expenseUserID,
      expenseDate:this.editExpenseForm.value.expenseDate || this.expenseObj.expenseDate,
      ReceiptImage:this.expenseObj.ReceiptImage
    }
    console.log(expenseFormData);
    this._expenseService.updateExpense(expenseFormData).then(async(result) => {
      await Swal.fire({
        title: 'Success!',
        text: `Expense ${expenseFormData.expenseName}  Updated`,
        icon: 'success',
        showConfirmButton:false,
        timer:1200
        // confirmButtonText: 'OK'
      });
      this._route.navigate(['/expenses'])
    }).catch((error) => {
      console.log(error);
    })

  }

  goBack() {
    this._route.navigate(['/expenses'])

    }


    onFileSelected(event: Event): void {
      const element = event.currentTarget as HTMLInputElement;
      // Safely check if files exist and the first file is present
      if (element.files && element.files.length > 0) {
        const file = element.files[0];
  
        if(file){
        const reader = new FileReader();
          reader.onload = () => {
          this.expenseObj.ReceiptImage = reader.result;   // Assign the result to variable for display
            console.log('FileReader result:', reader.result);
            // this.fileName = file.name
  
            
          };
          reader.readAsDataURL(file); // Read the file as a Data URL to display as an image
        } else {
          // Optionally handle the case where no file was selected
          console.log('No file selected');
  
        } 
      }
    }
}
