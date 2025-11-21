export type OrderStatus = 'draft' | 'pending' | 'approved' | 'completed';
export type PaymentType = 'credit_card' | 'bank_transfer' | 'check' | 'cash';
export type PaymentTerms = 'net_30' | 'net_60' | 'net_90' | 'due_on_receipt' | 'prepaid';

export interface Company {
  id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Buyer {
  name: string;
  email: string;
  phone: string;
  department: string;
}

export interface ProductLineItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  issuingCompany: Company;
  supplier: Supplier;
  buyer: Buyer;
  createdBy: string;
  paymentTerms: PaymentTerms;
  paymentType: PaymentType;
  lineItems: ProductLineItem[];
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}
