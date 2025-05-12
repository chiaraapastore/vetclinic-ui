import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import { Reparto } from '../models/reparto.model';
import { Medicine } from '../models/medicine.model';
import { Ferie } from '../models/ferie.model';
import {Animale} from '../models/animale.model';
import {CronologiaAnimale} from '../models/cronologia-animale.model';
import {environment} from '../environments/environment';
import {Magazzino} from '../models/magazzino.model';

@Injectable({
  providedIn: 'root'
})
export class CapoRepartoService {

  private apiUrl = 'http://localhost:8081/api/capo-reparto';
  private urlUtente = 'http://localhost:8081/api/utente';
  private stockUrl = 'http://localhost:8081/api/stock';

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
    return this.http.get<{ ferie: Ferie[] }>(`${this.apiUrl}/ferie-non-approvate-capo`, { params });
  }

  rifiutaFerie(ferieId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/rifiuta-ferie/${ferieId}`, {
      responseType: 'text'
    });
  }



  updateStockAndSendReport(id: number, currentStock: number, maximumCapacity: number): Observable<void> {
    const params = new HttpParams()
      .set('id', id.toString())
      .set('currentStock', currentStock.toString())
      .set('maximumCapacity', maximumCapacity.toString());
    return this.http.put<void>(`${this.apiUrl}/magazine/update-stock-and-report`, null, { params });
  }

  getPersonaleDelReparto(repartoId: number): Observable<{ veterinari: any[], assistenti: any[] }> {
    return this.http.get<{ veterinari: any[], assistenti: any[] }>(
      `${this.apiUrl}/personale-reparto/${repartoId}`
    );
  }


  getUserInfo(): Observable<any> {
    return this.http.get<any>(`${this.urlUtente}/user-info`).pipe(
      tap(data => console.log("Dati utente ricevuti:", data))
    );
  }


  getPazientiDelReparto(): Observable<Animale[]> {
    return this.http.get<Animale[]>(`${this.apiUrl}/animali-reparto`);
  }

  getAnimalFullHistory(animaleId: number): Observable<CronologiaAnimale[]> {
    return this.http.get<CronologiaAnimale[]>(`${environment.baseUrl}/api/cronologia/animal-history/${animaleId}`);
  }

  addEventToAnimal(animaleId: number, event: { eventType: string; description: string }): Observable<any> {
    return this.http.post(`${environment.baseUrl}/api/cronologia/add/${animaleId}`, event);
  }

  getFerieDisponibili(repartoId: number): Observable<string[]> {
    const params = new HttpParams().set('repartoId', repartoId);
    return this.http.get<string[]>(`${this.apiUrl}/ferie-approvate`, { params });
  }


  assegnaFerie(dottoreId: number, startDate: string, endDate: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/ferie`, null, {
      params: {
        dottoreId: dottoreId,
        startDate: startDate,
        endDate: endDate
      }
    });
  }

  assegnaTurno(utenteId: number, startDate: string, endDate: string): Observable<any> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate)
      .set('dottoreId', utenteId);

    return this.http.post(`${this.apiUrl}/assegna-turno`, null, { params });
  }


  getMagazzino(): Observable<Magazzino> {
    return this.http.get<Magazzino>(`${this.stockUrl}/dettagli`);
  }
}
