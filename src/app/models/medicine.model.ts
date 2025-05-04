import {Reparto} from './reparto.model';
import {Magazzino} from './magazzino.model';

export interface Medicine {
  id?: number;
  name: string;
  description?: string;
  availableQuantity: number;
  quantity: number;
  expiryDate?: Date;
  currentStock?: number;
  pendingOrders?: number;
  unitsToReceive?: number;
  department: Reparto;
  magazine: Magazzino;
  dosage?: string;

}
