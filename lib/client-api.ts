"use client";
// Browser-side calls for PRIVATE data: the quote list (TheCoins cart), login and
// quote requests. Never cached.
import { API_KEY, API_URL, TENANT_ID } from "./config";

const SESSION_KEY = "cart_session";
const AUTH_KEY = "session";
const CUSTOMER_KEY = "customer";

function safeGet(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function safeSet(key: string, v: string | null) {
  try {
    if (v === null) localStorage.removeItem(key);
    else localStorage.setItem(key, v);
  } catch {}
}

export function getSessionId(): string {
  let id = safeGet(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    safeSet(SESSION_KEY, id);
  }
  return id;
}

export interface AuthSession {
  token: string;
  customerId: string;
  expiresAt: string;
}

export function getAuth(): { session: AuthSession; customer: any } | null {
  try {
    const s = JSON.parse(safeGet(AUTH_KEY) || "null") as AuthSession | null;
    if (!s || new Date(s.expiresAt) < new Date()) return null;
    return { session: s, customer: JSON.parse(safeGet(CUSTOMER_KEY) || "null") };
  } catch {
    return null;
  }
}

export function saveAuth(session: AuthSession | null, customer: any) {
  safeSet(AUTH_KEY, session ? JSON.stringify(session) : null);
  safeSet(CUSTOMER_KEY, customer ? JSON.stringify(customer) : null);
}

export class ApiError extends Error {
  constructor(message: string, public status: number, public body: any) {
    super(message);
  }
}

async function call<T = any>(
  path: string,
  init: { method?: "GET" | "POST"; body?: any; token?: string; query?: Record<string, string> } = {},
): Promise<T> {
  const url = new URL(`${API_URL}/${path}`);
  for (const [k, v] of Object.entries(init.query ?? {})) url.searchParams.set(k, v);
  const res = await fetch(url, {
    method: init.method ?? "POST",
    cache: "no-store",
    headers: {
      apikey: API_KEY,
      "Content-Type": "application/json",
      Authorization: `Bearer ${init.token ?? API_KEY}`,
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
  });
  let data: any = null;
  try {
    data = await res.json();
  } catch {}
  if (!res.ok || data?.success === false) {
    throw new ApiError(data?.error || data?.message || `Request failed (${res.status})`, res.status, data);
  }
  return data as T;
}

function owner() {
  const auth = getAuth();
  return auth ? { customer_id: auth.session.customerId } : { session_id: getSessionId() };
}

export interface QuoteListResponse {
  cart: { id: string; subtotal: number; total: number } | null;
  items: any[];
  items_count: number;
}

/** The quote list is stored as a TheCoins cart, so the team can see it in the dashboard. */
export const quoteListApi = {
  get: () => call<QuoteListResponse>("cart/get", { body: { tenant_id: TENANT_ID, ...owner() } }),
  add: (payload: { menu_item_id: string; quantity: number; modifiers?: any }) =>
    call<QuoteListResponse>("cart/add", { body: { tenant_id: TENANT_ID, ...owner(), ...payload } }),
  update: (item_id: string, quantity: number) =>
    call<QuoteListResponse>("cart/update", { body: { tenant_id: TENANT_ID, ...owner(), item_id, quantity } }),
  remove: (item_id: string) =>
    call<QuoteListResponse>("cart/remove", { body: { tenant_id: TENANT_ID, ...owner(), item_id } }),
  clear: () => call("cart/clear", { body: { tenant_id: TENANT_ID, ...owner() } }),
  mergeIntoCustomer: (customer_id: string) =>
    call("cart/merge", { body: { tenant_id: TENANT_ID, session_id: getSessionId(), customer_id } }),
};

export interface FormField {
  id: string;
  field_name: string;
  field_type: string;
  field_label: string;
  placeholder: string | null;
  is_required: boolean;
  sort_order: number;
  options: any;
  validation_regex: string | null;
  validation_message: string | null;
}

/** The store's contact-form fields (configured in the TheCoins dashboard). */
export const contactFormApi = {
  fields: () => call<{ fields: FormField[] }>("contact-form", { method: "GET", query: { tenant_id: TENANT_ID } }),
  submit: (form_data: Record<string, string>, extra: Record<string, string> = {}) => {
    const auth = getAuth();
    return call<{ submission_id: string }>("contact-form", {
      body: { tenant_id: TENANT_ID, form_data, ...extra },
      token: auth?.session.token,
    });
  },
};

export const authApi = {
  sendOtp: (phone: string) => call("send-otp", { body: { phone, tenantId: TENANT_ID } }),
  verifyOtp: (phone: string, code: string, name?: string) =>
    call<{ success: boolean; customer: any; needsName: boolean; session?: AuthSession }>("verify-otp", {
      body: { phone, code, tenantId: TENANT_ID, ...(name ? { name } : {}) },
    }),
  orders: (token: string) => call<{ orders: any[] }>("get-customer-orders", { method: "GET", token }),
};
