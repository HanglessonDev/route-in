import { idb } from '~/plugins/dexie.client';
import { AutocompleteAddress } from '../domain/autocompleteAddressEntitie';
import type { AutocompleteRepositoryPort } from '../domain/autocompleteRepositoryPort';

export class AutocompleteRepository implements AutocompleteRepositoryPort {
  async getById(id: number): Promise<AutocompleteAddress | null> {
    const address = await idb.autocomplete.get(id);
    return address ? AutocompleteAddress.create(address) : null;
  }

  async getByZipCode(zipCode: string): Promise<AutocompleteAddress[]> {
    const addresses = await idb.autocomplete
      .where('zipCode')
      .equals(zipCode)
      .toArray();
    return addresses.map((addr) => AutocompleteAddress.create(addr));
  }

  async getByStreet(street: string): Promise<AutocompleteAddress[]> {
    const addresses = await idb.autocomplete
      .where('street')
      .equals(street)
      .toArray();
    return addresses.map((addr) => AutocompleteAddress.create(addr));
  }

  async add(address: AutocompleteAddress): Promise<number> {
    const id = await idb.autocomplete.add(address);
    return id;
  }

  async update(address: AutocompleteAddress): Promise<void> {
    if (!address.id) throw new Error('ID is required to update an address');
    address.updatedAt = new Date();
    await idb.autocomplete.update(address.id, address);
  }

  async bulkAdd(addresses: AutocompleteAddress[]): Promise<void> {
    await idb.autocomplete.bulkAdd(addresses);
  }

  async delete(id: number): Promise<void> {
    await idb.autocomplete.delete(id);
  }

  async getAll(): Promise<AutocompleteAddress[]> {
    const addresses = await idb.autocomplete.toArray();
    return addresses.map((addr) => AutocompleteAddress.create(addr));
  }

  async importFromJSON(jsonString: string): Promise<void> {
    try {
      const addresses = JSON.parse(jsonString);
      const validAddresses = addresses
        .filter(
          (addr: AutocompleteAddress) =>
            addr.zipCode && addr.street && addr.state
        )
        .map((addr: AutocompleteAddress) => AutocompleteAddress.create(addr));

      return await this.bulkAdd(validAddresses);
    } catch (error) {
      console.error('Error importing addresses from JSON:', error);
      throw new Error(
        `Failed to import addresses from JSON: ${(error as Error).message}`
      );
    }
  }

  async exportToJSON(): Promise<string> {
    const addresses = await this.getAll();
    return JSON.stringify(addresses, null, 2);
  }

  async getCount(): Promise<number> {
    return await idb.autocomplete.count();
  }

  async getPaginated(
    page: number,
    pageSize: number
  ): Promise<AutocompleteAddress[]> {
    const offset = (page - 1) * pageSize;
    const addresses = await idb.autocomplete
      .offset(offset)
      .limit(pageSize)
      .toArray();
    return addresses.map((addr) => AutocompleteAddress.create(addr));
  }
}
