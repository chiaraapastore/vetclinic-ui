import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssistenteService {

  private apiUrl = 'http://localhost:8081/api/assistente';

  constructor(private http: HttpClient) {}

  createAppointment(animalId: number, veterinarianId: number, appointmentDate: Date, reason: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-appointment`, null, {
      params: {
        animalId: animalId.toString(),
        veterinarianId: veterinarianId.toString(),
        appointmentDate: appointmentDate.toISOString(),
        reason
      }
    });
  }

  deleteAppointment(appointmentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-appointment/${appointmentId}`);
  }

  remindAppointment(appointmentId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/remind-appointment/${appointmentId}`, null);
  }

  checkMedicineExpiration(departmentHeadId: number, medicineId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/check-medicine-expiration`, null, {
      params: {
        departmentHeadId: departmentHeadId.toString(),
        medicineId: medicineId.toString()
      }
    });
  }

  viewDepartmentMedicines(departmentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/view-department-medicines/${departmentId}`);
  }

  getVeterinarianPatients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get-veterinarian-patients`);
  }

  getRepartoByVeterinarian(emailVeterinarian: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-reparto-by-dottore`, {
      params: { emailVeterinarian }
    });
  }

  getVeterinariesByDepartment(departmentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get-veterinaries-by-department/${departmentId}`);
  }

  getAssistentiByReparto(repartoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get-assistenti-by-reparto/${repartoId}`);
  }

  getAssistentiByName(firstName: string, lastName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get-assistenti-by-name`, {
      params: { firstName, lastName }
    });
  }

  getAllAssistenti(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get-all-assistenti`);
  }

  getAssistenteById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-assistente/${id}`);
  }

  somministraFarmaco(animaleId: number, medicineId: number, quantita: number, veterinarianId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/somministra-farmaco`, null, {
      params: {
        animaleId: animaleId.toString(),
        medicineId: medicineId.toString(),
        quantita: quantita.toString(),
        veterinarianId: veterinarianId.toString()
      }
    });
  }

  gestisciPagamento(clienteId: number, amount: number, paymentMethod: string, cardType: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/gestisci-pagamento`, null, {
      params: {
        clienteId: clienteId.toString(),
        amount: amount.toString(),
        paymentMethod,
        cardType
      }
    });
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
}
