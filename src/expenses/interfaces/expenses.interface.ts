export class ICreateExpense {
  email: string;

  category: string;

  productName: string;

  quantity: number;

  price: number;
  totalPrice: number;
}
export class IUpdateExpense {
  email?: string;

  category?: string;

  productName?: string;

  quantity?: number;

  price?: number;
  totalPrice?: number;
}
