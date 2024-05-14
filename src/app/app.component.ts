import { Component, OnInit, inject } from '@angular/core';
import {  RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FooterComponent } from "./Components/Footer/footer/footer.component";
import { NavbarComponent } from "./Components/Navbar/navbar/navbar.component";
import { AuthService } from './Services/AuthService/auth.service';
import { NgClass, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { IStaticMethods } from 'preline';
import { Router, Event, NavigationEnd } from '@angular/router';
import { ExpenseService } from './Services/ExpenseService/expense.service';
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
  private _expenseCategoryService = inject(ExpenseService);
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
      this.userName = this._authService.checkCookie("userName")
      await this.checkToken();
      await this.getUserInfo();
      this.loadExpenseCategoryList();
      


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
    console.log('Authenticated:', this.isAuthenticated);
    console.log('Current Route:', this._router.url);

    // Direct check for the /forgotPassword route
    const isPasswordRecoveryRoute = this._router.url.startsWith('/RecoverAccount');
    console.log('Is Password Recovery Route:', isPasswordRecoveryRoute);

    // Handling based on the route and authentication status
    if (isPasswordRecoveryRoute) {
        if (!this.isAuthenticated) {
            // Redirect to the password recovery component if not authenticated
            this._router.navigate(['/RecoverAccount']);  // Assuming '/password-recovery' is your intended target
        } else {
            // Redirect authenticated users away from the forgot password page (usually to the home page)
            this._router.navigate(['/home']);
        }
    } else {
        // Handling for other routes
        if (this.isAuthenticated) {
            this._router.navigate(['/home']);
        } else {
            this._router.navigate(['/landing']);
        }
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

  loadExpenseCategoryList() {
    this._expenseCategoryService.getAllCategories().then((Data:any) => {
      this._expenseCategoryService.allCategorysArray = Data;
    })
  }



  async getUserInfo() {
    


  }
}
