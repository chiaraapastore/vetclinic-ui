import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Appuntamento} from '../models/appuntamento.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private baseUrl = 'http://localhost:8081/api/cliente';
  private appuntamentiUrl = 'http://localhost:8081/api/appuntamenti';

  constructor(private http: HttpClient) {}

  getAnimaliCliente(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/animals`);
  }

  getFattureCliente(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/fatture`);
  }

  downloadDocumentoClinico(animalId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/animals/${animalId}/download-pdf`, {
      responseType: 'blob'
    });
  }

  getDatiCliente(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/me`);
  }

  aggiornaProfiloCliente(id: number, form: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${id}`, null, {
      params: form
    });
  }

  getAppuntamentiCliente(): Observable<Appuntamento[]> {
    return this.http.get<Appuntamento[]>(`${this.appuntamentiUrl}/cliente/miei-appuntamenti`);
  }

}
