import { Animale } from './animale.model';
import { Medicine } from './medicine.model';

export interface Somministrazione {
  id?: number;
  animal: Animale;
  medicine: Medicine;
  dosage: number;
  date: Date;
}
