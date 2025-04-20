import type { Address } from './domain.entities';

export interface AddressRepository {
  findById(id: string): Promise<Address | null>;
  findByZipCode(zipCode: string): Promise<Address[]>;
  findByStreet(street: string): Promise<Address[]>;
  add(address: Address): Promise<string>;
  bulkAdd(addresses: Address[]): Promise<void>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Address[]>;
  importFromJSON(jsonString: string): Promise<string[]>;
  exportToJSON(): Promise<string>;
}
