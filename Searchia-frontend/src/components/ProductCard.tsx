"use client"

import type React from "react"
import { Star, ExternalLink } from "lucide-react"
import { useNavigate } from "react-router-dom"
import type { Product } from "../types"
import { useStore } from "../store/useStore"
import { addToComparisonCart } from "../lib/api"

interface ProductCardProps {
  product: Product
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate()
  const { addToComparisonCart: addToCart } = useStore()

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await addToComparisonCart(product)
    addToCart(product)
  }

  const getMarketplace = (url: string) => {
    if (!url) return "Online Store"

    if (url.includes("ebay.com")) return "eBay"
    if (url.includes("amazon.com")) return "Amazon"
    if (url.includes("walmart.com")) return "Walmart"
    if (url.includes("etsy.com")) return "Etsy"
    if (url.includes("bestbuy.com")) return "Best Buy"
    if (url.includes("target.com")) return "Target"

    try {
      const domain = new URL(url).hostname.replace("www.", "")
      return domain.split(".")[0].charAt(0).toUpperCase() + domain.split(".")[0].slice(1)
    } catch {
      return "Online Store"
    }
  }

  const marketplace = getMarketplace(product.product_url)

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`, { state: { product } })}
      className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 hover:border-purple-100 transform hover:-translate-y-1"
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.title}
          className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Marketplace badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium shadow-sm">
          Available on {marketplace}
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-purple-700 transition-colors duration-200">
          {product.title}
        </h3>

        <div className="flex items-center mt-3">
          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-medium text-yellow-700">{product.rating} out of 5 stars</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
            $ {product.price}
          </span>
          <button
            onClick={handleAddToCart}
            className="px-3 py-1.5 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 transition-all duration-300 text-sm font-medium"
            aria-label="Add to comparison"
          >
            Compare
          </button>
        </div>

        <a
          href={product.product_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-4 block w-full text-center px-4 py-2 rounded-lg border border-gray-200 hover:border-purple-300 bg-white hover:bg-purple-50 text-gray-700 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium"
        >
          View on {marketplace}
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  )
}
