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
  departmentId?: number;
}
