import { db } from '@lib/db';
import { createUuid } from '@lib/uuid';
import { Category } from '@models/category';
import { TransactionType } from '@models/transaction';

/** Cycled by count when a user adds a custom category — ports the prototype's palette. */
const CUSTOM_CATEGORY_PALETTE = [
  '#0B6B57',
  '#C89B3C',
  '#D2472E',
  '#3B8AD4',
  '#7C6FE0',
  '#D4527E',
];

/** Never deletable — transactions always need a guaranteed fallback category. */
export const PROTECTED_CATEGORY_IDS = ['other', 'other_income'];

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

export async function addCategory(input: {
  type: TransactionType;
  label: string;
}): Promise<Category> {
  const countResult = await db.execute(
    'SELECT COUNT(*) as count, COALESCE(MAX(sort_order), -1) as maxSortOrder FROM categories WHERE type = ?;',
    [input.type],
  );
  const row = countResult.rows[0] as { count: number; maxSortOrder: number };
  const color = CUSTOM_CATEGORY_PALETTE[row.count % CUSTOM_CATEGORY_PALETTE.length];

  const category: Category = {
    id: createUuid(),
    type: input.type,
    labelEn: input.label,
    labelAr: input.label,
    color,
    isDefault: false,
    sortOrder: row.maxSortOrder + 1,
  };

  await db.execute(
    `INSERT INTO categories (
      id, type, label_en, label_ar, color, is_default, sort_order
    ) VALUES (?, ?, ?, ?, ?, ?, ?);`,
    [
      category.id,
      category.type,
      category.labelEn,
      category.labelAr,
      category.color,
      0,
      category.sortOrder,
    ],
  );

  return category;
}

export async function removeCategory(id: string): Promise<void> {
  if (PROTECTED_CATEGORY_IDS.includes(id)) {
    throw new Error(`Category "${id}" can't be deleted.`);
  }
  await db.execute('DELETE FROM categories WHERE id = ?;', [id]);
}
