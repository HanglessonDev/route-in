// import short from 'short-uuid';
// import { v5 as uuidv5 } from 'uuid';

export class AutocompleteAddress {
  id?: number;
  // uuid?: string;
  zipCode: string;
  type: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  formattedAddress: string;
  formattedZipCode: string;
  complement?: string;
  aliases?: string[];
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(data: Partial<AutocompleteAddress>) {
    this.zipCode = data.zipCode || '';
    this.type = data.type || '';
    this.street = data.street || '';
    this.neighborhood = data.neighborhood || '';
    this.city = data.city || '';
    this.state = data.state || '';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.active = data.active || true;
    this.aliases = data.aliases || [];
    this.formattedZipCode = this.formatZipCode();
    this.formattedAddress = this.formatAddress();
    // this.uuid = data.uuid || this.generateShortUUID();

    Object.assign(this, data);
  }

  public static create(
    data: Partial<AutocompleteAddress>
  ): AutocompleteAddress {
    return new AutocompleteAddress(data);
  }

  private formatZipCode(): string {
    return this.zipCode.replace(/(\d{5})(\d{3})/, '$1-$2');
  }

  private formatAddress(): string {
    return `${this.street}, ${this.neighborhood}, ${this.city} - ${this.state}`;
  }

  // private generateShortUUID(): string {
  //   const translator = short();
  //   const namespace = '1b671a64-40d5-491e-99b0-da01ff1f3341';

  //   if (namespace === undefined) {
  //     throw new Error('namespace não pode ser undefined');
  //   }

  //   const uuid = uuidv5(this.formattedAddress, namespace);
  //   return translator.fromUUID(uuid);
  // }
}
