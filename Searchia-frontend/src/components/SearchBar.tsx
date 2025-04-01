import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useStore } from '../store/useStore';
import { searchProducts } from '../lib/api';

export const SearchBar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setSearchTerm, setSearchResults, clearSearchState } = useStore();

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;

    if (!query.trim()) {
      clearSearchState(); // Clear search state if query is empty
      return;
    }

    setIsLoading(true);
    setSearchTerm(query);
    const results = await searchProducts(query);
    setSearchResults(results);
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-3xl mx-auto">
      <div className="relative">
        <input
          type="search"
          name="search"
          placeholder="Search for products..."
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700"
          disabled={isLoading}
        >
          <Search className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </form>
  );
};