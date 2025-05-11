import {Utente} from './utente.model';

export interface Reparto {
  id: number;
  name: string;
  headOfDepartment?: Utente;
  veterinario?: Utente;
  assistente?: Utente;
  capoRepartoId: number;
}
