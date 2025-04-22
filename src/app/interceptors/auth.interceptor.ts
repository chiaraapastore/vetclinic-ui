import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
import { switchMap, catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private keycloakService: KeycloakService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!isPlatformBrowser(this.platformId)) {
      return next.handle(req);
    }

    return from(this.keycloakService.getToken()).pipe(
      switchMap(token => {
        const clonedRequest = token
          ? req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          })
          : req;
        return next.handle(clonedRequest);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error("Errore durante l'intercettazione della richiesta:", error);
        return throwError(() => new Error('Errore HTTP: ' + error.message));
      })
    );
  }
}
