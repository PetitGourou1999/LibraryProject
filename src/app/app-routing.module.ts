import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorsFormComponent } from './components/authors-form/authors-form.component';
import { AuthorsListComponent } from './components/authors-list/authors-list.component';
import { BookFormComponent } from './components/book-form/book-form.component';
import { BookListComponent } from './components/book-list/book-list.component';
import { NotAuthorizedComponent } from './components/not-authorized/not-authorized.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  {
    path: 'authors/create',
    component: AuthorsFormComponent,
    canActivate: [AuthGuard],
    data: { roles: ['simple-admin'] },
  },
  {
    path: 'authors/list',
    component: AuthorsListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['simple-user'] },
  },
  {
    path: 'books/create',
    component: BookFormComponent,
    canActivate: [AuthGuard],
    data: { roles: ['simple-admin'] },
  },
  {
    path: 'books/list',
    component: BookListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['simple-user'] },
  },
  {
    path: 'not-authorized',
    component: NotAuthorizedComponent,
  },
  { path: '**', redirectTo: 'authors/list' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
