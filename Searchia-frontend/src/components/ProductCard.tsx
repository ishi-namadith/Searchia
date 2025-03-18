
import { Link } from "react-router-dom"
import { ExternalLink, Star, PlusCircle } from "lucide-react"
import type { Product } from "@/types"
import { useComparisonStore } from "@/store/comparisonStore"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addProduct } = useComparisonStore()

  const handleAddToComparison = () => {
    addProduct(product)
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img src={product.image || "/placeholder.svg"} alt={product.title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>
        <div className="flex items-center mb-2">
          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          <span className="ml-1 text-sm">{product.rating}</span>
        </div>
        <p className="text-lg font-bold mb-3">${product.price}</p>
        <div className="flex gap-2">
          <Link
            to={`/product/${product.id}`}
            className="flex-1 px-3 py-2 bg-primary text-white text-center rounded-md hover:bg-primary/90 transition-colors text-sm"
          >
            View Details
          </Link>
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <ExternalLink className="h-5 w-5" />
          </a>
        </div>
        <button
          onClick={handleAddToComparison}
          className="w-full mt-2 px-3 py-2 flex items-center justify-center gap-2 border border-primary text-primary rounded-md hover:bg-primary/10 transition-colors text-sm"
        >
          <PlusCircle className="h-4 w-4" />
          Add to Comparison
        </button>
      </div>
    </div>
  )
}

