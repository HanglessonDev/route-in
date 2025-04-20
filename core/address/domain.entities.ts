export interface Address {
  id?: string;
  uuid?: string;
  hereId?: string;
  zipCode: string;
  formattedZipCode: string;
  type: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  formattedAddress: string;
  complement?: string;
  aliases?: string[];
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
