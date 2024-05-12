import { Injectable, OnDestroy, OnInit, inject } from '@angular/core';
import { AuthService } from '../AuthService/auth.service';
import { collection, query, where, getDocs, DocumentData } from 'firebase/firestore';
import { Observable, Subject } from 'rxjs';
import { Firestore, addDoc, deleteDoc, doc, getDoc, onSnapshot, snapToData, updateDoc } from '@angular/fire/firestore';
import { ref } from '@angular/fire/storage';



@Injectable({
  providedIn: 'root'
})
export class ExpenseService implements OnInit{

  constructor() { }
 
  

  public _authService = inject(AuthService);
  private _firestore = inject(Firestore);
  newCategoryAdded: Subject<any> = new Subject<any>(); // Subject to emit events

  public allCategorysArray = []


  async ngOnInit() {
    this.getAllCategories().then((Data:any) => {
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
  

  
  addCategory(nameOfCategory:any) {
    const categoryRef = collection(this._firestore, "ExpenseCategory");

    let expenseObj = {
      categoryName:nameOfCategory,
      dateCreated:new Date(),
      expenseID: crypto.randomUUID(),
      expenseUserID:this._authService.checkCookie("userID")
    }
    return addDoc(categoryRef, expenseObj);
  }


  updateCategory(categoryID:any, newName:any):Promise<any> {
    const expenseRef = collection(this._firestore, "ExpenseCategory");
    const querySnapshotsnapshot = query(expenseRef, where("expenseID", "==", categoryID))
    return getDocs(querySnapshotsnapshot).then((snapshot) => {
      if(snapshot.empty) {
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


  addExpense(expenseObj:any,ReceiptImage:any ):Promise<any> {
    const expenseRef = collection(this._firestore, "Expenses");
    let expense:any = {
      expenseID:crypto.randomUUID(),
      expenseName:expenseObj.expenseName,
      expenseCategory:expenseObj.expenseCategory,
      expenseDate:expenseObj.expenseDate,
      expenseAmount:expenseObj.expenseAmount,
      ReceiptImage:ReceiptImage || null,
      expenseUserID:this._authService.checkCookie("userID")
    }
    return addDoc(expenseRef, expense);
  }


  async getExpenses():Promise<any> {
    const expenseRef = query(collection(this._firestore, "Expenses"), where("expenseUserID", "==", this._authService.checkCookie("userID")));
    const snapshot = await getDocs(expenseRef);
    if(snapshot.empty) {
      return []; 
    }
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

  }


  async getExpenseWithID(expenseID:any):Promise<any> {
    let tempArray:any = []
    const expenseRef = query(collection(this._firestore, "Expenses"), where("expenseID", "==", expenseID));
    const snapshot = await getDocs(expenseRef);
    if(snapshot.empty) {
      return null;
    } else {
      
      snapshot.forEach((doc:any) => {
        if(doc.data.length === 0) {
          tempArray.push(doc.data());
        }
      })

      return tempArray[0];
    }
  }


  async updateExpense(expenseData:any):Promise<any> {
    //update the expense 
    const ref = collection(this._firestore, "Expenses");
    const q = query(ref, where("expenseID", "==", expenseData.expenseID));

    const snapshot = await getDocs(q);
    if(!snapshot.empty) {
      const docRef = snapshot.docs[0].ref;
      await updateDoc(docRef, expenseData);
      snapshot.forEach((doc) => {
        console.log("Data in service: ", doc.data());
      })

    } else {

    }

  }
}
