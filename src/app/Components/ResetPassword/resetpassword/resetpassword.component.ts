import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../../Services/AuthService/auth.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { EmailService } from '../../../Services/EmailService/email.service';

@Component({
  selector: 'app-resetpassword',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './resetpassword.component.html',
  styleUrl: './resetpassword.component.css'
})
export class ResetpasswordComponent implements OnInit{
  private _authService = inject(AuthService);
  private _route = inject(ActivatedRoute);
  private _emailService = inject(EmailService);
  userObj:any = {}


  ngOnInit(): void {
    this._authService.getUserDetails(this._route.snapshot.paramMap.get("userID")).then((result) => {
      this.userObj = result;
      console.log(this.userObj);

    })
      
  }

  resetForm = new FormGroup({
    password:new FormControl("", Validators.required),
    confirmPassword:new FormControl("", Validators.required),
  })


  async resetPassword() {
    if(!this.resetForm.value.password || !this.resetForm.value.confirmPassword) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "Please enter input Fields",
        showConfirmButton: false,
        timer: 1500
      });

    }  else if(this.resetForm.value.password != this.resetForm.value.confirmPassword) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "Both fields must match",
        showConfirmButton: false,
        timer: 1500
      });

    } else {
      this._emailService.updatePassword(this.userObj.userID, this.resetForm.value.password);

      await Swal.fire({
        position: "center",
        icon: "success",
        title: "Password Reset Successfully please login",
        showConfirmButton: false,
        timer: 1500
      });
      location.reload();
    }

  }


}
