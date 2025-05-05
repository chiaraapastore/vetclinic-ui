import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medicine } from '../models/medicine.model';

@Injectable({
  providedIn: 'root'
})
export class MedicineService {
  private baseUrl = 'http://localhost:8081/api/medicines';

  constructor(private http: HttpClient) {}


  getAvailableMedicines(): Observable<Medicine[]> {
    return this.http.get<Medicine[]>(`${this.baseUrl}/available`);
  }

  updateAvailableQuantity(id: number, availableQuantity: number): Observable<Medicine> {
    return this.http.put<Medicine>(`${this.baseUrl}/${id}/update-available-quantity`, { availableQuantity });
  }

  deleteMedicinale(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }




}
