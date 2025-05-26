
export type UserRole = 'worker' | 'supplier' | 'manager';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  created_at: string;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  date: string;
  description: string;
  recipient_id: string;
  approver_id?: string;
  transaction_hash?: string;
  recipient_name?: string;
  created_at: string;
}

export interface WorkLog {
  id: string;
  worker_id: string;
  hours: number;
  description: string;
  date: string;
  hourly_rate: number;
  created_at: string;
}

export interface DeliveryLog {
  id: string;
  supplier_id: string;
  material_type: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  delivery_date: string;
  status: 'pending' | 'delivered' | 'paid';
  created_at: string;
}
