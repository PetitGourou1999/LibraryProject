import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

  constructor(http: HttpClient) {
    this.http = http;
  }

  addBook(book: Book): Observable<Book> {
    return this.http
      .post<Book>(this.rootURL + '/books', book)
      .pipe(catchError(this.handleError('addBook', book)));
  }

  getBooks(): Observable<Book[]> {
    return this.http
      .get<Book[]>(this.rootURL + '/books')
      .pipe(catchError(this.handleError<Book[]>('books', [])));
  }

  getSingleBook(id: number): Observable<Book> {
    const url = `${this.rootURL}/books/${id}`;
    return this.http
      .get<Book>(url)
      .pipe(catchError(this.handleError<Book>('book', new Book())));
  }

  deleteBook(id: number): void {
    const url = `${this.rootURL}/books/${id}`;
    this.http
      .delete<Book>(url)
      .pipe(catchError(this.handleError<Book>('deleteBook', new Book())))
      .subscribe();
  }

  updateBook(id: number, book: Book): Observable<Book> {
    const url = `${this.rootURL}/books/${id}`;
    return this.http
      .patch<Book>(url, book)
      .pipe(catchError(this.handleError<Book>('updateBook', new Book())));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
