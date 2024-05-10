import { Injectable, OnDestroy, OnInit, inject } from '@angular/core';
import { AuthService } from '../AuthService/auth.service';
import { collection, query, where, getDocs, DocumentData } from 'firebase/firestore';
import { Observable, Subject } from 'rxjs';
import { Firestore, addDoc, deleteDoc, doc, getDoc, onSnapshot, updateDoc } from '@angular/fire/firestore';



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
}
