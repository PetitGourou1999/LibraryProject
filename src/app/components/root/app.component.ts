import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { AuthorService } from 'src/app/services/authors/author.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'LoginProject';

  authorService: AuthorService;
  keycloakService: KeycloakService;
  areBooksEnabled: boolean = false;

  constructor(authorService: AuthorService, keycloakService: KeycloakService) {
    this.authorService = authorService;
    this.keycloakService = keycloakService;
    console.log(this.authorService.getUsers());
    this.authorService.getUsers().subscribe((data) => {
      this.areBooksEnabled = data.length > 0;
    });
  }

  logout() {
    this.keycloakService.logout();
  }
}
