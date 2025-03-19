import React from 'react';
import { ProductCard } from './ProductCard';
import { useStore } from '../store/useStore';
import { Product, SearchFilters } from '../types';

export const ProductGrid = () => {
  const { searchResults, filters } = useStore();

  const sortProducts = (products: Product[], filters: SearchFilters) => {
    return [...products].sort((a, b) => {
      const value = filters.sortBy === 'price' ? 'price' : 'rating';
      return filters.order === 'asc'
        ? a[value] - b[value]
        : b[value] - a[value];
    });
  };

  const sortedProducts = sortProducts(searchResults, filters);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {sortedProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};