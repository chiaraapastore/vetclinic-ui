
import { Animale } from './animale.model';

export interface Esame {
  id: number;
  nome: string;
  risultato: string;
  data: Date;
  animale: Animale;
}
