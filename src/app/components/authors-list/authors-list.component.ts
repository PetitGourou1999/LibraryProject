import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { catchError, Observable, of } from 'rxjs';
import { AuthorService } from 'src/app/services/authors/author.service';
import { Author } from '../../models/author';

@Component({
  selector: 'app-authors-list',
  templateUrl: './authors-list.component.html',
  styleUrls: ['./authors-list.component.css'],
})
export class AuthorsListComponent implements OnInit {
  userService: AuthorService;

  listUsers: Author[] = [];
  userData: Author = {
    id: 1,
    firstname: '',
    surname: '',
    age: 0,
  };

  formBuilder: FormBuilder = new FormBuilder();
  editForm = this.formBuilder.group({
    firstname: '',
    surname: '',
    age: 0,
  });

  constructor(userService: AuthorService) {
    this.userService = userService;
    this.updateUserlist();
  }

  ngOnInit(): void {}

  editUser(id: number) {
    this.userService
      .getSingleUser(id)
      .pipe(catchError(this.handleError<Author>(new Author())))
      .subscribe((data) => {
        this.userData = data;
        this.editForm.controls['firstname'].setValue(this.userData.firstname);
        this.editForm.controls['surname'].setValue(this.userData.surname);
        this.editForm.controls['age'].setValue(this.userData.age);
      });
  }

  deleteUser(id: number) {
    this.userService
      .getSingleUser(id)
      .pipe(catchError(this.handleError<Author>(new Author())))
      .subscribe((data) => {
        this.userData = data;
      });
  }

  onSubmitDelete() {
    this.userService
      .deleteUser(this.userData.id)
      .pipe(catchError(this.handleError<Author>(new Author())))
      .subscribe((data) => {
        this.updateUserlist();
      });
  }

  onSubmitEdit(): void {
    this.userData.age = this.editForm.get('age')?.value;
    this.userData.firstname = this.editForm.get('firstname')?.value;
    this.userData.surname = this.editForm.get('surname')?.value;

    if (
      this.userData.age != 0 &&
      this.userData.firstname.trim() != '' &&
      this.userData.surname.trim() != ''
    ) {
      this.userService
        .updateUser(this.userData.id, this.userData)
        .pipe(catchError(this.handleError<Author>(new Author())))
        .subscribe((data) => {
          this.userData = {
            id: 1,
            firstname: '',
            surname: '',
            age: 0,
          };
          this.updateUserlist();
        });
    } else {
      alert("L'un des champs n'a pas été renseigné");
    }
  }

  updateUserlist(): void {
    this.userService
      .getUsers()
      .pipe(catchError(this.handleError<Author[]>([])))
      .subscribe((data) => {
        this.listUsers = data;
      });
  }

  private handleError<T>(result?: T) {
    return (error: any): Observable<T> => {
      alert("Vous n'avez pas les droits pour effectuer cette opération");

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
