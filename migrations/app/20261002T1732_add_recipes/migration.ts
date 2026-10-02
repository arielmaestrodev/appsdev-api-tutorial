#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/2c792942f79876da37d451e6d69a0a61f35f13372bbe5ae17f830beaa1f931d5/contract';
import endContract from '../../snapshots/2c792942f79876da37d451e6d69a0a61f35f13372bbe5ae17f830beaa1f931d5/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/cf85563db693f3d89e47f7efded671a319c0ed7eefe22a471382352bd6024c3e/contract';
import startContract from '../../snapshots/cf85563db693f3d89e47f7efded671a319c0ed7eefe22a471382352bd6024c3e/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropCheckConstraint({
        schema: 'public',
        table: 'token',
        constraint: 'token_type_check_48e96910',
      }),
      this.createTable({
        schema: 'public',
        table: 'recipe',
        columns: [
          col('cookTimeMinutes', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('cuisine', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('difficulty', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('image', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('ingredients', 'text[]', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1', many: true },
          }),
          col('instructions', 'text[]', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1', many: true },
          }),
          col('mealType', 'text[]', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1', many: true },
          }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('tags', 'text[]', { notNull: true, codecRef: { codecId: 'pg/text@1', many: true } }),
          col('userId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'recipe_ingredients_elem_not_null_225187b9',
            'array_position("ingredients", NULL) IS NULL',
          ),
          checkExpression(
            'recipe_instructions_elem_not_null_fd3a69a7',
            'array_position("instructions", NULL) IS NULL',
          ),
          checkExpression(
            'recipe_mealType_elem_not_null_312ed8e5',
            'array_position("mealType", NULL) IS NULL',
          ),
          checkExpression(
            'recipe_tags_elem_not_null_aecbe9e2',
            'array_position("tags", NULL) IS NULL',
          ),
        ],
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'token',
        constraint: 'token_type_check_e8655caf',
        expression: "\"type\" IN ('REFRESH', 'EMAIL_VERIFY')",
      }),
      this.createIndex({
        schema: 'public',
        table: 'recipe',
        index: 'recipe_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'recipe',
        foreignKey: {
          name: 'recipe_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
