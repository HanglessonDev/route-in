import type { AutocompleteRepository } from '../infra/autocompleteRepository';
import { AutocompleteAddress } from './autocompleteAddressEntitie';

export class AutocompleteService {
  constructor(private repository: AutocompleteRepository) {}

  async getAllAddresses(): Promise<AutocompleteAddress[]> {
    return this.repository.getAll();
  }

  async getAddressById(id: number): Promise<AutocompleteAddress | null> {
    return this.repository.getById(id);
  }

  async getAddressesByZipCode(zipCode: string): Promise<AutocompleteAddress[]> {
    return this.repository.getByZipCode(zipCode);
  }

  async getAddressesByStreet(street: string): Promise<AutocompleteAddress[]> {
    return this.repository.getByStreet(street);
  }

  async createAddress(
    addressData: Partial<AutocompleteAddress>
  ): Promise<number> {
    const address = AutocompleteAddress.create(addressData);
    return await this.repository.add(address);
  }

  async bulkCreateAddresses(addresses: AutocompleteAddress[]): Promise<void> {
    await this.repository.bulkAdd(addresses);
  }

  async updateAddress(address: AutocompleteAddress): Promise<void> {
    await this.repository.update(address);
  }

  async deleteAddress(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async exportAddresses(): Promise<string> {
    return await this.repository.exportToJSON();
  }

  async importAddresses(jsonString: string): Promise<void> {
    await this.repository.importFromJSON(jsonString);
  }

  async getPaginatedAddresses(
    page: number,
    pageSize: number
  ): Promise<AutocompleteAddress[]> {
    return await this.repository.getPaginated(page, pageSize);
  }

  async getAddressCount(): Promise<number> {
    return await this.repository.getCount();
  }
}
