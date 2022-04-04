import { Component } from '@angular/core';
import { AuthorService } from 'src/app/services/authors/author.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'LoginProject';

  authorService: AuthorService;
  areBooksEnabled: boolean = false;

  constructor(authorService: AuthorService) {
    this.authorService = authorService;
    console.log(this.authorService.getUsers());
    this.authorService.getUsers().subscribe((data) => {
      this.areBooksEnabled = data.length > 0;
    });
  }
}
