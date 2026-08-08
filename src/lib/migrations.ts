import type { DB } from '@op-engineering/op-sqlite';

interface Migration {
  version: number;
  up: (db: DB) => void;
}

const DEFAULT_CATEGORIES: Array<{
  id: string;
  type: 'expense' | 'income';
  labelEn: string;
  labelAr: string;
  color: string;
  sortOrder: number;
}> = [
  {
    id: 'electricity',
    type: 'expense',
    labelEn: 'Electricity',
    labelAr: 'الكهرباء',
    color: '#C89B3C',
    sortOrder: 0,
  },
  {
    id: 'water',
    type: 'expense',
    labelEn: 'Water',
    labelAr: 'المياه',
    color: '#3B8AD4',
    sortOrder: 1,
  },
  {
    id: 'food',
    type: 'expense',
    labelEn: 'Food',
    labelAr: 'الطعام',
    color: '#D2472E',
    sortOrder: 2,
  },
  {
    id: 'transport',
    type: 'expense',
    labelEn: 'Transport',
    labelAr: 'المواصلات',
    color: '#7C6FE0',
    sortOrder: 3,
  },
  {
    id: 'rent',
    type: 'expense',
    labelEn: 'Rent',
    labelAr: 'الإيجار',
    color: '#5B6B73',
    sortOrder: 4,
  },
  {
    id: 'phone',
    type: 'expense',
    labelEn: 'Phone/Internet',
    labelAr: 'الهاتف والإنترنت',
    color: '#0B6B57',
    sortOrder: 5,
  },
  {
    id: 'shopping',
    type: 'expense',
    labelEn: 'Shopping',
    labelAr: 'التسوق',
    color: '#D4527E',
    sortOrder: 6,
  },
  {
    id: 'health',
    type: 'expense',
    labelEn: 'Health',
    labelAr: 'الصحة',
    color: '#C23B3B',
    sortOrder: 7,
  },
  {
    id: 'entertainment',
    type: 'expense',
    labelEn: 'Entertainment',
    labelAr: 'الترفيه',
    color: '#9455C9',
    sortOrder: 8,
  },
  {
    id: 'other',
    type: 'expense',
    labelEn: 'Other',
    labelAr: 'أخرى',
    color: '#8A8880',
    sortOrder: 9,
  },
  {
    id: 'salary',
    type: 'income',
    labelEn: 'Salary',
    labelAr: 'الراتب',
    color: '#0B6B57',
    sortOrder: 10,
  },
  {
    id: 'freelance',
    type: 'income',
    labelEn: 'Freelance',
    labelAr: 'عمل حر',
    color: '#3B8AD4',
    sortOrder: 11,
  },
  {
    id: 'gift',
    type: 'income',
    labelEn: 'Gift',
    labelAr: 'هدية',
    color: '#D4527E',
    sortOrder: 12,
  },
  {
    id: 'other_income',
    type: 'income',
    labelEn: 'Other income',
    labelAr: 'دخل آخر',
    color: '#8A8880',
    sortOrder: 13,
  },
];

const migrations: Migration[] = [
  {
    version: 1,
    up: (db) => {
      db.executeSync(`
        CREATE TABLE IF NOT EXISTS categories (
          id TEXT PRIMARY KEY NOT NULL,
          type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
          label_en TEXT NOT NULL,
          label_ar TEXT NOT NULL,
          color TEXT NOT NULL,
          is_default INTEGER NOT NULL DEFAULT 0,
          sort_order INTEGER NOT NULL DEFAULT 0
        );
      `);

      db.executeSync(`
        CREATE TABLE IF NOT EXISTS transactions (
          id TEXT PRIMARY KEY NOT NULL,
          type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
          category_id TEXT NOT NULL,
          amount INTEGER NOT NULL,
          description TEXT,
          date TEXT NOT NULL,
          recurring INTEGER NOT NULL DEFAULT 0,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          FOREIGN KEY (category_id) REFERENCES categories(id)
        );
      `);

      db.executeSync(
        'CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);',
      );
      db.executeSync(
        'CREATE INDEX IF NOT EXISTS idx_transactions_category_id ON transactions(category_id);',
      );
      db.executeSync(
        'CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);',
      );

      for (const category of DEFAULT_CATEGORIES) {
        db.executeSync(
          `INSERT OR IGNORE INTO categories (
            id, type, label_en, label_ar, color, is_default, sort_order
          ) VALUES (?, ?, ?, ?, ?, 1, ?);`,
          [
            category.id,
            category.type,
            category.labelEn,
            category.labelAr,
            category.color,
            category.sortOrder,
          ],
        );
      }
    },
  },
];

function readUserVersion(db: DB): number {
  const result = db.executeSync('PRAGMA user_version');
  const row = result.rows[0] as Record<string, number> | undefined;
  return row?.user_version ?? 0;
}

function writeUserVersion(db: DB, version: number): void {
  db.executeSync(`PRAGMA user_version = ${version}`);
}

export function runMigrations(db: DB): void {
  db.executeSync('PRAGMA foreign_keys = ON');

  const currentVersion = readUserVersion(db);
  const pending = migrations
    .filter((migration) => migration.version > currentVersion)
    .sort((a, b) => a.version - b.version);

  for (const migration of pending) {
    db.executeSync('BEGIN');
    try {
      migration.up(db);
      writeUserVersion(db, migration.version);
      db.executeSync('COMMIT');
    } catch (error) {
      db.executeSync('ROLLBACK');
      throw error;
    }
  }
}
