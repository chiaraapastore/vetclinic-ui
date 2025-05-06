
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Animale } from '../models/animale.model';
import { Reparto } from '../models/reparto.model';
import { Somministrazione } from '../models/somministrazione.model';
import { Veterinario } from '../models/veterinario.model';
import {CronologiaAnimale} from '../models/cronologia-animale.model';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VeterinarioService {
  private baseUrl = 'http://localhost:8081/api/veterinarian';
  private apiUrl = `${environment.baseUrl}/api/assistente`;

  constructor(private http: HttpClient) {}

  getAnimalsOfVeterinarian(): Observable<Animale[]> {
    return this.http.get<Animale[]>(`${this.baseUrl}/animals`);
  }

  getDepartmentByVeterinarian(email: string): Observable<Reparto> {
    return this.http.get<Reparto>(`${this.baseUrl}/${email}/department`);
  }

  getVeterinariByDepartment(departmentId: number): Observable<Veterinario[]> {
    return this.http.get<Veterinario[]>(`${this.baseUrl}/department/${departmentId}`);
  }

  viewMedicineByDepartment(departmentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/view-medicine/${departmentId}`);
  }

  executeOperation(animaleId: number, tipoOperazione: string, descrizioneOperazione: string): Observable<{ message: string }> {
    const params = new HttpParams()
      .set('animaleId', animaleId.toString())
      .set('tipoOperazione', tipoOperazione)
      .set('descrizioneOperazione', descrizioneOperazione);

    return this.http.post<{ message: string }>(`${this.baseUrl}/execute-operation`, null, { params });
  }

  administerMedicine(request: {
    animalId: number;
    headOfDepartmentId: number;
    nameOfMedicine: string;
    quantity: number;
  }): Observable<Somministrazione> {
    return this.http.post<Somministrazione>(`${this.baseUrl}/administers-medicines`, request);
  }

  notifyExpiration(headOfDepartmentId: number, medicineId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/expiration`, null, {
      params: new HttpParams()
        .set('headOfDepartmentId', headOfDepartmentId.toString())
        .set('medicineId', medicineId.toString())
    });
  }

  changeDepartment(veterinarianId: number, newDepartmentId: number): Observable<string> {
    return this.http.put(`${this.baseUrl}/change-department/${veterinarianId}/${newDepartmentId}`, null, {
      responseType: 'text'
    });
  }


  getAnimalFullHistory(animaleId: number): Observable<CronologiaAnimale[]> {
    return this.http.get<CronologiaAnimale[]>(`${environment.baseUrl}/api/cronologia/animal-history/${animaleId}`);
  }

  addEventToAnimal(animaleId: number, event: { eventType: string; description: string }): Observable<any> {
    return this.http.post(`${environment.baseUrl}/api/cronologia/add/${animaleId}`, event);
  }

  getVeterinarianPatients(): Observable<Animale[]> {
    return this.http.get<Animale[]>(`${this.baseUrl}/animals`);
  }


}
