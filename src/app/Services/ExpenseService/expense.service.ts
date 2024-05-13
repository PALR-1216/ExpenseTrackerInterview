import { Injectable, OnDestroy, OnInit, inject } from '@angular/core';
import { AuthService } from '../AuthService/auth.service';
import { collection, query, where, getDocs, DocumentData } from 'firebase/firestore';
import { Observable, Subject } from 'rxjs';
import { Firestore, addDoc, deleteDoc, doc, getAggregateFromServer, getDoc, onSnapshot, snapToData, sum, updateDoc } from '@angular/fire/firestore';
import { ref } from '@angular/fire/storage';



@Injectable({
  providedIn: 'root'
})
export class ExpenseService implements OnInit {

  constructor() { }



  public _authService = inject(AuthService);
  private _firestore = inject(Firestore);
  newCategoryAdded: Subject<any> = new Subject<any>(); // Subject to emit events

  public allCategorysArray = []


  async ngOnInit() {
    this.getAllCategories().then((Data: any) => {
      this.allCategorysArray = Data;
    })

  }


  async getAllCategories(): Promise<any[]> {
    const categoryRef = query(collection(this._firestore, "ExpenseCategory"), where('expenseUserID', "==", this._authService.checkCookie("userID")));

    const snapshot = await getDocs(categoryRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(), // Spread all fields
      dateCreated: doc.data()['dateCreated'] // This assumes `dateCreated` is stored directly
    }));
  }

  listenForNewCategories(): void {
    const ref = query(collection(this._firestore, "ExpenseCategory"), where("expenseUserID", "==", this._authService.checkCookie("userID")));
    try {
      onSnapshot(ref, (querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            this.newCategoryAdded.next(change.doc.data());
          }
        });
      });
    } catch (error) {
      console.error("Error listening for categories:", error);
      throw error;
    }
  }



  addCategory(nameOfCategory: any) {
    const categoryRef = collection(this._firestore, "ExpenseCategory");

    let expenseObj = {
      categoryName: nameOfCategory,
      dateCreated: new Date(),
      expenseID: crypto.randomUUID(),
      expenseUserID: this._authService.checkCookie("userID")
    }
    return addDoc(categoryRef, expenseObj);
  }


  updateCategory(categoryID: any, newName: any): Promise<any> {
    const expenseRef = collection(this._firestore, "ExpenseCategory");
    const querySnapshotsnapshot = query(expenseRef, where("expenseID", "==", categoryID))
    return getDocs(querySnapshotsnapshot).then((snapshot) => {
      if (snapshot.empty) {
        throw new Error('No category found with the given ID.');
      }
      const docRef = doc(this._firestore, "ExpenseCategory", snapshot.docs[0].id);
      return updateDoc(docRef, { categoryName: newName });
    })

  }

  deleteCategory(categoryID: any): Promise<void> {

    const expenseRef = collection(this._firestore, "ExpenseCategory");


    const q = query(expenseRef, where("expenseID", "==", categoryID));

    // Execute the query and delete the document
    return getDocs(q).then(snapshot => {
      if (snapshot.empty) {
        // Throw an error if no document is found
        throw new Error('No category found with the given ID.');
      }
      // Get the first document's reference from the query result
      const docRef = doc(this._firestore, "ExpenseCategory", snapshot.docs[0].id);
      // Delete the document
      return deleteDoc(docRef);
    });
  }


  addExpense(expenseObj: any, ReceiptImage: any): Promise<any> {
    const expenseRef = collection(this._firestore, "Expenses");
    let expense: any = {
      expenseID: crypto.randomUUID(),
      expenseName: expenseObj.expenseName,
      expenseCategory: expenseObj.expenseCategory,
      expenseDate: expenseObj.expenseDate,
      expenseAmount: Number(expenseObj.expenseAmount),
      ReceiptImage: ReceiptImage || null,
      expenseUserID: this._authService.checkCookie("userID")
    }
    return addDoc(expenseRef, expense);
  }


  async getExpenses(): Promise<any> {
    const expenseRef = query(collection(this._firestore, "Expenses"), where("expenseUserID", "==", this._authService.checkCookie("userID")));
    const snapshot = await getDocs(expenseRef);
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

  }


  async getExpenseWithID(expenseID: any): Promise<any> {
    let tempArray: any = []
    const expenseRef = query(collection(this._firestore, "Expenses"), where("expenseID", "==", expenseID));
    const snapshot = await getDocs(expenseRef);
    if (snapshot.empty) {
      return null;
    } else {

      snapshot.forEach((doc: any) => {
        if (doc.data.length === 0) {
          tempArray.push(doc.data());
        }
      })

      return tempArray[0];
    }
  }


  async updateExpense(expenseData: any): Promise<any> {
    //update the expense 
    const ref = collection(this._firestore, "Expenses");
    const q = query(ref, where("expenseID", "==", expenseData.expenseID));

    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const docRef = snapshot.docs[0].ref;
      await updateDoc(docRef, expenseData);
      snapshot.forEach((doc) => {
        console.log("Data in service: ", doc.data());
      })

    } else {

    }

  }

  async deleteExpense(expenseID: any): Promise<any> {
    const ref = collection(this._firestore, "Expenses");
    const q = query(ref, where("expenseID", "==", expenseID))
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const docRef = snapshot.docs[0].ref;
      await deleteDoc(docRef);
    }
  }

  async getTotalExpenses(): Promise<number> {
    const userID = this._authService.checkCookie("userID"); // Retrieve user ID from the authentication service
    const ref = collection(this._firestore, "Expenses");
    const q = query(ref, where("expenseUserID", "==", userID)); // Filter expenses by user ID
    const snapshot = await getDocs(q);

    let total = 0;
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data['expenseAmount'] && typeof data['expenseAmount'] === 'number') {
        total += data['expenseAmount'];
      }
    });

    return total;
  }


  async getTotalExpensesForUser(): Promise<any> {
    let tempArray: any = [];
    const ref = collection(this._firestore, "Expenses");
    const q = query(ref, where("expenseUserID", "==", this._authService.checkCookie("userID")));
    const snapshot = await getDocs(q);
    snapshot.docs.map((doc) => {
      tempArray.push(doc.data());
    })

    return tempArray;
  }

  async getTotalExpenseByMonth(): Promise<any> {
    let expensesByMonth: any = {};
    const currentYear = new Date().getFullYear(); // Get the current year
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const ref = collection(this._firestore, "Expenses");
    const userID = this._authService.checkCookie("userID"); // Retrieve user ID from cookie
    const q = query(ref, where("expenseUserID", "==", userID));
    const snapshot = await getDocs(q);
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      const expenseDate = new Date(data['expenseDate']); // Convert string to Date
      const year = expenseDate.getFullYear(); // Get the year of the expense

      if (year === currentYear) { // Check if the year of the expense is the current year
        const month = monthNames[expenseDate.getMonth()]; // Get the month name
        const key = `${month} ${year}`; // Format as 'Month YYYY'

        if (!expensesByMonth[key]) {
          expensesByMonth[key] = 0;
        }
        expensesByMonth[key] += data['expenseAmount'];
      }
    });

    return expensesByMonth; // Returns expenses for the current year
  }


 async getTotalExpenseByCategory(): Promise<any> {
    // Fetch categories and expenses
    const categories = await this.getAllCategories();
    const expenses = await this.getTotalExpensesForPieChart();

    // Log categories and expenses to check their structure and content
    // console.log("Categories:", categories);
    // console.log("Expenses:", expenses);

    // Initialize total expenses by category object
    const totalExpensesByCategory: any = {};

    // Set up categories in the total expense object
    categories.forEach(category => {
        totalExpensesByCategory[category['categoryName']] = 0;
    });

    // Calculate total expenses by category
    let totalExpenses = 0;  // Initialize a variable to keep track of total expenses
    expenses.forEach((expense: any) => {
        let expenseCategoryName = expense['expenseCategory'];
        if (totalExpensesByCategory.hasOwnProperty(expenseCategoryName)) {
            let expenseAmount = parseFloat(expense['expenseAmount']);
            totalExpensesByCategory[expenseCategoryName] += expenseAmount;
            totalExpenses += expenseAmount;  // Increment total expenses with each expense amount
        } else {
            console.log("Category not found for expense:", expense);
        }
    });

    // Log the total expenses object to check final sums
    // console.log("Total Expenses by Category:", totalExpensesByCategory);

    // Calculate and log the percentage of expenses for each category
    const categoryPercentages:any = {};
    for (const categoryName in totalExpensesByCategory) {
        let categoryTotal = totalExpensesByCategory[categoryName];
        let percentage = (categoryTotal / totalExpenses) * 100;
        categoryPercentages[categoryName] = `${percentage.toFixed(2)}%`;  // Format percentage to 2 decimal places
    }

    // Log the percentage of expenses for each category

    // Optionally, return both totals and percentages
    return {
        totalExpensesByCategory,
        categoryPercentages
    };
}





  async getTotalExpensesForPieChart(): Promise<any> {
    let tempArray: any = [];
    const ref = collection(this._firestore, "Expenses");
    const q = query(ref, where("expenseUserID", "==", this._authService.checkCookie("userID")));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(), // Spread all fields
    }));
  }
}
