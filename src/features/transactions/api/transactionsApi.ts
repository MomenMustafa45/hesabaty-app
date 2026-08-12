import { db } from '@lib/db';
import { createUuid } from '@lib/uuid';
import {
  NewTransactionInput,
  Transaction,
  TransactionsFilter,
  TransactionType,
  UpdateTransactionInput,
} from '@models/transaction';

type TransactionRow = {
  id: string;
  type: string;
  category_id: string;
  amount: number;
  description: string | null;
  date: string;
  recurring: number;
  created_at: string;
  updated_at: string;
};

function mapTransactionRow(row: TransactionRow): Transaction {
  return {
    id: row.id,
    type: row.type as TransactionType,
    categoryId: row.category_id,
    amount: row.amount,
    description: row.description,
    date: row.date,
    recurring: row.recurring === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function buildListQuery(filter: TransactionsFilter = {}): {
  sql: string;
  params: Array<string>;
} {
  const clauses: string[] = [];
  const params: string[] = [];

  if (filter.type) {
    clauses.push('type = ?');
    params.push(filter.type);
  }
  if (filter.categoryId) {
    clauses.push('category_id = ?');
    params.push(filter.categoryId);
  }
  if (filter.dateFrom) {
    clauses.push('date >= ?');
    params.push(filter.dateFrom);
  }
  if (filter.dateTo) {
    clauses.push('date <= ?');
    params.push(filter.dateTo);
  }

  const where = clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';
  return {
    sql: `SELECT * FROM transactions ${where} ORDER BY date DESC, created_at DESC;`,
    params,
  };
}

export async function getTransactions(
  filter: TransactionsFilter = {},
): Promise<Transaction[]> {
  const { sql, params } = buildListQuery(filter);
  const result = await db.execute(sql, params);
  return (result.rows as TransactionRow[]).map(mapTransactionRow);
}

export async function getTransactionById(
  id: string,
): Promise<Transaction | null> {
  const result = await db.execute(
    'SELECT * FROM transactions WHERE id = ?;',
    [id],
  );
  const row = result.rows[0] as TransactionRow | undefined;
  if (!row) {
    return null;
  }
  return mapTransactionRow(row);
}

export async function addTransaction(
  input: NewTransactionInput,
): Promise<Transaction> {
  const now = new Date().toISOString();
  const transaction: Transaction = {
    id: createUuid(),
    type: input.type,
    categoryId: input.categoryId,
    amount: input.amount,
    description: input.description ?? null,
    date: input.date,
    recurring: input.recurring ?? false,
    createdAt: now,
    updatedAt: now,
  };

  await db.execute(
    `INSERT INTO transactions (
      id, type, category_id, amount, description, date, recurring, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      transaction.id,
      transaction.type,
      transaction.categoryId,
      transaction.amount,
      transaction.description,
      transaction.date,
      transaction.recurring ? 1 : 0,
      transaction.createdAt,
      transaction.updatedAt,
    ],
  );

  return transaction;
}

export async function updateTransaction(
  input: UpdateTransactionInput,
): Promise<Transaction> {
  const existingResult = await db.execute(
    'SELECT * FROM transactions WHERE id = ?;',
    [input.id],
  );
  const existingRow = existingResult.rows[0] as TransactionRow | undefined;
  if (!existingRow) {
    throw new Error(`Transaction not found: ${input.id}`);
  }

  const existing = mapTransactionRow(existingRow);
  const updated: Transaction = {
    ...existing,
    type: input.type ?? existing.type,
    categoryId: input.categoryId ?? existing.categoryId,
    amount: input.amount ?? existing.amount,
    description:
      input.description !== undefined ? input.description : existing.description,
    date: input.date ?? existing.date,
    recurring: input.recurring ?? existing.recurring,
    updatedAt: new Date().toISOString(),
  };

  await db.execute(
    `UPDATE transactions SET
      type = ?,
      category_id = ?,
      amount = ?,
      description = ?,
      date = ?,
      recurring = ?,
      updated_at = ?
    WHERE id = ?;`,
    [
      updated.type,
      updated.categoryId,
      updated.amount,
      updated.description,
      updated.date,
      updated.recurring ? 1 : 0,
      updated.updatedAt,
      updated.id,
    ],
  );

  return updated;
}

export async function deleteTransaction(id: string): Promise<void> {
  await db.execute('DELETE FROM transactions WHERE id = ?;', [id]);
}
