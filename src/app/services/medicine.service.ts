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

  getMedicineById(id: number): Observable<Medicine> {
    return this.http.get<Medicine>(`${this.baseUrl}/search/${id}`);
  }

  getAvailableMedicines(): Observable<Medicine[]> {
    return this.http.get<Medicine[]>(`${this.baseUrl}/available`);
  }

  saveMedicine(medicine: Medicine): Observable<Medicine> {
    return this.http.post<Medicine>(`${this.baseUrl}/save`, medicine);
  }

  updateMedicine(id: number, medicine: Medicine): Observable<Medicine> {
    return this.http.put<Medicine>(`${this.baseUrl}/${id}`, medicine);
  }

  updateAvailableQuantity(id: number, quantity: number): Observable<Medicine> {
    return this.http.put<Medicine>(`${this.baseUrl}/${id}/update-available-quantity`, {
      availableQuantity: quantity
    });
  }

  deleteMedicine(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
}
