import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {CapoReparto} from '../models/capo-reparto.model';
import {NuovoAnimaleDTO} from '../models/nuovo-animale-dto';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8081/api/admin';
  private urlUtente = 'http://localhost:8081/api/utente';

  constructor(private http: HttpClient) {}

  createDepartment(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-department`, data);
  }

  assignHeadOfDepartment(utenteId: number, repartoId: number): Observable<{ message: string }> {
    const payload = { utenteId, repartoId };
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/assign-head-of-department`,
      payload,
      { headers: { 'Content-Type': 'application/json' } }
    );
  }


  assignDoctorToDepartment(utenteId: number, repartoId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/assign-doctor-to-department/${utenteId}/${repartoId}`, {});
  }

  assignAssistantToDepartment(utenteId: number, repartoId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/assign-assistant-to-department/${utenteId}/${repartoId}`, {});
  }

  createAnimalForClient(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-animale`, payload);
  }

  createCliente(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-cliente`, payload);
  }

  getAllVeterinaries(): Observable<any> {
    return this.http.get(`${this.apiUrl}/veterinaries`);
  }

  getAllDepartments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/departments`);
  }

  getHeadOfDepartments(): Observable<CapoReparto[]> {
    return this.http.get<CapoReparto[]>(`${this.apiUrl}/head-of-department`);
  }


  createVeterinarian(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-veterinarian`, payload);
  }

  createHeadOfDepartment(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-head-of-department`, payload);
  }

  addMedicinal(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-medicinal`, payload);
  }

  getAllWarehouses(): Observable<any> {
    return this.http.get(`${this.apiUrl}/warehouse`);
  }

  createAssistant(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-assistant`, payload);
  }

  getOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders`);
  }

  getReportConsumi(): Observable<any> {
    return this.http.get(`${this.apiUrl}/report-consumi`);
  }

  createOrder(ordine: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-order`, ordine);
  }

  getOrderHistory(): Observable<any> {
    return this.http.get(`${this.apiUrl}/order-history`);
  }

  getPendingOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pending-order`);
  }

  updateOrderState(ordineId: number, stato: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/order/${ordineId}/state`, { stato });
  }

  approveHolidays(ferieId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/approve-holidays/${ferieId}`, {});
  }

  refuseHolidays(ferieId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/refuse-holidays/${ferieId}`);
  }

  getApprovedHolidays(): Observable<any> {
    return this.http.get(`${this.apiUrl}/approved-holidays`);
  }

  getUnapprovedHolidays(): Observable<any> {
    return this.http.get(`${this.apiUrl}/unapproved-holidays`);
  }

  getAllAssistants(): Observable<any> {
    return this.http.get(`${this.apiUrl}/assistants`);
  }

  eliminaUtente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/elimina-utente/${id}`);
  }

  addAnimalWithClient(dto: NuovoAnimaleDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/animali`, dto);
  }


  getAllAnimals(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/animali`);
  }

  createDepartmentWithStaff(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-department-with-staff`, payload);
  }

  deleteReparto(repartoId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-department/${repartoId}`);
  }

  deleteAnimal(id: number) {
    return this.http.delete<any>(`${this.apiUrl}/delete-animal/${id}`);
  }



}
