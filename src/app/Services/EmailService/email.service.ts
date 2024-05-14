
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Firestore, collection, getDocs, query, where } from '@angular/fire/firestore';
import emailjs from '@emailjs/browser';
import { AuthService } from '../AuthService/auth.service';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  constructor() { }

  private _firestore = inject(Firestore);
  private _authService = inject(AuthService);
  


  

  async send(Email:any, passwordToken:any):Promise<any> {
    emailjs.init("bhrlimApgOd_gBDMx");
   await emailjs.send("service_suqwf7i","template_k8dwbss",{
      from_name: "Expense Tracker",
      to_name: `${Email}`,
      message: `Password recovery for Expense Tracker to reset your password click the link: http://localhost:4200/RecoverAccount/${passwordToken}`,
      });
  }


  async verifyEmail(email: any): Promise<any> {
    const ref = collection(this._firestore, "users");
    const q = query(ref, where("Email", "==", email));
    const snapshot = await getDocs(q);
    console.log("Snapshot size:", snapshot.size); // Log how many documents were found
    if (snapshot.empty) {
        console.log("No documents found.");
        return null;
    } else {
        console.log("Returning data for document:", snapshot.docs[0].id); // Log the ID of the document being returned
        return snapshot.docs[0].data();
    }
}


}
