import "server-only";
import { randomUUID } from "node:crypto";

/**
 * ============================================================================
 *  ORDER STORE (development placeholder)
 * ============================================================================
 *  Orders are kept in process memory so the checkout flow can be exercised
 *  end-to-end in development. They disappear on restart.
 *
 *  TODO(database): replace with a persistent orders table. Each order line
 *  keeps the fulfillment type and supplier so dropship lines can be routed to
 *  the right supplier adapter (src/server/suppliers) after payment succeeds.
 * ============================================================================
 */

export type OrderStatus = "draft" | "awaiting_payment" | "paid" | "fulfilling" | "shipped" | "cancelled";

export interface OrderLine {
  productId: string;
  name: string;
  slug: string;
  quantity: number;
  unitPriceCents: number;
  /** Internal routing fields – never returned to customers. */
  fulfillmentType: string;
  supplierId: string;
  supplierSku: string;
}

export interface ShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: "US";
}

export interface Order {
  id: string;
  number: string;
  email: string;
  phone?: string;
  shippingAddress: ShippingAddress;
  shippingMethod: "standard" | "expedited";
  lines: OrderLine[];
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  status: OrderStatus;
  createdAt: string;
  /** Set when a real customer account placed the order. */
  customerId?: string;
}

const globalStore = globalThis as unknown as { __imsOrders?: Map<string, Order> };
const orders = (globalStore.__imsOrders ??= new Map<string, Order>());

export async function saveOrder(input: Omit<Order, "id" | "number" | "createdAt">): Promise<Order> {
  const id = randomUUID();
  const number = `IMS-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  const order: Order = { ...input, id, number, createdAt: new Date().toISOString() };
  orders.set(id, order);
  return order;
}

export async function getOrder(id: string) {
  return orders.get(id);
}

export async function findOrderByNumber(number: string, email: string) {
  const n = number.trim().toUpperCase();
  const e = email.trim().toLowerCase();
  return [...orders.values()].find((o) => o.number === n && o.email.toLowerCase() === e);
}

/** Customer-safe view of an order (no supplier routing data). */
export function toPublicOrder(o: Order) {
  return {
    number: o.number,
    email: o.email,
    status: o.status,
    createdAt: o.createdAt,
    shippingMethod: o.shippingMethod,
    shippingAddress: o.shippingAddress,
    lines: o.lines.map((l) => ({ name: l.name, slug: l.slug, quantity: l.quantity, unitPriceCents: l.unitPriceCents })),
    subtotalCents: o.subtotalCents,
    shippingCents: o.shippingCents,
    taxCents: o.taxCents,
    totalCents: o.totalCents,
  };
}

export type PublicOrder = ReturnType<typeof toPublicOrder>;
