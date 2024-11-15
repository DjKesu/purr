export type PhoneNumber = {
  number: string;
  countryCode?: string; // Optional field from Swift's optional String
};

export interface Contact {
    id: string;
    name: string;
    phone: string[] | string;
    selected?: boolean;
  }
  
  export interface Group {
    id: string;
    name: string;
  members: Contact[];
}
