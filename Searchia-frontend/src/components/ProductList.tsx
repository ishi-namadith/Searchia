import { useSearchStore } from "@/store/searchStore"
import ProductCard from "./ProductCard"

export default function ProductList() {
  const { results, searchQuery, isLoading } = useSearchStore()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (results.length === 0 && searchQuery) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">No products found for "{searchQuery}"</p>
      </div>
    )
  }

  if (results.length === 0) {
    return null
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Search Results for "{searchQuery}"</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {results.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

