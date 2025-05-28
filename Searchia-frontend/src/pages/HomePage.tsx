"use client"

import { useState, useEffect } from "react"
import { ShoppingCart } from "lucide-react"
import { Link } from "react-router-dom"
import { SearchBar } from "../components/SearchBar"
import { FilterDropdown } from "../components/FilterDropdown"
import { ProductGrid } from "../components/ProductGrid"
import { useStore } from "../store/useStore"

export const HomePage = () => {
  const { searchResults } = useStore()
  const [hasSearched, setHasSearched] = useState(false)

  // Set hasSearched to true when search results appear
  useEffect(() => {
    if (searchResults.length > 0 && !hasSearched) {
      setHasSearched(true)
    }
  }, [searchResults])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Add the keyframes for the floating animation only */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      <div
        className={`transition-all duration-700 ease-in-out ${
          hasSearched ? "pt-6" : "flex flex-col justify-center items-center h-screen"
        }`}
      >
        <header className={`w-full ${hasSearched ? "bg-white shadow-md" : "bg-transparent shadow-none"}`}>
          <div className={`max-w-7xl mx-auto px-4 py-6 ${hasSearched ? "" : "flex flex-col items-center"}`}>
            {/* Mobile layout for post-search state */}
            {hasSearched && (
              <div className="flex flex-col items-center gap-4 md:hidden w-full mb-6">
                <h1 className="font-bold text-4xl text-gray-900 relative group">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
                    Searchia
                  </span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
                </h1>

                <div className="w-full">
                  <SearchBar />
                </div>

                <Link
                  to="/cart"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:from-purple-700 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>View Comparison Cart</span>
                </Link>
              </div>
            )}

            {/* Original desktop layout for post-search state */}
            {hasSearched && (
              <div className="hidden md:block">
                <div className="flex justify-between items-center mb-6 w-full">
                  <h1 className="font-bold text-4xl text-gray-900 relative group">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
                      Searchia
                    </span>
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
                  </h1>

                  <Link
                    to="/cart"
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:from-purple-700 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>View Comparison Cart</span>
                  </Link>
                </div>

                <div className="w-full">
                  <SearchBar />
                </div>
              </div>
            )}

            {/* Initial state layout (same for both mobile and desktop) */}
            {!hasSearched && (
              <>
                <div className="flex justify-center items-center mb-6 w-full">
                  <h1 className="font-bold text-5xl md:text-7xl text-gray-900 relative group mb-2 float-animation">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
                      Searchia
                    </span>
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
                  </h1>
                </div>

                <div className="w-full max-w-2xl relative">
                  <SearchBar />

                  <p className="text-center mt-8 text-xl text-gray-500 font-light">
                    Discover and compare products from across the web
                  </p>
                </div>
              </>
            )}
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8 w-full">
          {searchResults.length > 0 ? (
            <div className="animate-fadeIn">
              <div className="flex justify-end mb-6">
                <FilterDropdown />
              </div>
              <ProductGrid />
            </div>
          ) : hasSearched ? (
            <div className="text-center py-20 animate-fadeIn">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">No results found</h2>
              <p className="text-gray-500 max-w-md mx-auto">Try adjusting your search terms or filters</p>
            </div>
          ) : (
            <div className="hidden">{/* This div is intentionally empty and hidden */}</div>
          )}
        </main>

        {!hasSearched && (
          <footer className="fixed bottom-8 w-full text-center text-gray-400">
            <p className="text-sm">Powered by advanced web scraping and AI technology</p>
          </footer>
        )}
      </div>
    </div>
  )
}
