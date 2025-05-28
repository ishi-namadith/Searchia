"use client"

import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { ArrowLeft, Star, ShoppingCart, ExternalLink, Check } from "lucide-react"
import type { Product } from "../types"
import { getProductDetails, addToComparisonCart } from "../lib/api"
import { useStore } from "../store/useStore"

// Add animation delay utility class
const animationDelayStyles = `
  .animation-delay-150 {
    animation-delay: 150ms;
  }
  .animation-delay-300 {
    animation-delay: 300ms;
  }
`

export const ProductPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [details, setDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { addToComparisonCart: addToCart } = useStore()
  const product = location.state?.product as Product
  const [hasCalledApi, setHasCalledApi] = useState(false)

  // Add a new state for sequential loading messages
  const [loadingMessage, setLoadingMessage] = useState("Gathering reviews...")

  const fetchDetails = async () => {
    console.log("fetchDetails called for URL:", product?.product_url)
    if (!product?.product_url) {
      console.log("No product URL, skipping fetch")
      setLoading(false)
      return
    }
    setLoading(true)
    const data = await getProductDetails(product.product_url)
    console.log("fetchDetails received data:", data)
    setDetails(data)
    setLoading(false)
  }

  useEffect(() => {
    if (!product) {
      navigate("/")
      return
    }

    if (!hasCalledApi) {
      fetchDetails()
      setHasCalledApi(true)
    }
  }, [product, navigate, hasCalledApi])

  // Add this useEffect for sequential loading messages
  useEffect(() => {
    if (!loading) return

    // Start with "Gathering reviews..."
    setLoadingMessage("Gathering reviews...")

    // After 2 seconds, change to "Summarizing reviews..."
    const firstTimeout = setTimeout(() => {
      setLoadingMessage("Summarizing reviews...")

      // After another 2 seconds, change to the final message
      const secondTimeout = setTimeout(() => {
        setLoadingMessage("Please be patient while we analyze reviews for you...")
      }, 2000)

      return () => clearTimeout(secondTimeout)
    }, 2000)

    return () => clearTimeout(firstTimeout)
  }, [loading])

  if (!product) return null

  const handleAddToCart = async () => {
    await addToComparisonCart(product)
    addToCart(product)
  }
  if (product?.product_url.startsWith("https://www.amazon.com")) 
    { product.source = "Amazon" }
  else if (product?.product_url.startsWith("https://www.ebay.com"))
    { product.source = "ebay" }

  // Add the style tag for animation delay
  return (
    <>
      <style>{animationDelayStyles}</style>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-purple-700 mb-8 group transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-medium">Back to Search Results</span>
          </button>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Product Header */}
            <div className="bg-gradient-to-r from-purple-600/10 to-pink-500/10 p-6 border-b border-gray-100">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{product.title}</h1>
              <div className="flex items-center mt-2">
                <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1 font-medium text-yellow-700">{product.rating} out of 5 stars</span>
                </div>
                <span className="mx-3 text-gray-300">•</span>
                <span className="text-gray-500">From {product.source}</span>
              </div>
            </div>

            {/* Product Content */}
            <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
              {/* Image Column */}
              <div className="space-y-6">
                <div className="relative rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.title}
                    className="w-full object-cover aspect-square"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-purple-700 shadow-sm">
                    {product.source}
                  </div>
                </div>

                {/* <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="aspect-square rounded-lg border border-gray-200 overflow-hidden">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={`${product.title} view ${i}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div> */}
              </div>

              {/* Details Column */}
              <div className="flex flex-col">
                <div className="mb-6 pb-6 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
                      $ {product.price}
                    </span>
                    <a
                      href={product.product_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-800 flex items-center gap-1 transition-colors duration-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View on site <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white py-3.5 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Comparison Cart
                  </button>
                </div>

                {/* Product Info Message */}
                <div className="space-y-5">
                  <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                    <p className="text-gray-700 text-sm flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-purple-500" />
                      <span>
                        To view detailed product specifications and additional information, click the{" "}
                        <strong>View on site</strong> button above.
                      </span>
                    </p>
                  </div>

                  {/* Additional Images - with loading state */}
                  {loading ? (
                    <div className="animate-pulse grid grid-cols-3 gap-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="aspect-video bg-gray-200 rounded-lg h-20"></div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-3">
                      {details?.additionalImages?.length > 0
                        ? details.additionalImages.map((img: string, i: number) => (
                            <div
                              key={i}
                              className="aspect-video rounded-lg border border-gray-200 overflow-hidden shadow-sm"
                            >
                              <img
                                src={img || "/placeholder.svg"}
                                alt={`${product.title} view ${i + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))
                        : // Fallback images if no additional images from API
                          [1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="aspect-video rounded-lg border border-gray-200 overflow-hidden shadow-sm"
                            >
                              <img
                                src={product.image || "/placeholder.svg"}
                                alt={`${product.title} view ${i}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Review Analysis */}
            <div className="bg-gray-50 p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
                  Review Analysis
                </span>
                <div className="h-px flex-grow bg-gradient-to-r from-purple-600/20 to-pink-500/20 ml-4"></div>
              </h2>

              {loading ? (
                <div className="space-y-6 text-center">
                  <div className="flex justify-center">
                    <div className="relative w-20 h-20">
                      <div className="absolute inset-0 rounded-full border-4 border-purple-200 opacity-25"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-t-purple-600 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                      <div className="absolute inset-3 rounded-full border-4 border-t-pink-500 border-r-transparent border-b-transparent border-l-transparent animate-spin animation-delay-150"></div>
                      <div className="absolute inset-6 rounded-full border-4 border-t-purple-400 border-r-transparent border-b-transparent border-l-transparent animate-spin animation-delay-300"></div>
                    </div>
                  </div>
                  <div className="min-h-[2rem]">
                    <p className="text-gray-600 italic font-medium">{loadingMessage}</p>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-6 rounded-xl border border-green-100 shadow-sm">
                    <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                      <div className="p-1 rounded-full bg-green-200">
                        <Check className="w-4 h-4 text-green-700" />
                      </div>
                      Positive Reviews
                    </h3>
                    <p className="text-green-700">{details?.positive_reviews}</p>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-red-100/50 p-6 rounded-xl border border-red-100 shadow-sm">
                    <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                      <div className="p-1 rounded-full bg-red-200">
                        <ArrowLeft className="w-4 h-4 text-red-700 rotate-45" />
                      </div>
                      Negative Reviews
                    </h3>
                    <p className="text-red-700">{details?.negative_reviews}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
