export interface Asset {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  price: number;
  purchasePrice?: number;
}
