import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../Services/AuthService/auth.service';
import { Router, RouterLink } from '@angular/router';
import { EmailService } from '../../../Services/EmailService/email.service';

@Component({
  selector: 'app-recoveraccount',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './recoveraccount.component.html',
  styleUrls: ['./recoveraccount.component.css']
})
export class RecoveraccountComponent implements OnInit {
  verificationForm: FormGroup;
  private _emailService = inject(EmailService);
  private _router = inject(Router);

  constructor(private authService: AuthService) {
    this.verificationForm = new FormGroup({
      digit1: new FormControl(''),
      digit2: new FormControl(''),
      digit3: new FormControl(''),
      digit4: new FormControl(''),
    });
  }

  ngOnInit(): void {}

  verifyCode() {
    if (this.verificationForm.valid) {
      const code = Object.values(this.verificationForm.value).join('');
      console.log('Submitting code:', code);
      this._emailService.verifyOTP(Number(code)).then((result) => {
        this._router.navigate(['/ResetPassword', result.userID])
      })
    } else {
      console.log('Form is not valid:', this.verificationForm.errors);
    }
  }

  onKeyup(currentInput: HTMLInputElement, nextInput?: HTMLInputElement): void {
    if (nextInput && currentInput.value.length === 1) {
      nextInput.focus();
    }
  }
}
