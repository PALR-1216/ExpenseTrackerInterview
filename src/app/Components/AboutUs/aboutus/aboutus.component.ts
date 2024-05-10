import { Component } from '@angular/core';
import { NavbarComponent } from "../../Navbar/navbar/navbar.component";
import { FooterComponent } from "../../Footer/footer/footer.component";

@Component({
    selector: 'app-aboutus',
    standalone: true,
    templateUrl: './aboutus.component.html',
    styleUrl: './aboutus.component.css',
    imports: [NavbarComponent, FooterComponent]
})
export class AboutusComponent {

}
