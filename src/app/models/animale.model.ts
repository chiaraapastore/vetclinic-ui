import {Utente} from './utente.model';

export interface Animale {
  id?: number;
  name: string;
  species: string;
  breed: string;
  state?: string;
  owner?: Utente;
  microchip:string;
}
