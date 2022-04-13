import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
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

  constructor(http: HttpClient, private logger: NGXLogger) {
    this.http = http;
  }

  addUser(usr: Author): Observable<Author> {
    this.logger.debug(
      'Adding a new Auhtor : ' + usr.firstname + ' ' + usr.surname
    );
    return this.http
      .post<Author>(this.rootURL + '/authors', usr)
      .pipe(catchError(this.handleError('addAuthor', usr)));
  }

  getUsers(): Observable<Author[]> {
    this.logger.debug('Retrieving Auhtors');
    return this.http
      .get<Author[]>(this.rootURL + '/authors')
      .pipe(catchError(this.handleError<Author[]>('authors', [])));
  }

  getSingleUser(id: number): Observable<Author> {
    this.logger.debug('Retrieving Auhtor By Id : ' + id.toString());
    const url = `${this.rootURL}/authors/${id}`;
    return this.http
      .get<Author>(url)
      .pipe(catchError(this.handleError<Author>('author', new Author())));
  }

  deleteUser(id: number): Observable<Author> {
    this.logger.debug('Deleting Auhtor By Id : ' + id.toString());
    const url = `${this.rootURL}/authors/${id}`;
    return this.http
      .delete<Author>(url)
      .pipe(catchError(this.handleError<Author>('deleteAuthor', new Author())));
  }

  updateUser(id: number, author: Author): Observable<Author> {
    this.logger.debug(
      'Update Auhtor By Id : ' +
        id.toString() +
        ' : ' +
        author.firstname +
        ' ' +
        author.surname
    );
    const url = `${this.rootURL}/authors/${id}`;
    return this.http
      .patch<Author>(url, author)
      .pipe(catchError(this.handleError<Author>('updateAuthor', new Author())));
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
