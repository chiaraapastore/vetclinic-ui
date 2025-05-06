import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {EMPTY, Observable} from 'rxjs';
import { environment } from '../environments/environment';
import {CronologiaAnimale} from '../models/cronologia-animale.model';
import {Medicine} from '../models/medicine.model';
import {catchError} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AssistenteService {

  private apiUrl = `${environment.baseUrl}/api/assistente`;

  constructor(private http: HttpClient,  private toastr: ToastrService,) {}



  viewDepartmentMedicines(departmentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/view-department-medicines/${departmentId}`);
  }



  getVeterinarianPatients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get-veterinarian-patients`);
  }


  getEmergenze(): Observable<Medicine[]> {
    return this.http.get<Medicine[]>(`${this.apiUrl}/emergenze`);
  }


  getOrdini(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/list-order`);
  }

  createOrdine(supplier: string, quantity: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create-order`, { supplier, quantity });
  }

  getOrderHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/order-history`);
  }

  getAnimalFullHistory(animaleId: number): Observable<CronologiaAnimale[]> {
    return this.http.get<CronologiaAnimale[]>(`${environment.baseUrl}/api/cronologia/animal-history/${animaleId}`);
  }

  addEventToAnimal(animaleId: number, event: { eventType: string; description: string }): Observable<any> {
    return this.http.post(`${environment.baseUrl}/api/cronologia/add/${animaleId}`, event);
  }


  aggiungiFarmaco(farmacoDaAggiungere: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/aggiungi-farmaco`, farmacoDaAggiungere)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = "Errore durante l'aggiunta del farmaco.";
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          this.toastr.error(errorMessage);
          return EMPTY;
        })
      );
  }


  scadenzaFarmaco(capoRepartoId: number, medicinaleId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/scadenza`, { capoRepartoId, medicinaleId });
  }


  aggiornaStatoOrdine(ordineId: number, stato: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/ordini/${ordineId}/stato`, { stato });
  }

}
