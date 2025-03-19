import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, SearchFilters } from '../types';

interface StoreState {
  searchTerm: string;
  searchResults: Product[];
  filters: SearchFilters;
  comparisonCart: Product[];
  setSearchTerm: (term: string) => void;
  setSearchResults: (results: Product[]) => void;
  setFilters: (filters: SearchFilters) => void;
  addToComparisonCart: (product: Product) => void;
  removeFromComparisonCart: (productId: string) => void;
  clearComparisonCart: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      searchTerm: '',
      searchResults: [],
      filters: {
        sortBy: 'price',
        order: 'asc',
      },
      comparisonCart: [],
      setSearchTerm: (term) => set({ searchTerm: term }),
      setSearchResults: (results) => set({ searchResults: results }),
      setFilters: (filters) => set({ filters }),
      addToComparisonCart: (product) =>
        set((state) => ({
          comparisonCart: [...state.comparisonCart, product],
        })),
      removeFromComparisonCart: (productId) =>
        set((state) => ({
          comparisonCart: state.comparisonCart.filter((p) => p.id !== productId),
        })),
      clearComparisonCart: () => set({ comparisonCart: [] }),
    }),
    {
      name: 'ecommerce-store',
    }
  )
);