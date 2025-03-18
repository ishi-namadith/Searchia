
import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { useSearchStore } from "@/store/searchStore"
import { searchProducts } from "../services/api"

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { setResults, setSearchQuery } = useSearchStore()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    try {
      const results = await searchProducts(query)
      setResults(results)
      setSearchQuery(query)
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto mb-8">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products..."
          className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-2 top-2 px-4 py-1.5 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-70"
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </div>
    </form>
  )
}

