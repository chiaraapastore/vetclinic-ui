import { Utente } from './utente.model';

export interface Turni {
  id?: number;
  utente: Utente;
  startTime: Date;
  endTime: Date;
  approved: boolean;
}

