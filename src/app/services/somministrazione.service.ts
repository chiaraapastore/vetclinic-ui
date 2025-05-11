import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Somministrazione } from '../models/somministrazione.model';

@Injectable({
  providedIn: 'root'
})
export class SomministrazioneService {
  private somministrazioneUrl = 'http://localhost:8081/api/somministrazioni';
  private assistenteUrl = 'http://localhost:8081/api/assistente';
  private veterinarioUrl = 'http://localhost:8081/api/veterinarian';

  constructor(private http: HttpClient) {}

  registraSomministrazione(somministrazione: Somministrazione): Observable<Somministrazione> {
    return this.http.post<Somministrazione>(`${this.somministrazioneUrl}/registra`, somministrazione);
  }

  getSomministrazioniByPaziente(pazienteId: number): Observable<Somministrazione[]> {
    return this.http.get<Somministrazione[]>(`${this.somministrazioneUrl}/paziente/${pazienteId}`);
  }

  somministraFarmaco(animaleId: number, medicineId: number, quantita: number, veterinarianId: number): Observable<{ message: string }> {
    const params = new HttpParams()
      .set('animaleId', animaleId.toString())
      .set('medicineId', medicineId.toString())
      .set('quantita', quantita.toString())
      .set('veterinarianId', veterinarianId.toString());

    return this.http.post<{ message: string }>(`${this.assistenteUrl}/somministra-farmaco`, null, { params });
  }



  somministraFarmacoVeterinario(pazienteId: number, medicineId: number, quantita: number, capoRepartoId: number) {
    const params = new HttpParams()
      .set('pazienteId', pazienteId.toString())
      .set('medicineId', medicineId.toString())
      .set('quantita', quantita.toString())
      .set('capoRepartoId', capoRepartoId.toString());

    return this.http.post<{ message: string }>(`${this.veterinarioUrl}/administers-medicines`, {},
      {params}
    );
  }





  }
