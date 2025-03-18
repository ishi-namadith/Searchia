import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Product } from "@/types"

interface ComparisonState {
  products: Product[]
  addProduct: (product: Product) => void
  removeProduct: (productId: string) => void
  clearProducts: () => void
}

export const useComparisonStore = create<ComparisonState>()(
  persist(
    (set) => ({
      products: [],
      addProduct: (product) =>
        set((state) => {
          // Check if product already exists in comparison
          if (state.products.some((p) => p.id === product.id)) {
            return state
          }
          return { products: [...state.products, product] }
        }),
      removeProduct: (productId) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== productId),
        })),
      clearProducts: () => set({ products: [] }),
    }),
    {
      name: "comparison-store",
    },
  ),
)

