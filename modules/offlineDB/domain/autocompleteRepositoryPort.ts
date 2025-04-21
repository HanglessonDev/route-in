import type { AutocompleteAddress } from './autocompleteAddressEntitie';
export interface AutocompleteRepositoryPort {
  getById(id: number): Promise<AutocompleteAddress | null>;
  getByZipCode(zipCode: string): Promise<AutocompleteAddress[]>;
  getByStreet(street: string): Promise<AutocompleteAddress[]>;
  add(address: AutocompleteAddress): Promise<number>;
  bulkAdd(addresses: AutocompleteAddress[]): Promise<void>;
  delete(id: number): Promise<void>;
  getAll(): Promise<AutocompleteAddress[]>;
  importFromJSON(jsonString: string): Promise<void>;
  exportToJSON(): Promise<string>;
  update(address: AutocompleteAddress): Promise<void>;
  getPaginated(page: number, pageSize: number): Promise<AutocompleteAddress[]>;
  getCount(): Promise<number>;
}
