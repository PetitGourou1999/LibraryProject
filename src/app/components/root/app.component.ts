import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { NGXLogger } from 'ngx-logger';
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

  constructor(
    authorService: AuthorService,
    keycloakService: KeycloakService,
    private logger: NGXLogger
  ) {
    this.authorService = authorService;
    this.keycloakService = keycloakService;
    this.authorService.getUsers().subscribe((data) => {
      this.areBooksEnabled = data.length > 0;
    });
    this.logger.debug('AppComponent Test');
  }

  logout() {
    this.keycloakService.logout();
  }
}
