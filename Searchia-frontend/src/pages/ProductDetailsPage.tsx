import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Star, ExternalLink, PlusCircle, ThumbsUp, ThumbsDown } from "lucide-react"
import { useSearchStore } from "@/store/searchStore"
import { useComparisonStore } from "@/store/comparisonStore"
import { getProductDetails } from "../services/api"
import type { ProductDetails } from "@/types"

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { results } = useSearchStore()
  const { addProduct } = useComparisonStore()
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Find the basic product info from search results
  const basicProduct = results.find((p) => p.id === id)

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return

      setIsLoading(true)
      try {
        const details = await getProductDetails(id)
        setProductDetails(details)
        setError(null)
      } catch (err) {
        console.error("Error fetching product details:", err)
        setError("Failed to load product details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDetails()
  }, [id])

  const handleAddToComparison = () => {
    if (basicProduct && productDetails) {
      // Combine basic product info with detailed reviews
      addProduct({
        ...basicProduct,
        positiveReviews: productDetails.positiveReviews,
        negativeReviews: productDetails.negativeReviews,
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !basicProduct) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">{error || "Product not found"}</p>
        <Link to="/" className="text-primary hover:underline mt-4 inline-block">
          Return to search
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link to="/" className="inline-flex items-center text-primary hover:underline mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to search results
      </Link>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 p-6">
            <img
              src={basicProduct.image || "/placeholder.svg"}
              alt={basicProduct.title}
              className="w-full h-auto object-contain max-h-96 mx-auto"
            />
          </div>

          <div className="md:w-1/2 p-6">
            <h1 className="text-2xl font-bold mb-2">{basicProduct.title}</h1>

            <div className="flex items-center mb-4">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 text-lg">{basicProduct.rating}</span>
            </div>

            <p className="text-3xl font-bold mb-6">${basicProduct.price}</p>

            <div className="flex gap-3 mb-6">
              <a
                href={basicProduct.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex items-center"
              >
                Visit Store
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>

              <button
                onClick={handleAddToComparison}
                className="px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary/10 transition-colors flex items-center"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add to Comparison
              </button>
            </div>

            {productDetails && (
              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold mb-4">Product Description</h2>
                <p className="text-gray-700 mb-6">{productDetails.description}</p>
              </div>
            )}
          </div>
        </div>

        {productDetails && (
          <div className="p-6 border-t">
            <h2 className="text-xl font-semibold mb-4">Review Summary</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-4 rounded-md">
                <div className="flex items-center mb-3">
                  <ThumbsUp className="h-5 w-5 text-green-600 mr-2" />
                  <h3 className="font-medium text-green-800">Positive Reviews</h3>
                </div>
                <ul className="space-y-2">
                  {productDetails.positiveReviews.map((review, index) => (
                    <li key={index} className="text-sm text-gray-700">
                      • {review}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-red-50 p-4 rounded-md">
                <div className="flex items-center mb-3">
                  <ThumbsDown className="h-5 w-5 text-red-600 mr-2" />
                  <h3 className="font-medium text-red-800">Negative Reviews</h3>
                </div>
                <ul className="space-y-2">
                  {productDetails.negativeReviews.map((review, index) => (
                    <li key={index} className="text-sm text-gray-700">
                      • {review}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

