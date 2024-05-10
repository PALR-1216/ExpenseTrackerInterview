import { Component, inject } from '@angular/core';
import { NavbarComponent } from "../../Navbar/navbar/navbar.component";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../Services/AuthService/auth.service';
import { FooterComponent } from "../../Footer/footer/footer.component";

@Component({
    selector: 'app-login',
    standalone: true,
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
    imports: [NavbarComponent, FormsModule, ReactiveFormsModule, RouterLink, FooterComponent]
})
export class LoginComponent {
  private _authService = inject(AuthService);

  loginUserForm = new FormGroup({
    userName: new FormControl('', [Validators.required]),  
    password: new FormControl('', [Validators.required])  
  });


  //login user 
  async login() {
    const userName = this.loginUserForm.value.userName;
    const password = this.loginUserForm.value.password;
  
    // Validate form
    if (userName && password) {
      try {
        // Await the login function from the auth service
        const userData = await this._authService.login(userName, password);
  
        // Proceed with setting the cookie and showing success message
        this._authService.addCookie("userName", userData.userName)
        this._authService.setCookie(userData.userID);
        await Swal.fire({
          position: "center",
          icon: "success",
          title: "Login Successful",
          showConfirmButton: false,
          timer: 1200
        });
  
        // Reload the page after showing the Swal
        location.reload();
  
      } catch (error:any) {
        console.error("Login failed:", error);
        await Swal.fire({
          position: "center",
          icon: "error",
          title: error.message,
          showConfirmButton: false,
          timer: 1200
        });
      }
    } else {
      await Swal.fire({
        position: "center",
        icon: "warning",
        title: "Please enter all fields",
        showConfirmButton: false,
        timer: 1200
      });
    }
  }
  
  

}
