import { Utente } from './utente.model';
import { Reparto } from './reparto.model';

export interface Assistente extends Utente {
  reparto: Reparto;
}
