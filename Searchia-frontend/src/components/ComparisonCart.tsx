
import { useComparisonStore } from "@/store/comparisonStore"
import { X, ArrowRight } from "lucide-react"
import { useState } from "react"
import { compareProducts } from "../services/api"
import type { ComparisonResult } from "@/types"

export default function ComparisonCart() {
  const { products, removeProduct, clearProducts } = useComparisonStore()
  const [isComparing, setIsComparing] = useState(false)
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null)

  const handleCompare = async () => {
    if (products.length < 2) return

    setIsComparing(true)
    try {
      const result = await compareProducts(products)
      setComparisonResult(result)
    } catch (error) {
      console.error("Comparison error:", error)
    } finally {
      setIsComparing(false)
    }
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">Your comparison cart is empty</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Products to Compare ({products.length})</h2>
        <button onClick={clearProducts} className="text-sm text-gray-500 hover:text-gray-700">
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded-md p-4 relative">
            <button
              onClick={() => removeProduct(product.id)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.title}
                className="w-16 h-16 object-cover rounded-md"
              />
              <div>
                <h3 className="font-medium line-clamp-2">{product.title}</h3>
                <p className="text-sm text-gray-500">${product.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleCompare}
        disabled={products.length < 2 || isComparing}
        className="w-full py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
      >
        {isComparing ? "Comparing..." : "Compare Products"}
        {!isComparing && <ArrowRight className="h-4 w-4" />}
      </button>

      {comparisonResult && (
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Comparison Results</h3>
          <div className="space-y-4">
            {comparisonResult.rankedProducts.map((product, index) => (
              <div key={product.id} className="bg-gray-50 p-4 rounded-md">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <h4 className="font-medium">{product.title}</h4>
                </div>
                <p className="text-sm text-gray-600">{product.comparisonSummary}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

