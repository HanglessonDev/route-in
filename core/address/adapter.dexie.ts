import { Dexie } from 'dexie';
import type { Address } from './domain.entities';

class DexieDatabase extends Dexie {
  addresses!: Dexie.Table<Address, string>; // <--- Alterado para `string` (se `id` é string)

  constructor() {
    super('RouteInIDB');

    this.version(1).stores({
      addresses: `
        ++id,
        &uuid,
        &zipCode,
        street,
        *aliases,
        active,
        createdAt,
        updatedAt
      `,
    });
  }
}

export const dexieDB = new DexieDatabase();
