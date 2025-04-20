import { AddressDexieRepository } from '~/core/address/infra.address.dexie.repo';
import type { AddressRepository } from '~/core/address/port.address.repo';

export default defineNuxtPlugin(async (nuxtApp) => {
  // Configuração de persistencia
  const setupPersistence = async () => {
    if (await navigator.storage?.persist()) {
      const isPersisted = await navigator.storage.persisted();
      console.log('Persistencia garantida:', isPersisted);

      const { usage, quota } = await navigator.storage.estimate();
      console.log(`Armazenamento utilizado: ${usage} bytes/${quota} bytes`);
    }
  };

  await setupPersistence();

  // injetando o DexieDB no contexto do Nuxt
  const addressRepo: AddressRepository = new AddressDexieRepository();
  nuxtApp.provide('addressRepo', addressRepo);
});
