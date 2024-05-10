import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../Services/AuthService/auth.service';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { NavbarComponent } from "../../Navbar/navbar/navbar.component";
import { FooterComponent } from "../../Footer/footer/footer.component";

@Component({
    selector: 'app-signup',
    standalone: true,
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.css',
    imports: [RouterLink, FormsModule, ReactiveFormsModule, NavbarComponent, FooterComponent]
})
export class SignupComponent {

  private _authService = inject(AuthService);


  signUpForm = new FormGroup({
    userName: new FormControl("", Validators.required),
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl("", Validators.required),
  }, {validators:this.passwordMatcherValidator()});


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
        } else if(this.signUpForm.get("confirmPassword")?.hasError("required")) {
          message = "Please confirm password";
        }else if(this.signUpForm.errors?.["passwordMismatch"]) {
          message = "Passwords do not match";
        }
  

        await Swal.fire({
            position: "center",
            icon: "warning",
            title: message,
            showConfirmButton: false,
            timer: 1200
        });
        return;  // Stop  execution
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

  private passwordMatcherValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control instanceof FormGroup) {  // Check if the control is a FormGroup
        const password = control.get('password')?.value;
        const confirmPassword = control.get('confirmPassword')?.value;
        if (password !== confirmPassword) {
          // Return an error if passwords don't match
          return { passwordMismatch: true };
        }
      }
      // Return null if there is no error
      return null;
    };
  }






  // SignUpWithGoogle() {
  //   this._authService.loginWithGoogle().then((userData) => {
  //     this._authService.setCookie(userData.user.uid);
  //     location.reload();
  //   })
  // }

}
