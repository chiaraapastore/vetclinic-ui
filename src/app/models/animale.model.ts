import { Utente } from './utente.model';

export interface Animale {
  id?: number;
  name: string;
  specie: string;
  razza: string;
  state?: string;
  owner?: Utente;
}
