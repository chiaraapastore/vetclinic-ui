import {Utente} from './utente.model';

export interface Ferie {
  id: number;
  startDate: Date;
  endDate: Date;
  motivo: string;
  approvato: boolean;
  utente: Utente;
}
