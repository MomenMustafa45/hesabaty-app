import { open } from '@op-engineering/op-sqlite';
import { runMigrations } from './migrations';

export const db = open({ name: 'hasabaty.db' });

runMigrations(db);
