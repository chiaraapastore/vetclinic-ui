
import { Cliente } from './cliente.model';
import { Veterinario } from './veterinario.model';
import {Animale} from './animale.model';

export interface Appuntamento {
  id: number;
  date: Date;
  status: string;
  cliente: Cliente;
  veterinarian: Veterinario;
  animal: Animale;
  appointmentDate:string;
  reason: string;
}
