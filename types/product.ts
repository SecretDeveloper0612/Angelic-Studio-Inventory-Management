export type UnitType = "pcs" | "ml" | "bottles" | "sets";

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  quantity: number;
  minStock: number;
  unit: UnitType;
  supplier: string;
  purchasePrice?: number;
  sellingPrice?: number;
  imageUrl?: string;
  lastUpdated: string;
  usageHistory?: UsageEntry[];
}

export interface UsageEntry {
  id: string;
  productId: string;
  amount: number;
  date: string;
  staffName: string;
  notes?: string;
}
