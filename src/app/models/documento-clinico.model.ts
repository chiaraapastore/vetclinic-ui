
import { Animale } from './animale.model';

export interface DocumentoClinico {
  id: number;
  titolo: string;
  descrizione: string;
  data: Date;
  animale: Animale;
}
