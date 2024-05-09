import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../Services/AuthService/auth.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { NavbarComponent } from "../../Navbar/navbar/navbar.component";

@Component({
    selector: 'app-signup',
    standalone: true,
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.css',
    imports: [RouterLink, FormsModule, ReactiveFormsModule, NavbarComponent]
})
export class SignupComponent {

  private _authService = inject(AuthService);


  signUpForm = new FormGroup({
    userName: new FormControl("", Validators.required),  
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required, Validators.minLength(8)])  
  });

  async signUp() {
    // Check if all required fields are filled (not necessarily valid)
    if (this.signUpForm.invalid) {
        let message = "Please enter all fields correctly.";

        // Detailed checks for each field
        if (this.signUpForm.get('userName')?.hasError('required')) {
            message = "Please enter a username.";
        } else if (this.signUpForm.get('email')?.hasError("required")) {
            message = "Please enter an email address.";
        } else if (this.signUpForm.get('email')?.hasError("email")) {
            message = "Please enter a valid email address.";
        } else if (this.signUpForm.get('password')?.hasError("required")) {
            message = "Please enter a password.";
        } else if (this.signUpForm.get('password')?.hasError("minlength")) {
            message = "Your password must be at least 8 characters long.";
        }

        await Swal.fire({
            position: "center",
            icon: "warning",
            title: message,
            showConfirmButton: false,
            timer: 1200
        });
        return;  // Stop further execution
    }

    // Proceed if the form is valid
    try {
        await this._authService.signUp(this.signUpForm.value.userName!, this.signUpForm.value.email!, this.signUpForm.value.password!);
        await Swal.fire({
            position: "center",
            icon: 'success',
            title: "Account created",
            showConfirmButton: false,
            timer: 1200
        });
        location.reload();
    } catch (error) {
        await Swal.fire({
            position: "center",
            icon: 'error',
            title: "Account already exists",
            showConfirmButton: false,
            timer: 1200
        });
    }
}



  // SignUpWithGoogle() {
  //   this._authService.loginWithGoogle().then((userData) => {
  //     this._authService.setCookie(userData.user.uid);
  //     location.reload();
  //   })
  // }

}
