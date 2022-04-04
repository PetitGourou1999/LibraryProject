import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthorService } from '../../services/authors/author.service';
import { Author } from './../../models/author';

@Component({
  selector: 'app-authors-form',
  templateUrl: './authors-form.component.html',
  styleUrls: ['./authors-form.component.css'],
})
export class AuthorsFormComponent implements OnInit, OnDestroy {
  userService: AuthorService;
  formBuilder: FormBuilder = new FormBuilder();
  newUser: Author = {
    id: 1,
    firstname: '',
    surname: '',
    age: 0,
  };

  userForm = this.formBuilder.group({
    firstname: '',
    surname: '',
    age: 0,
  });

  constructor(userService: AuthorService) {
    this.userService = userService;
  }

  ngOnDestroy(): void {
    this.newUser = {
      id: 1,
      firstname: '',
      surname: '',
      age: 0,
    };
  }

  ngOnInit(): void {}

  onSubmit(): void {
    this.newUser.age = this.userForm.get('age')?.value;
    this.newUser.firstname = this.userForm.get('firstname')?.value;
    this.newUser.surname = this.userForm.get('surname')?.value;

    if (
      this.newUser.age != 0 &&
      this.newUser.firstname.trim() != '' &&
      this.newUser.surname.trim() != ''
    ) {
      this.userService.addUser(this.newUser).subscribe();
      alert("L'utilisateur a bien été ajouté");

      this.newUser = {
        id: 1,
        firstname: '',
        surname: '',
        age: 0,
      };
    } else {
      alert("L'un des champs n'a pas été renseigné");
    }
  }
}
