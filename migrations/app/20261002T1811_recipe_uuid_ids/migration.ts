#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/2c792942f79876da37d451e6d69a0a61f35f13372bbe5ae17f830beaa1f931d5/contract';
import startContract from '../../snapshots/2c792942f79876da37d451e6d69a0a61f35f13372bbe5ae17f830beaa1f931d5/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/c898f5ee1bc6dd1ff277aaf842e72043e2ebc14cc6cbf843cd0b71197a59db56/contract';
import endContract from '../../snapshots/c898f5ee1bc6dd1ff277aaf842e72043e2ebc14cc6cbf843cd0b71197a59db56/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropDefault({ schema: 'public', table: 'recipe', column: 'id' }),
      this.alterColumnType({
        schema: 'public',
        table: 'recipe',
        column: 'id',
        options: {
          qualifiedTargetType: 'text',
          formatTypeExpected: 'text',
          rawTargetTypeForLabel: 'text',
          // Preserve recipe rows while replacing numeric IDs with UUIDs.
          using: 'gen_random_uuid()::text',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
