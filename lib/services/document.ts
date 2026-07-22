import type { Order } from "../models/order";

export type InvoiceDoc = {
  type: "invoice";
  invoiceNo: string;
  date: string;
  customerName: string;
  picOrder: string | null;
  flowerArrangement: string;
  quantity: number;
  vendorName: string | null;
  totalPrice: number;
  vendorCost: number;
};

export type SuratJalanDoc = {
  type: "surat_jalan";
  invoiceNo: string;
  date: string;
  customerName: string;
  picOrder: string | null;
  flowerArrangement: string;
  quantity: number;
  deliveryAddress: string | null;
  greetingMessage: string | null;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function buildInvoiceDoc(order: Order, vendorName: string | null): InvoiceDoc {
  return {
    type: "invoice",
    invoiceNo: order.id,
    date: formatDate(order.createdAt),
    customerName: order.customerName,
    picOrder: order.picOrder,
    flowerArrangement: order.flowerArrangement,
    quantity: order.quantity,
    vendorName,
    totalPrice: order.totalPrice,
    vendorCost: order.vendorCost,
  };
}

export function buildSuratJalanDoc(order: Order): SuratJalanDoc {
  return {
    type: "surat_jalan",
    invoiceNo: order.id,
    date: formatDate(order.createdAt),
    customerName: order.customerName,
    picOrder: order.picOrder,
    flowerArrangement: order.flowerArrangement,
    quantity: order.quantity,
    deliveryAddress: order.deliveryAddress,
    greetingMessage: order.greetingMessage,
  };
}
