
import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit, inject } from '@angular/core';
import { Firestore, addDoc, collection, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import emailjs from '@emailjs/browser';
import { AuthService } from '../AuthService/auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class EmailService implements OnInit{
  constructor() { }

  private _firestore = inject(Firestore);
  private _authService = inject(AuthService);
  userinfo:any = {};
  randomOTP = Math.floor(1000 + Math.random() * 9000);

  ngOnInit(): void {
      // this.generateRandomNumber();
  }

  // generateRandomNumber() {
  //   this.randomOTP = Math.floor(1000 + Math.random() * 9000);
  // }
  

  async send(Email:any):Promise<any> {
    emailjs.init("bhrlimApgOd_gBDMx");
    this.saveOTPInFirebase();
   await emailjs.send("service_suqwf7i","template_k8dwbss",{
      from_name: "Expense Tracker",
      to_name: `${Email}`,
      message: `Password recovery for Expense Tracker to reset your password Enter this OTP numbers: ${this.randomOTP}`,
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
        this.userinfo = snapshot.docs[0].data();
        return snapshot.docs[0].data();
    }
}

saveOTPInFirebase() {
 
 let createdAt = new Date();
 const expiresAt = new Date();
 expiresAt.setMinutes(expiresAt.getMinutes() + 10);

 try {
  let ref = collection(this._firestore, "RecoverAccount");
  let otpObj = {
    userID:this.userinfo.userID,
    ID:crypto.randomUUID(),
    createdAt:createdAt,
    expiresAt:expiresAt,
    OTP:this.randomOTP
  }
  // console.log(otpObj);
  return addDoc(ref, otpObj);
  
 } catch (error) {
  return null;
  
 }
}


  async verifyOTP(otp:number):Promise<any>{
    let ref = collection(this._firestore, "RecoverAccount");
    let q = query(ref, where("OTP", "==", otp));
    let snapshot = await getDocs(q);
    if(snapshot.empty) {
      //is empty
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Your code is not Valid",
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      //there is a value
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Your code is Valid",
        showConfirmButton: false,
        timer: 1500
      });
      return snapshot.docs[0].data();
    }
  }


  async updatePassword(userID:any, Password:any) {
    let ref = collection(this._firestore, "users");
    let q = query(ref, where("userID", "==", userID));
    let snapshot = await getDocs(q);
    if(snapshot.empty) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "User not Found",
        showConfirmButton: false,
        timer: 1500
      });

    } else {
      // Since userID should be unique, we expect only one document.
      snapshot.forEach(async (doc) => {
        try {
          await updateDoc(doc.ref, { Password: Password });
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Password updated successfully",
            showConfirmButton: false,
            timer: 1500
          });
        } catch (error:any) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Failed to update password",
            text: error.message,
            showConfirmButton: true
          });
        }
      });
    }
  }
}
