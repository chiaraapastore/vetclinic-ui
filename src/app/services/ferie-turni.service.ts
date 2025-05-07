import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FerieTurniService {

  private urlFerie = 'http://localhost:8081/api/ferie';
  private urlTurni = 'http://localhost:8081/api/turni';
  constructor(private http: HttpClient) {}

  getFerieUtente(startDate: string, endDate: string): Observable<any[]> {
    const params = {
      startDate: startDate,
      endDate: endDate
    };
    return this.http.get<any[]>(`${this.urlFerie}/mie-ferie`, { params });
  }

  getTurniUtente(): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlTurni}/miei-turni`);
  }
}
