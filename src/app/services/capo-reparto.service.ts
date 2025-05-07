import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reparto } from '../models/reparto.model';
import { Medicine } from '../models/medicine.model';
import { Ferie } from '../models/ferie.model';

@Injectable({
  providedIn: 'root'
})
export class CapoRepartoService {

  private apiUrl = 'http://localhost:8081/api/capo-reparto';

  constructor(private http: HttpClient) {}

  getReparti(): Observable<Reparto[]> {
    return this.http.get<Reparto[]>(`${this.apiUrl}/reparti`);
  }

  aggiungiMedicinale(medicinale: Medicine): Observable<string> {
    return this.http.post(`${this.apiUrl}/aggiungi-medicinale`, medicinale, { responseType: 'text' });
  }


  richiediFerie(utenteId: number, startDate: string, endDate: string): Observable<{ message: string }> {
    const params = new HttpParams()
      .set('utenteId', utenteId)
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.http.post<{ message: string }>(`${this.apiUrl}/richiedi-ferie`, null, { params });
  }


  approvaFerie(ferieId: number): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/approva-ferie/${ferieId}`, null);
  }


  getFerieApprovate(repartoId: number): Observable<{ ferie: Ferie[] }> {
    const params = new HttpParams().set('repartoId', repartoId);
    return this.http.get<{ ferie: Ferie[] }>(`${this.apiUrl}/ferie-approvate`, { params });
  }


  getFerieNonApprovate(repartoId: number): Observable<{ ferie: Ferie[] }> {
    const params = new HttpParams().set('repartoId', repartoId);
    return this.http.get<{ ferie: Ferie[] }>(`${this.apiUrl}/ferie-non-approvate`, { params });
  }

  updateStockAndSendReport(magazine: any): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/magazine/update-stock-and-report`, magazine);
  }




}
