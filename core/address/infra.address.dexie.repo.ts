import { dexieDB } from './adapter.dexie';
import type { Address } from './domain.entities';
import type { AddressRepository } from './port.address.repo';

export class AddressDexieRepository implements AddressRepository {
  async findById(id: string): Promise<Address | null> {
    if (!id) return null;

    try {
      const address = await dexieDB.addresses.get(id);
      if (!address) {
        return null;
      }
      return address;
    } catch (error) {
      console.error('Error fetching address by ID:', error);
      throw new Error('Failed to fetch address by ID');
    }
  }

  async findByZipCode(zipCode: string): Promise<Address[]> {
    if (!zipCode) return [];
    try {
      const address = await dexieDB.addresses
        .where('zipCode')
        .equals(zipCode)
        .toArray();
      if (!address) {
        return [];
      }
      return address;
    } catch (error) {
      console.error('Error fetching address by zip code:', error);
      throw new Error('Failed to fetch address by zip code');
    }
  }

  async findByStreet(street: string): Promise<Address[]> {
    if (!street) return [];
    try {
      const address = await dexieDB.addresses
        .where('street')
        .equalsIgnoreCase(street)
        .toArray();
      if (!address) {
        return [];
      }
      return address;
    } catch (error) {
      console.error('Error fetching address by street:', error);
      throw new Error('Failed to fetch address by street');
    }
  }

  async add(address: Address): Promise<string> {
    try {
      address.updatedAt = new Date();
      if (!address.id) {
        address.createdAt = new Date();
        return await dexieDB.addresses.add(address);
      } else {
        await dexieDB.addresses.update(address.id, address);
        return address.id;
      }
    } catch (error) {
      console.error('Error adding/updating address:', error);
      throw new Error('Failed to add/update address');
    }
  }

  async bulkAdd(addresses: Address[]): Promise<void> {
    if (!addresses || addresses.length === 0) return Promise.resolve();

    try {
      // Opcionalmente, adicionar atualização de timestamps aqui
      const now = new Date();
      const preparedAddresses = addresses.map((address) => ({
        ...address,
        updatedAt: now,
        createdAt: address.createdAt || now,
      }));

      await dexieDB.addresses.bulkAdd(preparedAddresses);
    } catch (error) {
      console.error('Error bulk adding addresses:', error);
      throw new Error('Failed to bulk add addresses');
    }
  }

  async delete(id: string): Promise<void> {
    if (!id) {
      throw new Error('ID is required to delete an address');
    }

    // Checa se o ID existe antes de tentar deletar
    const address = await dexieDB.addresses.get(id);
    if (!address) {
      throw new Error(`Address with ID ${id} not found`);
    }

    // Deleta o endereço
    await dexieDB.addresses.delete(id);
  }

  async findAll(): Promise<Address[]> {
    try {
      return await dexieDB.addresses.toArray();
    } catch (error) {
      console.error('Error fetching all addresses:', error);
      throw new Error('Failed to fetch all addresses');
    }
  }

  async importFromJSON(jsonString: string): Promise<string[]> {
    try {
      // Valida e parse do JSON
      let addresses: Address[];
      try {
        addresses = JSON.parse(jsonString);
      } catch {
        throw new Error('Invalid JSON format');
      }

      // Validações adicionais...
      if (!Array.isArray(addresses)) {
        throw new Error('JSON content must be an array of addresses');
      }

      // Coletar IDs antes da importação (se existirem)
      const addressIds = addresses
        .map((address) => address.id)
        .filter((id): id is string => id !== undefined);

      // Utiliza o bulkAdd para fazer a inserção
      await this.bulkAdd(addresses);

      return addressIds;
    } catch (error) {
      console.error('Error importing addresses from JSON:', error);
      throw new Error(
        `Failed to import addresses from JSON: ${(error as Error).message}`
      );
    }
  }

  async exportToJSON(): Promise<string> {
    try {
      // Busca todos os endereços do banco
      const addresses = await this.findAll();

      // Converte para string JSON formatada
      return JSON.stringify(addresses, null, 2);
    } catch (error) {
      console.error('Error exporting addresses to JSON:', error);
      throw new Error('Failed to export addresses to JSON');
    }
  }
}
