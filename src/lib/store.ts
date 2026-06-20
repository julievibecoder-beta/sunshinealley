import { useEffect, useState } from "react";
import { products as seedProducts, type Product, type Category } from "@/data/products";
import { craftsmen as seedCraftsmen, type Craftsman } from "@/data/craftsmen";

const PRODUCTS_KEY = "kc_products_v1";
const CRAFTSMEN_KEY = "kc_craftsmen_v1";
const CHANGE_EVENT = "kc-store-change";

const isClient = typeof window !== "undefined";

function read<T>(key: string, fallback: T): T {
  if (!isClient) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    /* ignore */
  }
  return fallback;
}

function write<T>(key: string, value: T) {
  if (!isClient) return;
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function loadProducts(): Product[] {
  return read(PRODUCTS_KEY, seedProducts);
}
export function saveProducts(items: Product[]) {
  write(PRODUCTS_KEY, items);
}
export function loadCraftsmen(): Craftsman[] {
  return read(CRAFTSMEN_KEY, seedCraftsmen);
}
export function saveCraftsmen(items: Craftsman[]) {
  write(CRAFTSMEN_KEY, items);
}

export function resetStore() {
  if (!isClient) return;
  localStorage.removeItem(PRODUCTS_KEY);
  localStorage.removeItem(CRAFTSMEN_KEY);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function useStore<T>(loader: () => T): T {
  const [value, setValue] = useState<T>(loader);
  useEffect(() => {
    setValue(loader());
    const onChange = () => setValue(loader());
    window.addEventListener(CHANGE_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(CHANGE_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return value;
}

export function useProducts(): Product[] {
  return useStore(loadProducts);
}
export function useCraftsmen(): Craftsman[] {
  return useStore(loadCraftsmen);
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type { Product, Craftsman, Category };
