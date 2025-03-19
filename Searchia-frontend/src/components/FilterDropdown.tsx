import React from 'react';
import { useStore } from '../store/useStore';

export const FilterDropdown = () => {
  const { filters, setFilters } = useStore();

  return (
    <div className="flex gap-4 items-center">
      <select
        value={`${filters.sortBy}-${filters.order}`}
        onChange={(e) => {
          const [sortBy, order] = e.target.value.split('-');
          setFilters({
            sortBy: sortBy as 'price' | 'rating',
            order: order as 'asc' | 'desc',
          });
        }}
        className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="rating-desc">Rating: High to Low</option>
        <option value="rating-asc">Rating: Low to High</option>
      </select>
    </div>
  );
};