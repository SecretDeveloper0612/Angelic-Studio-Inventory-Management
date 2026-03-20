export interface Supplier {
  id: string;
  name: string;
  contactNumber: string;
  email: string;
  address: string;
  lastOrderDate: string;
  notes?: string;
}

export type ActivityAction = "added" | "updated" | "usage" | "refill" | "deleted";

export interface RecentActivity {
  id: string;
  productId?: string;
  productName: string;
  action: ActivityAction;
  date: string;
  staffName: string;
  details?: string;
}
