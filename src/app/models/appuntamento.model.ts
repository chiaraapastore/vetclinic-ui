
import { Cliente } from './cliente.model';
import { Veterinario } from './veterinario.model';

export interface Appuntamento {
  id: number;
  date: Date;
  status: string;
  cliente: Cliente;
  veterinarian: Veterinario;
}
