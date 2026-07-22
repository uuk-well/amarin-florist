export type Order = {
  id: string;
  vendorId: string | null;
  customerName: string;
  picOrder: string | null;
  flowerArrangement: string;
  quantity: number;
  totalPrice: number;
  vendorCost: number;
  greetingMessage: string | null;
  deliveryAddress: string | null;
  deliveryPhone?: string | null;
  customerEmail?: string | null;
  shippingCost?: number | null;
  productPhoto?: string | null;
  senderName?: string | null;
  deliveryDateTime?: string | null;
  createdAt: string;
};

export type OrderInput = {
  id: string;
  vendorId?: string | null;
  customerName: string;
  picOrder?: string | null;
  flowerArrangement: string;
  quantity?: number;
  totalPrice: number;
  vendorCost?: number;
  greetingMessage?: string | null;
  deliveryAddress?: string | null;
  deliveryPhone?: string | null;
  customerEmail?: string | null;
  shippingCost?: number | null;
  productPhoto?: string | null;
  senderName?: string | null;
  deliveryDateTime?: string | null;
};
