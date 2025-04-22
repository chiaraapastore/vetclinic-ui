import { Fattura } from './fattura.model';

export interface Pagamento{
  id?: number;
  invoice: Fattura;
  amount: number;
  paymentDate: Date;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
}
