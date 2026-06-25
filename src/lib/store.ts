import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { categoriesSeed, products as seedProducts } from "@/data/products";
import {
  getCatalogue,
  saveCategoriesFn,
  saveProductsFn,
  resetCatalogueFn,
  type Product,
  type CategoryDef,
} from "./catalogue.functions";

export type { Product, CategoryDef };

const CATALOGUE_KEY = ["catalogue"] as const;

// Module-level cache so sync loaders (loadProducts/loadCategories) still work.
let cache: { products: Product[]; categories: CategoryDef[] } = {
  products: seedProducts,
  categories: categoriesSeed,
};

async function fetchCatalogue() {
  const data = await getCatalogue();
  cache = data;
  return data;
}

export function loadProducts(): Product[] {
  return cache.products;
}
export function loadCategories(): CategoryDef[] {
  return cache.categories;
}

function useCatalogue() {
  return useQuery({
    queryKey: CATALOGUE_KEY,
    queryFn: fetchCatalogue,
    initialData: cache,
    staleTime: 30_000,
  });
}

export function useProducts(): Product[] {
  const { data } = useCatalogue();
  return useMemo(() => data?.products ?? cache.products, [data]);
}

export function useCategories(): CategoryDef[] {
  const { data } = useCatalogue();
  return useMemo(() => data?.categories ?? cache.categories, [data]);
}

// Helper to invalidate the catalogue query from any place that doesn't have access
// to a queryClient. We push into the global window event so listeners can refresh.
const REFRESH_EVENT = "kc-store-change";
const isClient = typeof window !== "undefined";

function broadcast() {
  if (isClient) window.dispatchEvent(new Event(REFRESH_EVENT));
}

export function notifyStoreChange() {
  broadcast();
}

export async function saveProducts(items: Product[]) {
  await saveProductsFn({ data: { items } });
  cache = { ...cache, products: items };
  broadcast();
}

export async function saveCategories(items: CategoryDef[]) {
  await saveCategoriesFn({ data: { items } });
  cache = { ...cache, categories: items };
  broadcast();
}

/**
 * Server-side cascade: the server already keeps product->category/subcategory
 * links via FK. The rename arguments are accepted for backwards compatibility
 * but no client-side cascade is required.
 */
export async function saveCategoriesWithCascade(
  items: CategoryDef[],
  _categoryRenames: Record<string, string> = {},
  _subRenames: Record<string, Record<string, string>> = {},
) {
  await saveCategoriesFn({ data: { items } });
  // Refresh catalogue (server reflects FK changes onto product names).
  const fresh = await fetchCatalogue();
  cache = fresh;
  broadcast();
}

export async function resetStore() {
  await resetCatalogueFn();
  const fresh = await fetchCatalogue();
  cache = fresh;
  broadcast();
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Bridge: when broadcast fires, invalidate the catalogue query so any mounted
// hook re-renders with fresh data.
export function useStoreRefreshBridge() {
  const qc = useQueryClient();
  if (isClient) {
    // Re-attaching the same listener each render is cheap and idempotent (named function).
    window.removeEventListener(REFRESH_EVENT, _bridgeHandler as EventListener);
    (_bridgeHandler as unknown as { __qc?: typeof qc }).__qc = qc;
    window.addEventListener(REFRESH_EVENT, _bridgeHandler as EventListener);
  }
  return null;
}

function _bridgeHandler() {
  const qc = (_bridgeHandler as unknown as { __qc?: ReturnType<typeof useQueryClient> }).__qc;
  if (qc) qc.invalidateQueries({ queryKey: CATALOGUE_KEY });
}
