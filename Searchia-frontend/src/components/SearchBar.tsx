"use client"

import type React from "react"
import { useState } from "react"
import { Search, Loader2 } from "lucide-react"
import { useStore } from "../store/useStore"
import { searchProducts } from "../lib/api"
import { cn } from "../lib/utils"

export const SearchBar = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const { setSearchTerm, setSearchResults, clearSearchState } = useStore()

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const query = formData.get("search") as string

    if (!query.trim()) {
      clearSearchState() 
      return
    }

    setIsLoading(true)
    setSearchTerm(query)
    const results = await searchProducts(query)
    setSearchResults(results)
    setIsLoading(false)
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <form onSubmit={handleSearch} className="w-full">
        <div
          className={cn(
            "relative flex items-center transition-all duration-300 bg-white rounded-full",
            "shadow-sm border border-gray-200",
            isFocused
              ? "ring-2 ring-purple-400 shadow-lg border-transparent"
              : "hover:shadow-md hover:border-purple-200 transition-all duration-300",
          )}
        >
          <div className="flex items-center justify-center pl-4">
            <Search
              className={cn("w-5 h-5 transition-colors duration-300", isFocused ? "text-purple-500" : "text-gray-400")}
            />
          </div>

          <input
            type="search"
            name="search"
            placeholder="Search for products..."
            className="w-full px-3 py-3.5 bg-transparent border-none focus:outline-none text-gray-700 overflow-ellipsis truncate placeholder:text-gray-400 placeholder:transition-all placeholder:duration-300 focus:placeholder:text-purple-300"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />

          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "absolute right-1 rounded-full p-2.5 transition-all duration-300",
              "text-white bg-gradient-to-r from-purple-600 to-pink-500",
              "hover:from-purple-700 hover:to-pink-600",
              "focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2",
              "shadow-md hover:shadow-lg transform hover:-translate-y-0.5",
              isLoading ? "opacity-80 cursor-not-allowed" : "",
            )}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </button>
        </div>
      </form>
    </div>
  )
}
