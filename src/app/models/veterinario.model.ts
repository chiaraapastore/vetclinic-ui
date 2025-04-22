import {Utente} from './utente.model';
import {Reparto} from './reparto.model';


export interface Veterinario extends Utente {
  registrationNumber: string;
  reparto: Reparto;
}
