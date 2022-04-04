export class Author {
  id: number = 0;
  firstname: String = '';
  surname: String = '';
  age: number = 0;

  static fromJSON(json: any) {
    const user: Author = new Author();
    user.id = json.id;
    user.firstname = json.firstname;
    user.surname = json.surname;
    user.age = json.age;

    return user;
  }
}
