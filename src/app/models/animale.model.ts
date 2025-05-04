import {Cliente} from './cliente.model';
import {Veterinario} from './veterinario.model';
import {Reparto} from './reparto.model';

export interface Animale {
  id?: number;
  name: string;
  species: string;
  breed: string;
  state?: string;
  microchip: string;
  weight?: number;
  symptoms?: string;
  nextVisit?: string;
  cliente: Cliente;
  reparto: Reparto;
  veterinario?: Veterinario;
}
