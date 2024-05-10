
import { Injectable, inject } from '@angular/core';
import { DocumentReference, Firestore, collection, getDoc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { AuthService } from '../AuthService/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor() { }

  private _firestore = inject(Firestore);
  private _authService = inject(AuthService);

  async getUserDetails():Promise<any> {
    //get user info
    const ref = query(collection(this._firestore, "users"), where("userID", "==", this._authService.checkCookie("userID")));
    try {
      const snapshot = await getDocs(ref);
      if(snapshot.empty) {
        throw new Error('No Profile found');
      }
      return snapshot.docs[0].data();



      
    } catch (error) {
      
    }

  }

  async updateUserInfo(formData:any):Promise<any> {
    const userDocRef = query(collection(this._firestore,'users'), where("userID", "==", this._authService.checkCookie("userID")));
    try {
      const querySnapshot = await getDocs(userDocRef);
      querySnapshot.forEach(async (doc) => {
        const userDocRef: DocumentReference = doc.ref;
        await updateDoc(userDocRef, formData);
        console.log('User info updated successfully');
      })
    } catch (error) {
      console.error('Error updating user info:', error);
      throw error;
    }

     

  }
}
