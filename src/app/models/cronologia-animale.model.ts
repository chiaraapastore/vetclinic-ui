import { Animale } from './animale.model';

export interface CronologiaAnimale {
  id: number;
  eventDate: Date;
  description: string;
  eventType: string;
  animale: Animale;
}
