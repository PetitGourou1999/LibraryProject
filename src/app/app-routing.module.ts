import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorsFormComponent } from './components/authors-form/authors-form.component';
import { AuthorsListComponent } from './components/authors-list/authors-list.component';
import { BookFormComponent } from './components/book-form/book-form.component';
import { BookListComponent } from './components/book-list/book-list.component';

const routes: Routes = [
  { path: 'authors/create', component: AuthorsFormComponent },
  { path: 'authors/list', component: AuthorsListComponent },
  { path: 'books/create', component: BookFormComponent },
  { path: 'books/list', component: BookListComponent },
  { path: '**', component: AuthorsFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
