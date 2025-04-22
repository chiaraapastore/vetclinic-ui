import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import {Utente} from '../models/utente.model';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  private apiUrl = 'http://localhost:8081/api/utente/user-info';
  constructor(private keycloakService: KeycloakService, private router: Router, private http: HttpClient) {}

  async login(): Promise<void> {
    try {
      await this.keycloakService.login();
      await this.redirectUserByRole();
    } catch (error) {
      console.error('Errore durante il login:', error);
    }
  }

  async getLoggedInUser(): Promise<{ username?: string } | null> {
    try {
      const isAuthenticated = await this.keycloakService.isLoggedIn();
      if (isAuthenticated) {
        const keycloakInstance = this.keycloakService.getKeycloakInstance();
        if (keycloakInstance && keycloakInstance.tokenParsed) {
          const tokenParsed: any = keycloakInstance.tokenParsed;
          const username = tokenParsed.preferred_username;
          return { username };
        }
      }
      return null;
    } catch (error) {
      console.error("Errore durante il recupero dell'utente loggato:", error);
      return null;
    }
  }

  async redirectUserByRole(): Promise<void> {
    const isAuthenticated = await this.keycloakService.isLoggedIn();
    if (isAuthenticated) {
      const roles = this.keycloakService.getUserRoles();

      if (roles.includes('admin')) {
        this.router.navigate(['/admin']);
      } else if (roles.includes('veterinario')) {
        this.router.navigate(['/veterinario']);
      } else if (roles.includes('capo-reparto')) {
        this.router.navigate(['/capo-reparto']);
      }else if (roles.includes('assistente')) {
        this.router.navigate(['/assistente']);
      }else if (roles.includes('cliente')) {
        this.router.navigate(['/cliente']);
      } else {
        this.router.navigate(['/']);
      }
    }
  }

  getUserInfo(): Observable<Utente> {
    return this.http.get<Utente>(this.apiUrl).pipe(
      catchError((err: any) => {
        console.error('Errore nel recupero delle informazioni utente:', err);
        return throwError(() => new Error('Errore durante il recupero dell\'utente'));
      })
    );
  }


  logout(): void {
    const redirectUri = window.location.origin;
    this.keycloakService.logout(redirectUri).catch(error => {
      console.error("Errore durante il logout:", error);
    });
  }
}
