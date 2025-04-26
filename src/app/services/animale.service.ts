import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Animale } from '../models/animale.model';

@Injectable({
  providedIn: 'root'
})
export class AnimaleService {
  private apiUrl = 'http://localhost:8081/api/animali';

  constructor(private http: HttpClient) {}

  getAnimalsOfClient(): Observable<Animale[]> {
    return this.http.get<Animale[]>(`${this.apiUrl}/cliente`);
  }

  getAnimaleById(animaleId: number): Observable<Animale> {
    return this.http.get<Animale>(`${this.apiUrl}/${animaleId}`);
  }

  addAnimale(animale: Animale): Observable<Animale> {
    return this.http.post<Animale>(`${this.apiUrl}/add`, animale);
  }


  updateAnimale(animaleId: number, animaleDetails: Animale): Observable<Animale> {
    return this.http.put<Animale>(`${this.apiUrl}/update/${animaleId}`, animaleDetails);
  }

  deleteAnimale(animaleId: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/delete/${animaleId}`);
  }

  downloadMedicalRecord(animaleId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download-cartella-clinica/${animaleId}`, { responseType: 'blob' });
  }

}
