import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { Author } from 'src/app/models/author';
import { Book } from 'src/app/models/book';
import { AuthorService } from 'src/app/services/authors/author.service';
import { BookService } from './../../services/books/book.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
})
export class BookListComponent implements OnInit {
  authorService: AuthorService;
  bookService: BookService;

  listBooks: Book[] = [];
  authors: Author[] = [];

  bookData: Book = {
    id: 1,
    title: '',
    nbexemplaires: 0,
    author: {
      id: 1,
      firstname: '',
      surname: '',
      age: 0,
    },
  };

  formBuilder: FormBuilder = new FormBuilder();
  editForm = this.formBuilder.group({
    title: '',
    nbexemplaires: 0,
    authors: [''],
  });

  constructor(authorService: AuthorService, bookService: BookService) {
    this.authorService = authorService;
    this.bookService = bookService;

    of(this.getAuthors()).subscribe((data) => {
      data.subscribe((data2) => {
        this.authors = data2;
      });
      this.editForm.controls['authors'].patchValue(this.authors[0]);
    });

    this.updateBooklist();
  }

  ngOnInit(): void {}

  getAuthors() {
    return this.authorService.getUsers();
  }

  editBook(id: number) {
    this.bookService.getSingleBook(id).subscribe((data) => {
      this.bookData = data;
      this.editForm.controls['title'].setValue(this.bookData.title);
      this.editForm.controls['nbexemplaires'].setValue(
        this.bookData.nbexemplaires
      );
      this.editForm.controls['authors'].patchValue(this.authors[0]);
    });
  }

  deleteBook(id: number) {
    this.bookService.getSingleBook(id).subscribe((data) => {
      this.bookData = data;
    });
  }

  onSubmitDelete() {
    this.bookService.deleteBook(this.bookData.id).subscribe((data) => {
      this.updateBooklist();
    });
  }

  onSubmitEdit(): void {
    this.bookData.title = this.editForm.get('title')?.value;
    this.bookData.nbexemplaires = this.editForm.get('nbexemplaires')?.value;
    this.bookData.author = this.editForm.get('authors')?.value;

    if (this.bookData.title.trim() != '' && this.bookData.nbexemplaires >= 0) {
      this.bookService
        .updateBook(this.bookData.id, this.bookData)
        .subscribe((data) => {
          this.bookData = {
            id: 1,
            title: '',
            nbexemplaires: 0,
            author: {
              id: 1,
              firstname: '',
              surname: '',
              age: 0,
            },
          };
          alert('Le livre a bien été modifié');
          this.updateBooklist();
        });
    } else {
      alert("L'un des champs n'a pas été renseigné");
    }
  }

  updateBooklist(): void {
    this.bookService.getBooks().subscribe((data) => {
      this.listBooks = data;
    });
  }

  onClickExemplaire(count: number, id: number): void {
    this.bookService.getSingleBook(id).subscribe((data) => {
      this.bookData = data;
      if (!(count == -1 && this.bookData.nbexemplaires == 0)) {
        this.bookData.nbexemplaires += count;
      }

      this.bookService
        .updateBook(this.bookData.id, this.bookData)
        .subscribe((data) => {
          this.bookData = {
            id: 1,
            title: '',
            nbexemplaires: 0,
            author: {
              id: 1,
              firstname: '',
              surname: '',
              age: 0,
            },
          };

          this.updateBooklist();
        });
    });
  }
}
