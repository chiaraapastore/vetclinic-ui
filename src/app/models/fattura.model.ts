import { Cliente } from './cliente.model';

export interface Fattura {
  id?: number;
  cliente: Cliente;
  issueDate: Date;
  amount: number;
  status: 'PENDING' | 'PAID' | 'CANCELED';
}
