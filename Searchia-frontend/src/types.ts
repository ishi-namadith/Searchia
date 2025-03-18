// Basic product information from search results
export interface Product {
    id: string
    title: string
    image: string
    price: number
    rating: number
    url: string
    positiveReviews?: string[]
    negativeReviews?: string[]
  }
  
  // Detailed product information
  export interface ProductDetails {
    id: string
    description: string
    positiveReviews: string[]
    negativeReviews: string[]
    specifications?: Record<string, string>
  }
  
  // Comparison result from the RAG-based LLM
  export interface ComparisonResult {
    rankedProducts: {
      id: string
      title: string
      comparisonSummary: string
    }[]
    overallComparison: string
  }
  
  