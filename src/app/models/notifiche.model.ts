import { Utente } from './utente.model';

export interface Notifiche {
  id?: number;
  message: string;
  sentBy?: Utente;
  sentTo: Utente;
  notificationDate: Date;
  type: 'welcome' | 'department_change' | 'farmaco_scaduto' | 'farmaco' | 'anomalia' | 'emergenza' | 'payment_confirmation' | 'report_creation' | 'report_update' | 'emergency_report' | 'general_alert';
  letta: boolean;
}
