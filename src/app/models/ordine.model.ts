import { Fornitore } from './fornitore.model';

export interface Ordine {
  id?: number;
  supplier: Fornitore;
  quantity: number;
  orderDate: Date;
  status: 'PENDING' | 'COMPLETED' | 'CANCELED';
}
