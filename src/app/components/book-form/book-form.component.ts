import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { of } from 'rxjs';
import { Author } from 'src/app/models/author';
import { Book } from 'src/app/models/book';
import { AuthorService } from 'src/app/services/authors/author.service';
import { BookService } from './../../services/books/book.service';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css'],
})
export class BookFormComponent implements OnInit {
  authorService: AuthorService;
  bookService: BookService;
  authors: Author[] = [];

  formBuilder: FormBuilder = new FormBuilder();

  newBook: Book = {
    id: 1,
    title: '',
    author: {
      id: 1,
      firstname: '',
      surname: '',
      age: 0,
    },
  };

  bookForm: FormGroup;

  constructor(authorService: AuthorService, bookService: BookService) {
    this.authorService = authorService;
    this.bookService = bookService;
    this.bookForm = this.formBuilder.group({
      title: '',
      authors: [''],
    });

    of(this.getAuthors()).subscribe((data) => {
      data.subscribe((data2) => {
        this.authors = data2;
      });
      this.bookForm.controls['authors'].patchValue(this.authors[0]);
    });
  }

  ngOnInit(): void {}

  getAuthors() {
    return this.authorService.getUsers();
  }

  onSubmit(): void {
    this.newBook.title = this.bookForm.get('title')?.value;
    this.newBook.author = this.bookForm.get('authors')?.value;

    if (this.newBook.title.trim() != '') {
      this.bookService.addBook(this.newBook).subscribe();
      alert('Le livre a bien été ajouté');

      this.newBook = {
        id: 1,
        title: '',
        author: {
          id: 1,
          firstname: '',
          surname: '',
          age: 0,
        },
      };
    } else {
      alert("L'un des champs n'a pas été renseigné");
    }
  }
}
