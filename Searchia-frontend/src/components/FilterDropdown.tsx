import React from 'react';
import { useStore } from '../store/useStore';
import { SlidersHorizontal } from 'lucide-react';

export const FilterDropdown = () => {
  const { filters, setFilters } = useStore();

  return (
    <div className="relative flex gap-4 items-center">
      <div className="relative inline-block w-64">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <SlidersHorizontal className="h-4 w-4 text-gray-500" />
        </div>
        <select
          value={`${filters.sortBy}-${filters.order}`}
          onChange={(e) => {
            const [sortBy, order] = e.target.value.split('-');
            setFilters({
              sortBy: sortBy as 'price' | 'rating',
              order: order as 'asc' | 'desc',
            });
          }}
          className="appearance-none w-full pl-10 pr-8 py-2.5 bg-white text-gray-700 rounded-lg border border-gray-200 
                     hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     shadow-sm transition-all duration-200 cursor-pointer text-sm font-medium"
        >
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating-desc">Rating: High to Low</option>
          <option value="rating-asc">Rating: Low to High</option>
        </select>
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}