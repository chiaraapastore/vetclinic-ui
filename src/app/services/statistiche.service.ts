import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatisticheService {
  private apiUrl = 'http://localhost:8081/api/statistiche';

  constructor(private http: HttpClient) {}


  getConsumiNelTempo(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/consumi`);
  }

  getRiordiniStockout(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/riordini`);
  }

  getDistribuzionePerReparto(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/distribuzione-reparti`);
  }
}
