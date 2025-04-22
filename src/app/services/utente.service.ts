import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
import {Utente} from '../models/utente.model';

export interface TokenRequest {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class UtenteService {
  private apiUrl = 'http://localhost:8081/api/utente';

  constructor(private http: HttpClient, private keycloakService: KeycloakService) {}


  loginUser(tokenRequest: TokenRequest): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/login`, tokenRequest);
  }


  createUser(utente: Utente): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, utente);
  }


  getUserInfo(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user-info`);
  }


  getUtenteByEmail(email: string): Observable<Utente> {
    return this.http.get<Utente>(`${this.apiUrl}/utenti/${email}`);
  }


  updateUtente(id: number, utenteDetails: Utente): Observable<Utente> {
    return this.http.put<Utente>(`${this.apiUrl}/utenti/${id}`, utenteDetails);
  }


  deleteUtente(username: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${username}`);
  }

  uploadProfileImage(id: number, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<string>(`${this.apiUrl}/upload-profile-image/${id}`, formData);
  }

  getUserDetailsDataBase(): Observable<Utente> {
    return this.http.get<Utente>(`${this.apiUrl}/userDetailsDataBase`);
  }


  checkUserExists(username: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/exists?username=${username}`);
  }
}
