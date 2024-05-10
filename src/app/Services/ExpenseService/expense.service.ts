import { Injectable, inject } from '@angular/core';
import { AuthService } from '../AuthService/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  constructor() { }

  public _authService = inject(AuthService);
  
}
