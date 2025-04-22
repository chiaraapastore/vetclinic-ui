import { Animale } from './animale.model';
import { Veterinario } from './veterinario.model';
import { Medicine } from './medicine.model';

export interface Emergenza {
  id?: number;
  animal: Animale;
  veterinarian: Veterinario;
  emergencyDate: Date;
  description: string;
  medicine: Medicine;
  dosage: string;
}
