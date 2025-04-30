import {Utente} from './utente.model';
import {Cliente} from './cliente.model';

export interface Animale {
  cliente: Cliente;
  id?: number;
  name: string;
  species: string;
  breed: string;
  state?: string;
  owner?: Utente;
  microchip:string;
}
