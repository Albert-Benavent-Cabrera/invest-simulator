export interface IHistoryPoint {
  date: string;
  price: number;
}

export interface IAsset {
  id: string;
  name: string;
  symbol: string;
  type: 'crypto' | 'stock' | 'index' | 'bank';
  currentPrice: number;
  change?: number;
  history: IHistoryPoint[];
}
export interface ITrade {
  type: 'buy' | 'sell';
  symbol: string;
  price: number;
  amount: number;
}

export interface ITransaction {
  id: string;
  type: 'buy' | 'sell' | 'deposit' | 'withdraw';
  symbol: string;
  name: string;
  amount: number;
  price: number;
  total: number;
  date: string;
  timestamp: number;
}

export interface IPortfolioAsset {
  symbol: string;
  amount: number;
  avgPrice: number;
  totalInvested: number;
}

export interface IPortfolio {
  balance: number;
  assets: IPortfolioAsset[];
  transactions: ITransaction[];
}
