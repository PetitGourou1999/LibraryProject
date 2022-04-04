import { Author } from './author';

export class Book {
  id: number = 0;
  title: String = '';
  author: Author = new Author();
}
