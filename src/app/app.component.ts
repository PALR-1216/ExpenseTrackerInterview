import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from "./Components/Footer/footer/footer.component";
import { NavbarComponent } from "./Components/Navbar/navbar/navbar.component";
import { AuthService } from './Services/AuthService/auth.service';
import { NgClass, NgIf } from '@angular/common';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, FooterComponent, NavbarComponent, NgIf, NgClass]
})
export class AppComponent implements OnInit{
  title = 'expensetrackerinterview';
  public isLoading: boolean = false;
  private _authService = inject(AuthService);
  public _router = inject(Router);
  public userName:any = ""
  isAuthenticated: boolean = false;

  async ngOnInit() {
    this.isLoading = true 
    try {
      await this.checkToken();
      await this.getUserInfo();
      this.userName = this._authService.checkCookie("userName")


    }catch(error) {
      console.log(error);

    }finally {
      this.isLoading = false;
    }

  }

  logOut() {
    this._authService.deleteCookie();
  }


  async checkToken() {
    this.isAuthenticated = await this._authService.getCookie() ? true : false;
    console.log(this.isAuthenticated);
    if(this.isAuthenticated) {
      this._router.navigate(['/home']);
    } else {
      this._router.navigate(['/landing']);
    }
  }

  async getUserInfo() {


  }
}
