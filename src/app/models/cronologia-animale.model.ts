
import { Animale } from './animale.model';

export interface CronologiaAnimale {
  id: number;
  description: string;
  data: Date;
  animale: Animale;
}
