import { db } from '@lib/db';
import { Category } from '@models/category';
import { TransactionType } from '@models/transaction';

type CategoryRow = {
  id: string;
  type: string;
  label_en: string;
  label_ar: string;
  color: string;
  is_default: number;
  sort_order: number;
};

function mapCategoryRow(row: CategoryRow): Category {
  return {
    id: row.id,
    type: row.type as TransactionType,
    labelEn: row.label_en,
    labelAr: row.label_ar,
    color: row.color,
    isDefault: row.is_default === 1,
    sortOrder: row.sort_order,
  };
}

export async function getCategories(): Promise<Category[]> {
  const result = await db.execute(
    'SELECT * FROM categories ORDER BY sort_order ASC, id ASC;',
  );
  return (result.rows as CategoryRow[]).map(mapCategoryRow);
}
