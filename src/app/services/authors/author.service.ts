import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Author } from './../../models/author';
@Injectable({
  providedIn: 'root',
})
export class AuthorService {
  private http: HttpClient;

  rootURL = 'http://localhost:5010';
  headers: HttpHeaders = new HttpHeaders({
    //'Content-Type':  'application/json',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Origin': '*',
  });

  users: Author[] = [];

  constructor(http: HttpClient) {
    this.http = http;
  }

  addUser(usr: Author): Observable<Author> {
    return this.http
      .post<Author>(this.rootURL + '/authors', usr)
      .pipe(catchError(this.handleError('addAuthor', usr)));
  }

  getUsers(): Observable<Author[]> {
    return this.http
      .get<Author[]>(this.rootURL + '/authors')
      .pipe(catchError(this.handleError<Author[]>('authors', [])));
  }

  getSingleUser(id: number): Observable<Author> {
    const url = `${this.rootURL}/authors/${id}`;
    return this.http
      .get<Author>(url)
      .pipe(catchError(this.handleError<Author>('author', new Author())));
  }

  deleteUser(id: number): void {
    const url = `${this.rootURL}/authors/${id}`;
    this.http
      .delete<Author>(url)
      .pipe(catchError(this.handleError<Author>('deleteAuthor', new Author())))
      .subscribe();
  }

  updateUser(id: number, author: Author): Observable<Author> {
    const url = `${this.rootURL}/authors/${id}`;
    return this.http
      .patch<Author>(url, author)
      .pipe(catchError(this.handleError<Author>('updateAuthor', new Author())));
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
