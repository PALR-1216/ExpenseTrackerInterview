import { Component, OnInit, inject } from '@angular/core';
import { ProfileService } from '../../../Services/ProfileService/profile.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, NgIf, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  public isLoading = false;
  private _profileService = inject(ProfileService);
  public profileData:any = {}

  async ngOnInit() {
    try {
      this.isLoading = true 
      await this.fetchUserInfo();
      
    } catch (error) {
      
    }finally {
      this.isLoading = false
    }
      
  }



  async fetchUserInfo(): Promise<void> {
    try {
      const userData = await this._profileService.getUserDetails();
      this.profileData = userData;
      // console.log(this.profileData); // Logging for debugging, consider removing for production
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      // Implement error handling logic, maybe set an error state to inform the user
    } 
  }

}
