import Dexie from 'dexie';
import type { AutocompleteAddress } from '~/modules/offlineDB/domain/autocompleteAddressEntitie';

export class DexieDatabase extends Dexie {
  autocomplete: Dexie.Table<AutocompleteAddress, number>;

  constructor() {
    super('RouteInIDB');
    this.version(1).stores({
      autocomplete: `
        ++id,
        &zipCode,
        street,
        *aliases,
        active,
        createdAt,
        updatedAt`,
    });
    this.autocomplete = this.table('autocomplete');
  }
}

async function setupPersistence() {
  if (await navigator.storage?.persist()) {
    const isPersisted = await navigator.storage.persisted();
    console.log('Persistencia garantida:', isPersisted);

    const { usage, quota } = await navigator.storage.estimate();
    console.log(`Armazenamento utilizado: ${usage} bytes/${quota} bytes`);
  }
}

export const idb = new DexieDatabase();

export default defineNuxtPlugin(async () => {
  const idb = new DexieDatabase();

  await setupPersistence();

  return {
    provide: {
      idb,
    },
  };
});
