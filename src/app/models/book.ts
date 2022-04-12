import { Author } from './author';

export class Book {
  id: number = 0;
  title: String = '';
  nbexemplaires: number = 0;
  author: Author = new Author();
}
