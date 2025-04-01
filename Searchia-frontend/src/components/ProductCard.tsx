import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { useStore } from '../store/useStore';
import { addToComparisonCart } from '../lib/api';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { addToComparisonCart: addToCart } = useStore();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await addToComparisonCart(product);
    addToCart(product);
  };

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`, { state: { product } })}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer overflow-hidden"
    >
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold line-clamp-2">{product.title}</h3>
        <div className="flex items-center mt-2">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="ml-1">{product.rating}</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xl font-bold">{product.price}</span>
          <button
            onClick={handleAddToCart}
            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
        <a
          href={product.productUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 text-sm text-blue-500 hover:underline block"
          onClick={(e) => e.stopPropagation()}
        >
          View on {product.source}
        </a>
      </div>
    </div>
  );
};