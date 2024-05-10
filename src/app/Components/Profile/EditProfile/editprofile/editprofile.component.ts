import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { ProfileService } from '../../../../Services/ProfileService/profile.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editprofile',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './editprofile.component.html',
  styleUrl: './editprofile.component.css'
})
export class EditprofileComponent implements OnInit{

  
  
  uploadedImage: any | ArrayBuffer | null = null;
  userInfo:any = {}
  private _profileService = inject(ProfileService);
  private _router = inject(Router);

  async ngOnInit() {
    await this.getprofileInfo();
    
    
  }



  updateProfile = new FormGroup({
    userName:new FormControl("", Validators.required),
    fullName:new FormControl("", Validators.required),
    Email:new FormControl("", Validators.required),
    oldPassword:new FormControl("",[Validators.required, Validators.minLength(8)]),
    newPassword: new FormControl("", [Validators.required, Validators.minLength(8)]),
    confirmPassword:new FormControl("", [Validators.required, Validators.minLength(8)])
  }, {
    // validators:this.passwordMatchValidator
  })




  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    // Safely check if files exist and the first file is present
    if (element.files && element.files.length > 0) {
      const file = element.files[0];

      if(file){
      const reader = new FileReader();
        reader.onload = () => {
          this.uploadedImage = reader.result; // Assign the result to variable for display
          console.log('FileReader result:', reader.result);

          
        };
        reader.readAsDataURL(file); // Read the file as a Data URL to display as an image
      } else {
        // Optionally handle the case where no file was selected
        console.log('No file selected');

      } 
    }
    
  }

  removePhoto() {
    this.uploadedImage = null;
  }

  getprofileInfo() {
    this._profileService.getUserDetails().then((userData) => {
      // console.log(userData);
      this.userInfo = userData;
    })
  }

  
  

   onSubmit() {
    if(!this.updateProfile.value.userName) {
      this.showAlert("error", "Please enter User Name");
    } else if(!this.updateProfile.value.fullName) {
      this.showAlert("error", "Please enter Full name");
    } else if(!this.updateProfile.value.Email) {
      this.showAlert("error", "Please enter Email");
    }else if (!this.updateProfile.value.oldPassword) {
      this.showAlert("error", "Please enter Old Password");
    } else if(this.updateProfile.value.oldPassword !== this.userInfo.Password) {
      this.showAlert("error", "Password does not match the Old Passsword");
    } else if(!this.updateProfile.value.newPassword || !this.updateProfile.value.confirmPassword) {
      this.showAlert("error", "Please enter both new passwords");
    } else if(this.updateProfile.value.newPassword !== this.updateProfile.value.confirmPassword ) {
      this.showAlert("error", "Confirming password does not match");
    } else if(this.updateProfile.value.oldPassword.length < 8 || this.updateProfile.value.newPassword.length < 8 || this.updateProfile.value.confirmPassword.length < 8) {
      this.showAlert("error", "All password fields must be at least 8 characters long");
    } else {

      const formData = {
        userName: this.updateProfile.value.userName,
        fullName: this.updateProfile.value.fullName,
        userImage:this.uploadedImage || null,
        Email: this.updateProfile.value.Email,
        Password: this.updateProfile.value.newPassword,
        userID:this.userInfo.userID,
        userCreated:this.userInfo.userCreated
      };
      this._profileService.updateUserInfo(formData).then(async() => {
        console.log("data updated");
        await Swal.fire({
          position: "center",
          icon: "success",
          title: "Profile Updated",
          showConfirmButton: false,
          timer: 1200
        });
        this._router.navigate(['/profile']);

      })

    }
    
  }

  private showAlert(icon: any, message: string) {
    Swal.fire({
      icon: icon,
      title: message,
      showConfirmButton: false,
      timer: 1500
    });
  }


}
