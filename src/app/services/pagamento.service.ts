
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appuntamento } from '../models/appuntamento.model';
import { Pagamento } from '../models/pagamento.model';

@Injectable({ providedIn: 'root' })
export class PagamentoService {
  private basePagamentiUrl = 'http://localhost:8081/api/pagamenti';
  private baseAssistenteUrl = 'http://localhost:8081/api/assistente';
  private baseNotificheUrl = 'http://localhost:8081/api/notifications';

  constructor(private http: HttpClient) {}

  getAppuntamenti(): Observable<Appuntamento[]> {
    return this.http.get<Appuntamento[]>(`${this.baseAssistenteUrl}/my-appointments`);
  }

  pagaAppuntamento(appointmentId: number): Observable<Pagamento> {
    return this.http.post<Pagamento>(`${this.basePagamentiUrl}/process/${appointmentId}`, {});
  }



  inviaNotificaPagamento(clienteId: number, message: string): Observable<any> {
    return this.http.post(`${this.baseNotificheUrl}/send-to-user`, {
      userId: clienteId,
      message: message
    });
  }


}
