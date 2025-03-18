import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Product } from "@/types"

interface SearchState {
  searchQuery: string
  results: Product[]
  isLoading: boolean
  setSearchQuery: (query: string) => void
  setResults: (results: Product[]) => void
  setIsLoading: (isLoading: boolean) => void
  clearResults: () => void
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      searchQuery: "",
      results: [],
      isLoading: false,
      setSearchQuery: (query) => set({ searchQuery: query }),
      setResults: (results) => set({ results }),
      setIsLoading: (isLoading) => set({ isLoading }),
      clearResults: () => set({ results: [], searchQuery: "" }),
    }),
    {
      name: "search-store",
    },
  ),
)

