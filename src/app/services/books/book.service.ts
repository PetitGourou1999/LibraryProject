import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { catchError, Observable, of } from 'rxjs';
import { Book } from './../../models/book';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private http: HttpClient;

  rootURL = 'http://localhost:5010';
  headers: HttpHeaders = new HttpHeaders({
    //'Content-Type':  'application/json',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Origin': '*',
  });

  books: Book[] = [];

  constructor(http: HttpClient, private logger: NGXLogger) {
    this.http = http;
  }

  addBook(book: Book): Observable<Book> {
    this.logger.debug(
      'Adding a new Book : ' +
        book.title +
        ' written by : ' +
        book.author.firstname +
        ' ' +
        book.author.surname
    );
    return this.http
      .post<Book>(this.rootURL + '/books', book)
      .pipe(catchError(this.handleError('addBook', book)));
  }

  getBooks(): Observable<Book[]> {
    this.logger.debug('Retrieving Books');
    return this.http
      .get<Book[]>(this.rootURL + '/books')
      .pipe(catchError(this.handleError<Book[]>('books', [])));
  }

  getSingleBook(id: number): Observable<Book> {
    this.logger.debug('Retrieving Book By Id : ' + id.toString());
    const url = `${this.rootURL}/books/${id}`;
    return this.http
      .get<Book>(url)
      .pipe(catchError(this.handleError<Book>('book', new Book())));
  }

  deleteBook(id: number): Observable<Book> {
    this.logger.debug('Deleting Book By Id : ' + id.toString());
    const url = `${this.rootURL}/books/${id}`;
    return this.http
      .delete<Book>(url)
      .pipe(catchError(this.handleError<Book>('deleteBook', new Book())));
  }

  updateBook(id: number, book: Book): Observable<Book> {
    this.logger.debug(
      'Update Book By Id : ' +
        id.toString() +
        ' : ' +
        book.title +
        ' written by : ' +
        book.author.firstname +
        ' ' +
        book.author.surname
    );
    const url = `${this.rootURL}/books/${id}`;
    return this.http
      .patch<Book>(url, book)
      .pipe(catchError(this.handleError<Book>('updateBook', new Book())));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      this.logger.error(error);

      // TODO: better job of transforming error for user consumption
      this.logger.error(`${operation} failed: ${error.message}`);

      if (error.status === 403) {
        throw new Error(
          "Vous n'êtes pas autorisés à effectuer cette opération"
        );
      }

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
