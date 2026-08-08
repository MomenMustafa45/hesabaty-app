import { TransactionType } from './transaction';

export interface Category {
  id: string;
  type: TransactionType;
  labelEn: string;
  labelAr: string;
  color: string;
  isDefault: boolean;
  sortOrder: number;
}
