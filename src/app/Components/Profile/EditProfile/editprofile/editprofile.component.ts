import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { ProfileService } from '../../../../Services/ProfileService/profile.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../Services/AuthService/auth.service';

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
  private _authService = inject(AuthService);
  private _router = inject(Router);

  async ngOnInit() {
    await this.getprofileInfo();
    
    
  }



  updateProfile = new FormGroup({
    userName:new FormControl(""),
    fullName:new FormControl(""),
    Email:new FormControl(""),
    oldPassword:new FormControl("",[ Validators.minLength(8)]),
    newPassword: new FormControl("", [ Validators.minLength(8)]),
    confirmPassword:new FormControl("", [ Validators.minLength(8)])
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
    console.log("Attempting to update profile...");
  
    // Check if old password is provided and handle potentially null values safely
    if (this.updateProfile.value.oldPassword) {
      console.log("Old Password provided.");
  
      if (this.updateProfile.value.oldPassword !== this.userInfo.Password) {
        console.log("Old password does not match.");
        this.showAlert("error", "Password does not match the Old Password");
        return;  // Exit if old password does not match
      }
  
      // Check both new passwords are provided before comparing them or checking their length
      if (!this.updateProfile.value.newPassword || !this.updateProfile.value.confirmPassword) {
        console.log("New passwords incomplete.");
        this.showAlert("error", "Please enter both new passwords");
        return;  // Exit if any new password field is empty
      }
  
      if (this.updateProfile.value.newPassword !== this.updateProfile.value.confirmPassword) {
        console.log("New passwords do not match.");
        this.showAlert("error", "Confirming password does not match");
        return;  // Exit if new passwords do not match
      }
  
      // Ensure passwords are long enough if provided
      if ((this.updateProfile.value.oldPassword && this.updateProfile.value.oldPassword.length < 8) ||
          (this.updateProfile.value.newPassword && this.updateProfile.value.newPassword.length < 8) ||
          (this.updateProfile.value.confirmPassword && this.updateProfile.value.confirmPassword.length < 8)) {
        console.log("Password length requirement not met.");
        this.showAlert("error", "All password fields must be at least 8 characters long");
        return;  // Exit if any password is too short
      }
    }
  
    // Construct formData, only update password if new password has been set
    const formData = {
      userName: this.updateProfile.value.userName || this.userInfo.userName,
      fullName: this.updateProfile.value.fullName || this.userInfo.fullName,
      userImage: this.uploadedImage || null,
      Email: this.updateProfile.value.Email || this.userInfo.Email,
      Password: this.updateProfile.value.newPassword || this.userInfo.Password,  // Use new password if provided
      userID: this.userInfo.userID,
      userCreated: this.userInfo.userCreated
    };
  
    console.log("Form data prepared, updating user info...");
  
    this._profileService.updateUserInfo(formData).then(async () => {
      console.log("Data updated successfully.");
      this._authService.updateUserName(formData.userName);
  
      await Swal.fire({
        position: "center",
        icon: "success",
        title: "Profile Updated",
        showConfirmButton: false,
        timer: 1200
      });
  
      // this._router.navigate(['/profile']);
      location.reload();
    });
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
