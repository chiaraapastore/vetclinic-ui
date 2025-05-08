import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Notifiche} from '../models/notifiche.model';

@Injectable({
  providedIn: 'root'
})
export class NotificheService {
  private apiUrl = 'http://localhost:8081/api/notifications';

  constructor(private http: HttpClient) {}



  getNotificationsForUser(): Observable<Notifiche[]> {
    return this.http.get<Notifiche[]>(`${this.apiUrl}/list`);
  }


  markAllNotificationsAsRead(): Observable<Notifiche[]> {
    return this.http.get<Notifiche[]>(`${this.apiUrl}/mark-all-read`);
  }

  sendNotificationToUserId(message: string, userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-to-user`, {
      userId,
      message
    });
  }






  }
