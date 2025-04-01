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
  clearSearchState: () => void; // New method to clear search-related states
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
      clearSearchState: () => set({ 
        searchTerm: '', 
        searchResults: [],
        filters: {
          sortBy: 'price',
          order: 'asc',
        }
      }),
    }),
    {
      name: 'ecommerce-store',
      // Add these options to control persistence and initial load
      partialize: (state) => ({
        comparisonCart: state.comparisonCart, // Only persist comparison cart
      }),
      version: 1, // Add version to help with migrations
    }
  )
);