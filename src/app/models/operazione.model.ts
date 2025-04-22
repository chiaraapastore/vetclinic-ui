import { Animale } from './animale.model';
import { Utente } from './utente.model';

export interface Operazione {
  id?: number;
  animale: Animale;
  veterinario: Utente;
  tipoOperazione: string;
  descrizione: string;
  dataOra: Date;
}
