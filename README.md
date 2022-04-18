# LibraryProject

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.2.6.

## Présentation

Ce projet à pour but de présenter aux utilisateurs une interface web permettant de réaliser des opération CRUD sur une base de données de livres et d'auteurs. Ce projet a été réalisé à l'aide du framework Angular et de Bootstrap afin d'appliquer facilement des styles aux différents composants de l'UI.

Afin d'accéder à l'application, il est nécessaire d'avoir un compte utilisateur dans Keycloak. Nous devons pour cela initialiser la liaison avec Keycloak comme suit :

```
export function initializeKeycloak(
  keycloak: KeycloakService
): () => Promise<boolean> {
  return () =>
    keycloak.init({
      config: {
        url: 'http://localhost:8080' + '/auth',
        realm: 'MonSuperRoyaume',
        clientId: 'MyApplicationAngular',
      },
      initOptions: {
        /*onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '../../assets/silent-check-sso.html',*/
        onLoad: 'login-required',
        flow: 'standard',
        checkLoginIframe: true,
      },
    });
}
```

Contenu du fichier assets/silent-check-sso.html :

```
<html>

<body>
    <script>
        parent.postMessage(location.href, location.origin);
    </script>
</body>

</html>
```

Lorsque l'on voudra accéder à l'application, on se retrouvera face à la mire de connexion Keycloak :

<img width="884" alt="image" src="https://user-images.githubusercontent.com/56508650/163791432-5931b131-1888-4201-a322-2ab9bc260fbe.png">

Grâce à la classe AuthGuard, on peut, sur chaque page, invoquer la mire de connexion et avoir accès aux droits de l'utilisateur et, dans le cas où il n'a pas les droits d'accéder à la page (création de livre ou d'auteur pour les utilisateurs ayant le rôle "simple-user"), afficher une UI spécifique :

```
@Injectable({
  providedIn: 'root',
})
export class AuthGuard extends KeycloakAuthGuard {
  constructor(
    protected override readonly router: Router,
    protected readonly keycloak: KeycloakService
  ) {
    super(router, keycloak);
  }

  async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    if (!this.authenticated) {
      await this.keycloak.login({
        redirectUri: window.location.origin + state.url,
      });
    }

    const requiredRoles = route.data['roles'];

    if (!(requiredRoles instanceof Array) || requiredRoles.length == 0) {
      return true;
    }

    if (!requiredRoles.every((role) => this.roles.includes(role))) {
      this.router.navigate(['/not-authorized']);
      return false;
    } else {
      return true;
    }
  }
}
```

Voici la page en question :

<img width="1788" alt="image" src="https://user-images.githubusercontent.com/56508650/163792661-7e6283d7-b324-46f0-afb3-e84de5d12c8a.png">

Dans le fichier app-routong.module.ts, on n'a alors plus qu'à spéciier qui peut accéder à quelle page :

```
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
```

On pourra ensuite consulter la liste des auteurs :

<img width="1788" alt="image" src="https://user-images.githubusercontent.com/56508650/163791570-6bf2caea-2e56-48c9-8443-9152374e5d22.png">

On peut également créer des auteurs :

<img width="1788" alt="image" src="https://user-images.githubusercontent.com/56508650/163791685-0635e6eb-8fbb-49bd-9f5c-5ecf3a3d1d95.png">

Et on retrouve des interfaces analogues pour créer des livres ou en consulter la liste :

<img width="1788" alt="image" src="https://user-images.githubusercontent.com/56508650/163791759-3654f87a-a061-4e7c-b2f4-843211931d15.png">

<img width="1788" alt="image" src="https://user-images.githubusercontent.com/56508650/163791799-2d3776f8-b48a-4210-9c2b-21ad69f5790d.png">

## Envoi de logs

Afin de centraliser les logs de l'application grâce à la stack ELK, nous utilisons NGXLogger que nous configurons comme suit pour envoyer les logs vers Logstash sur le port 5001 :

```
@NgModule({
  declarations: [
    AppComponent,
    AuthorsFormComponent,
    AuthorsListComponent,
    BookFormComponent,
    BookListComponent,
    NotAuthorizedComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    KeycloakAngularModule,
    HttpClientModule,
    LoggerModule.forRoot({
      serverLoggingUrl: 'http://localhost:5001/', // Replace with YOUR API
      level: NgxLoggerLevel.TRACE,
      serverLogLevel: NgxLoggerLevel.TRACE,
      disableConsoleLogging: false,
    }),
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
  ],
  bootstrap: [AppComponent],
})



