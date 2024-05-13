import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import Swal from 'sweetalert2';
import { ExpenseService } from '../../../Services/ExpenseService/expense.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-expensecategory',
  standalone: true,
  imports: [NgIf, NgFor, CommonModule],
  templateUrl: './expensecategory.component.html',
  styleUrl: './expensecategory.component.css'
})
export class ExpensecategoryComponent implements OnInit, OnDestroy {


  // TODO:For now to see new data added you have to refresh the page
 

  public _expenseCategory = inject(ExpenseService);
  private subscription: Subscription = new Subscription();
  private initListenForChanges: boolean = false;
  private _ChangeDetectorRef = inject(ChangeDetectorRef);
  private _router = inject(Router);
  public allCategorysArray: any[] = []
  public loading = false;
  // public _datePipe = inject(DatePipe);

  openAddCategoryModal(): Promise<any> {
    return new Promise((resolve, reject) => {
      Swal.fire({
        title: "Enter Expense Category Name",
        input: "text",
        inputPlaceholder: "Type your category name here...",
        showCancelButton: true,
        confirmButtonText: "Save",
        cancelButtonText: "Cancel",
        inputValidator: (value) => {
          if (!value) {
            return "You need to enter a category";
          } else {
            // Resolve the promise with the entered value
            resolve(value);
          }
          // Return null if the condition is false
          return null;
        },
      }).then((result) => {
        if (result.isConfirmed) {
          // Show success message if category is saved
          Swal.fire({
            position: "center",
            icon: "success",
            title: `Category ${result.value} added to Database`,
            text:"Refresh the table to see the changes",
            showConfirmButton: false,
            timer: 1200,
          });
        }

        this._expenseCategory.addCategory(result.value);
        this.refreshTable();

        return result;
      });
    });
  }


  async ngOnInit() {
    this.loading = true;
    try {
      await this.fetchCategories();
      if (!this.initListenForChanges) {
        this.listenForChanges();  // Set up the listener only once
        this.initListenForChanges = true;
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      this.loading = false;
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe(); 
  }



  async fetchCategories() {
    try {
      const data = await this._expenseCategory.getAllCategories();
      // Assuming each category has a `dateCreated` field that is a Firebase Timestamp
      this.allCategorysArray = data.map((category:any) => ({
        ...category,
        dateCreated: category.dateCreated && category.dateCreated.toDate ? category.dateCreated.toDate() : category.dateCreated
      }));
      this.sortCategoriesByTimestamp();
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Optionally handle the error in your UI
    }
  }
  

  
  listenForChanges(): void {
    this.subscription.add(this._expenseCategory.newCategoryAdded.subscribe((newCategory) => {
      console.log("Received new category:", newCategory); // Log received data
      const exists = this.allCategorysArray.some(cat => cat.id === newCategory.id);
      if (!exists) {
        this.allCategorysArray.push(newCategory);
        this._ChangeDetectorRef.detectChanges();  // Force update to view
      }
    }, (error) => {
      console.error("Error listening for new categories:", error);
    }));
  }
  sortCategoriesByTimestamp(): void {
    this.allCategorysArray.sort((a, b) => {
      return b.dateCreated - a.dateCreated; 
    });
  }

  refreshTable() {
    this.fetchCategories();
  }


  editCategory(categoryID: any) {
    const category = this.allCategorysArray.find(data => data.expenseID === categoryID);
    if (category) {
      Swal.fire({
        title: 'Edit Category Name',
        input: 'text',
        inputValue: category.categoryName,
        showCancelButton: true,
        confirmButtonText: 'Update',
        cancelButtonText: 'Cancel',
        inputValidator: (value) => {
          if (!value) {
            return 'You need to write something!';
          }
          return null;
        }
      }).then((result) => {
        //update data 
        if (result.isConfirmed && result.value) {
          console.log('New category name:', result.value);
          this._expenseCategory.updateCategory(categoryID, result.value).then(() => {
            Swal.fire('Updated!', 'Category name has been updated please reload the table.', 'success');
          }).catch((error) => {
            console.error('Update failed:', error);
            Swal.fire('Failed!', 'Failed to update category name. ' + error.message, 'error');
          })
        }
      });
    } else {
      console.log('Category not found!');
    }
  }

  
  deleteCategory(categoryID: any): void {
    const category = this.allCategorysArray.find(data => data.expenseID === categoryID);
    if (category) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this._expenseCategory.deleteCategory(categoryID).then(() => {
            // Successfully deleted
            Swal.fire(
              'Deleted!',
              'Category has been deleted.',
              'success'
            ).then(() => {
              // You may want to remove the deleted category from the array to update UI
              this.allCategorysArray = this.allCategorysArray.filter(item => item.expenseID !== categoryID);
            });
          }).catch((error) => {
            console.error('Delete failed:', error);
            Swal.fire(
              'Failed!',
              'Failed to delete category. ' + error.message,
              'error'
            );
          });
        }
      });
    } else {
      Swal.fire(
        'Not Found!',
        'Category not found.',
        'info'
      );
    }
  }
  
  
}
