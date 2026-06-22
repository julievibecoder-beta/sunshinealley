import { useEffect, useState } from "react";
import {
  products as seedProducts,
  categoriesSeed,
  type Product,
  type CategoryDef,
} from "@/data/products";

const PRODUCTS_KEY = "kc_products_v1";
const CATEGORIES_KEY = "kc_categories_v1";
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
export function loadCategories(): CategoryDef[] {
  return read(CATEGORIES_KEY, categoriesSeed);
}
export function saveCategories(items: CategoryDef[]) {
  write(CATEGORIES_KEY, items);
}

/**
 * Save categories AND cascade rename changes onto products so the
 * category/subcategory link is preserved when names are edited.
 *
 * categoryRenames : map of old category name -> new category name
 * subRenames      : map keyed by NEW category name, then old subcategory
 *                   name -> new subcategory name
 */
export function saveCategoriesWithCascade(
  items: CategoryDef[],
  categoryRenames: Record<string, string> = {},
  subRenames: Record<string, Record<string, string>> = {},
) {
  const products = loadProducts();
  const updated = products.map((p) => {
    let category = p.category;
    let subcategory = p.subcategory;
    if (categoryRenames[category]) category = categoryRenames[category];
    const subMap = subRenames[category];
    if (subMap && subcategory && subMap[subcategory]) {
      subcategory = subMap[subcategory];
    }
    if (category === p.category && subcategory === p.subcategory) return p;
    return { ...p, category, subcategory };
  });
  saveProducts(updated);
  saveCategories(items);
}

export function notifyStoreChange() {
  if (!isClient) return;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function resetStore() {
  if (!isClient) return;
  localStorage.removeItem(PRODUCTS_KEY);
  localStorage.removeItem(CATEGORIES_KEY);
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
export function useCategories(): CategoryDef[] {
  return useStore(loadCategories);
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type { Product, CategoryDef };
