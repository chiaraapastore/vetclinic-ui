import { Animale } from './animale.model';
import { Veterinario } from './veterinario.model';

export interface Vaccino {
  id?: number;
  name: string;
  type: string;
  administrationDate: Date;
  animale: Animale;
  veterinario: Veterinario;
}
