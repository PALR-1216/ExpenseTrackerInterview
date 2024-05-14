import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../../Services/AuthService/auth.service';

@Component({
  selector: 'app-recoveraccount',
  standalone: true,
  imports: [],
  templateUrl: './recoveraccount.component.html',
  styleUrl: './recoveraccount.component.css'
})
export class RecoveraccountComponent implements OnInit{
  private _authService = inject(AuthService);
  ngOnInit() {
    console.log(this._authService.checkCookie("ForgotPasswordToken"))

  }
}
