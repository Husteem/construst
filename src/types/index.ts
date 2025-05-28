
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
  recipient_wallet?: string;
  transaction_status?: 'pending' | 'processing' | 'completed' | 'failed';
  smart_contract_address?: string;
  gas_fee?: number;
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

export interface MaterialUpload {
  id: string;
  supplier_id: string;
  material_type: string;
  quantity: number;
  delivery_date: string;
  photo_url?: string;
  description?: string;
  gps_coordinates?: string;
  status: 'pending' | 'verified' | 'rejected';
  created_at: string;
}

export interface WorkUpload {
  id: string;
  worker_id: string;
  work_date: string;
  hours_worked: number;
  photo_url?: string;
  description: string;
  gps_coordinates?: string;
  status: 'pending' | 'verified' | 'rejected';
  created_at: string;
}

export interface UserWallet {
  id: string;
  user_id: string;
  wallet_address: string;
  wallet_type: 'ethereum' | 'bitcoin' | 'polygon';
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface ManagerWallet {
  id: string;
  manager_id: string;
  wallet_address: string;
  balance: number;
  currency: 'ETH' | 'USDT' | 'USDC' | 'NGN';
  last_updated: string;
}
