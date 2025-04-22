
import { Reparto } from './reparto.model';
import {Utente} from './utente.model';

export interface CapoReparto extends Utente {
  reparto: Reparto;
}
