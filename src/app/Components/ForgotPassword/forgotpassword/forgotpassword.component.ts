import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { EmailService } from '../../../Services/EmailService/email.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../../../Services/AuthService/auth.service';
import { Firestore, addDoc, collection, where } from '@angular/fire/firestore';
import { query } from '@angular/animations';

@Component({
  selector: 'app-forgotpassword',
  standalone: true,
  imports: [HttpClientModule, FormsModule, ReactiveFormsModule],
  templateUrl: './forgotpassword.component.html',
  styleUrl: './forgotpassword.component.css'
})
export class ForgotpasswordComponent {
  private _emailService = inject(EmailService);
  private _authService = inject(AuthService);
  private _firestore = inject(Firestore);

  forgotPasswordForm = new FormGroup({
    email:new FormControl("", Validators.required)
  })

  sendEmail() {
    this._emailService.verifyEmail(this.forgotPasswordForm.value.email).then((result) => {
      let passwordToken = crypto.randomUUID();
      if(result) {
        this._emailService.send(result["Email"], passwordToken).then(async() => {
          await Swal.fire({
            position: "center",
            icon: "success",
            title: `Password Recovery email sent to ${result["Email"]}`,
            showConfirmButton: false,
            timer: 1500
          });
          const expiresAt = new Date();
          expiresAt.setMinutes(expiresAt.getMinutes() + 10);
          this.storeTokenInDB(result["userID"], passwordToken, expiresAt)
        })


      } else {

        Swal.fire({
          position: "center",
          icon: "warning",
          title: `No Email found for ${this.forgotPasswordForm.value.email}`,
          showConfirmButton: false,
          timer: 1500
        });

      }

    }).catch((error) => {
      Swal.fire({
        title:"Email is not valid",
        icon:"error",
        showCancelButton:false,
        timer:1200,
      })
      console.log(error.message);
    })
  }

  storeTokenInDB(userID:any, token:any, expirationDate:any) {
    let ref = collection(this._firestore, "ForgotPassword");
    let obj = {
      token:token,
      userID:userID,
      createdAt:new Date(),
      expirationDate:expirationDate
    }
    return addDoc(ref ,obj)

  }

}
