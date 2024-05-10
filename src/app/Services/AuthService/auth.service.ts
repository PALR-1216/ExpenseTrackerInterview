import { Injectable, inject } from '@angular/core';
import { Auth, UserCredential, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { CookieService } from 'ngx-cookie-service';
import { Firestore, addDoc, collection, setDoc, getDocs, query, collectionData, doc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {  GoogleAuthProvider, signInWithRedirect , signInWithPopup} from '@angular/fire/auth';





@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _auth = inject(Auth);
  private _cookie = inject(CookieService);
  private _firestore = inject(Firestore);


  constructor() { }

  async login(userName: any, password: any): Promise<any> {
    try {
      const userRef = collection(this._firestore, "users");
      const userQuery = query(userRef, where("userName", "==", userName));
      const snapshot = await getDocs(userQuery);
  
      if (snapshot.empty) {
        throw new Error('No user found with that username.');
      }
  
      const userData = snapshot.docs[0].data();
  
      if (userData['Password'] === password) {
        console.log('Login successful.');
        return userData;  // This will now correctly propagate up to the component for further handling.
      } else {
        throw new Error('Incorrect password.');
      }
    } catch (error) {
      console.error(error);
      throw error;  // This allows the error to be handled by the calling function.
    }
  }
  

  async signUp(userName: string, email: string, password: string): Promise<any> {
    const userRef = collection(this._firestore, 'users');
    
    // Query to check if the username already exists
    const usernameQuery = query(userRef, where("userName", "==", userName));
    const usernameSnapshot = await getDocs(usernameQuery);
    if (!usernameSnapshot.empty) {
        // If there is any document in the snapshot, the username is already taken
        throw new Error('Username already exists');
    }

    // Query to check if the email already exists
    const emailQuery = query(userRef, where("Email", "==", email));
    const emailSnapshot = await getDocs(emailQuery);
    if (!emailSnapshot.empty) {
        // If there is any document in the snapshot, the email is already taken
        throw new Error('Email already exists');
    }

    // Proceed to create user if both username and email are not taken
    let userObj = {
        userName: userName,
        Password: password,
        Email: email,
        userID: crypto.randomUUID(),
        userCreated:new Date()
    };

    this.setCookie(userObj.userID);
    this.addCookie("userName", userObj.userName);
    return addDoc(userRef, userObj);
}


  loginWithGoogle(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider()
    return signInWithPopup(this._auth, provider)
      .then((result: UserCredential) => {
        console.log(result.user);
        
        return result;
      })
      .catch((error) => {
        alert(error.message);
        throw error;
      });
  }



  async generateUser(userName: string,  email: string, userID: string) {
    const userRef = doc(collection(this._firestore, 'users'), userID); // Using provided userID as document ID
    // const createdTimestamp = new Date();

    let userObj = {
      userName: userName,
      Email: email,
      userID: userID,
    }
    this.addCookie("userName", userObj.userName);
    return setDoc(userRef, userObj)
  }


  setCookie(userID: string) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 15);

    this._cookie.set("userID", userID, expirationDate, '/', undefined, true, 'Strict');
    this._cookie.set("accountType", "Personal", expirationDate, '/', undefined, true, 'Strict');
    console.log('Cookie set:', userID);
  }

  addCookie(cookieName: string, cookieValue:string) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 15);
    this._cookie.set(`${cookieName}`, cookieValue, expirationDate, '/', undefined, true, 'Strict');
    // this._cookie.set("accountType", "Personal", expirationDate, '/', undefined, true, 'Strict');
    // console.log('Cookie set:', cookieName);
  }

  getCookie() {
    const cookieExists = this._cookie.check("userID");
    // console.log('Cookie exists:', cookieExists);
    return cookieExists;
  }

  checkCookie(nameofCookie:string) {
    // console.log("Cookie: " , this._cookie.get(nameofCookie));
    return this._cookie.get(nameofCookie)
  }

  deleteCookie() {

    this._cookie.delete('userID')
    this._cookie.delete("userName")
    window.location.reload()
  }


  getUserDetails() {
    let userRef = collection(this._firestore, 'users')
  }
}