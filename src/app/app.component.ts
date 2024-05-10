import { Component, OnInit, inject } from '@angular/core';
import {  RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FooterComponent } from "./Components/Footer/footer/footer.component";
import { NavbarComponent } from "./Components/Navbar/navbar/navbar.component";
import { AuthService } from './Services/AuthService/auth.service';
import { NgClass, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { IStaticMethods } from 'preline';
import { Router, Event, NavigationEnd } from '@angular/router';
declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, FooterComponent, NavbarComponent, NgIf, NgClass, RouterLinkActive, RouterLink, HttpClientModule]
})
export class AppComponent implements OnInit{
  title = 'expensetrackerinterview';
  public isLoading: boolean = false;
  private _authService = inject(AuthService);
  public _router = inject(Router);
  public userName:any = ""
  isAuthenticated: boolean = false;

  async ngOnInit() {

    this._router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          window.HSStaticMethods.autoInit();
        }, 100);
      }
    });



    // this.routerEvent();
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

  isHomeRoute(): boolean {
    return this._router.url === '/home';
  }

  routerEvent() {
    this._router.events.subscribe((event:Event) => {
      if(event instanceof NavigationEnd) {
        setTimeout(() => {
          window.HSStaticMethods.autoInit();
        }, 100);
      }
    })

  }


  async getUserInfo() {


  }
}
