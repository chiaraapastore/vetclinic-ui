import {Reparto} from './reparto.model';
import {Magazzino} from './magazzino.model';

export interface Medicine {
  expirationDate: string | Date;
  categoria: string;
  id: number;
  name: string;
  description?: string;
  availableQuantity: number;
  quantity: number;
  expiryDate: string | Date;
  currentStock?: number;
  pendingOrders?: number;
  unitsToReceive?: number;
  department: Reparto;
  magazine: Magazzino;
  dosage?: string;

}
