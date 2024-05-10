import { Component } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-expensecategory',
  standalone: true,
  imports: [],
  templateUrl: './expensecategory.component.html',
  styleUrl: './expensecategory.component.css'
})
export class ExpensecategoryComponent {

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
            showConfirmButton: false,
            timer: 1200,
          });
        }
        // Return the result object to resolve TypeScript error TS7030
        return result;
      });
    });
  }
}
