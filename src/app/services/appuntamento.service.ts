import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appuntamento } from '../models/appuntamento.model';

@Injectable({
  providedIn: 'root'
})
export class AppuntamentoService {

  private appuntamentiUrl = 'http://localhost:8081/api/appuntamenti';
  private assistenteUrl = 'http://localhost:8081/api/assistente';

  constructor(private http: HttpClient) {}

  getAppointmentsByVeterinarian(veterinarianId: number): Observable<Appuntamento[]> {
    return this.http.get<Appuntamento[]>(`${this.appuntamentiUrl}/veterinario/${veterinarianId}`);
  }

  getVeterinarianPatients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.assistenteUrl}/get-veterinarian-patients`);
  }

  getMyAppointments(): Observable<Appuntamento[]> {
    return this.http.get<Appuntamento[]>(`${this.appuntamentiUrl}/my`);
  }

  getAppointmentsCreatedByAssistant(): Observable<Appuntamento[]> {
    return this.http.get<Appuntamento[]>(`${this.appuntamentiUrl}/veterinario/assistente-appuntamenti`);
  }


  createAppointment(appointment: {
    animalId: number;
    veterinarianId: number;
    appointmentDate: string;
    reason: string;
    amount: number;
  }) {
    const params = new HttpParams()
      .set('animalId', appointment.animalId)
      .set('veterinarianId', appointment.veterinarianId)
      .set('appointmentDate', appointment.appointmentDate)
      .set('reason', appointment.reason)
      .set('amount', appointment.amount.toString());

    return this.http.post<Appuntamento>(`${this.assistenteUrl}/create-appointment`, null, { params });
  }





  deleteAppointment(id: number): Observable<any> {
    return this.http.delete(`${this.appuntamentiUrl}/delete-appointment/${id}`);
  }

  remindAppointment(id: number, newDate: string): Observable<string> {
    const params = new HttpParams()
      .set('newDate', newDate);

    return this.http.post(`${this.assistenteUrl}/remind-appointment/${id}`, null, {
      params,
      responseType: 'text'
    });
  }


  getAppointmentsForAssistant(): Observable<Appuntamento[]> {
   return this.http.get<Appuntamento[]>(`${this.assistenteUrl}/my-appointments`);
  }

  getAppuntamentiCliente(): Observable<any[]> {
    return this.http.get<any[]>(`${this.appuntamentiUrl}/cliente/miei-appuntamenti`);
  }
}
