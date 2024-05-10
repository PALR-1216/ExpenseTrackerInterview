import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from "../../Navbar/navbar/navbar.component";
import { FooterComponent } from "../../Footer/footer/footer.component";

@Component({
    selector: 'app-landing',
    standalone: true,
    templateUrl: './landing.component.html',
    styleUrl: './landing.component.css',
    imports: [RouterLink, NavbarComponent, FooterComponent]
})
export class LandingComponent {

}
