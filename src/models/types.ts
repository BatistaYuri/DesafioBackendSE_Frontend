export type Bill = {
  id: number;
  orders: Order[];
  additions: number[];
  discounts: number[];
};

export type Order = {
  id: number;
  name: string;
  price: number;
  person: Person | undefined;
};

export type Person = {
  id: number;
  name: string;
  email: string;
  payer: boolean;
};

export type Payment = {
  person: Person;
  price: number;
  url: string;
};

export type AddDisc = {
  id: number;
  name: string;
  price: number;
};
