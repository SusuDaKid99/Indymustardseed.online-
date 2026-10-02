"use client";

import { createLocalStore, useLocalStore } from "@/lib/client/local-store";
import type { ProductCardData } from "@/lib/catalog/types";

/**
 * Customer data kept in the browser until accounts are connected.
 * TODO(auth): on sign-in, sync these lists to the customer's account record.
 */

export type SavedSnapshot = Pick<ProductCardData, "id" | "slug" | "name" | "brand" | "price" | "image">;

const favoritesStore = createLocalStore<SavedSnapshot[]>("ims-favorites-v1", []);
const recentStore = createLocalStore<SavedSnapshot[]>("ims-recent-v1", []);

export interface SavedGarden {
  id: string;
  name: string;
  createdAt: string;
  summary: string;
  productIds: string[];
}
const gardensStore = createLocalStore<SavedGarden[]>("ims-gardens-v1", []);

const snap = (p: SavedSnapshot): SavedSnapshot => ({
  id: p.id,
  slug: p.slug,
  name: p.name,
  brand: p.brand,
  price: p.price,
  image: p.image,
});

export function useFavorites() {
  const items = useLocalStore(favoritesStore);
  return {
    items,
    has: (id: string) => items.some((i) => i.id === id),
    toggle: (p: SavedSnapshot) =>
      favoritesStore.set((list) => (list.some((i) => i.id === p.id) ? list.filter((i) => i.id !== p.id) : [snap(p), ...list])),
    remove: (id: string) => favoritesStore.set((list) => list.filter((i) => i.id !== id)),
  };
}

export function useRecentlyViewed() {
  return useLocalStore(recentStore);
}

export function recordRecentlyViewed(p: SavedSnapshot) {
  recentStore.set((list) => [snap(p), ...list.filter((i) => i.id !== p.id)].slice(0, 12));
}

export function useSavedGardens() {
  const gardens = useLocalStore(gardensStore);
  return {
    gardens,
    save: (g: Omit<SavedGarden, "id" | "createdAt">) =>
      gardensStore.set((list) => [{ ...g, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...list].slice(0, 20)),
    remove: (id: string) => gardensStore.set((list) => list.filter((g) => g.id !== id)),
  };
}
