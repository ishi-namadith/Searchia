import axios from "axios"
import type { Product, ProductDetails, ComparisonResult } from "@/types"

// Create an axios instance with default config
const api = axios.create({
  baseURL: "/api", // Replace with your actual API base URL
  headers: {
    "Content-Type": "application/json",
  },
})

// Search products across multiple sources
export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    // Make parallel requests to all three scraper endpoints
    const [source1, source2, source3] = await Promise.all([
      api.get(`/scraper/source1?query=${encodeURIComponent(query)}`),
      api.get(`/scraper/source2?query=${encodeURIComponent(query)}`),
      api.get(`/scraper/source3?query=${encodeURIComponent(query)}`),
    ])

    // Combine and deduplicate results
    const allResults = [...source1.data, ...source2.data, ...source3.data]

    // Return combined results
    return allResults
  } catch (error) {
    console.error("Error searching products:", error)
    throw error
  }
}

// Get detailed product information
export const getProductDetails = async (productId: string): Promise<ProductDetails> => {
  try {
    const response = await api.get(`/products/${productId}/details`)
    return response.data
  } catch (error) {
    console.error("Error fetching product details:", error)
    throw error
  }
}

// Compare products using the RAG-based LLM
export const compareProducts = async (products: Product[]): Promise<ComparisonResult> => {
  try {
    const response = await api.post("/compare", { products })
    return response.data
  } catch (error) {
    console.error("Error comparing products:", error)
    throw error
  }
}

