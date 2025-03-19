import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { FilterDropdown } from '../components/FilterDropdown';
import { ProductGrid } from '../components/ProductGrid';
import { useStore } from '../store/useStore';

export const HomePage = () => {
  const { searchResults } = useStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Searchia</h1>
            <Link
              to="/cart"
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>View Comparison Cart</span>
            </Link>
          </div>
          <SearchBar />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {searchResults.length > 0 && (
          <>
            <div className="flex justify-end mb-6">
              <FilterDropdown />
            </div>
            <ProductGrid />
          </>
        )}
      </main>
    </div>
  );
};