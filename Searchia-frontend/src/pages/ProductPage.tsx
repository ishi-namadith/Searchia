import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { getProductDetails, addToComparisonCart } from '../lib/api';
import { useStore } from '../store/useStore';

export const ProductPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { addToComparisonCart: addToCart } = useStore();
  const product = location.state?.product as Product;

  useEffect(() => {
    if (!product) {
      navigate('/');
      return;
    }

    const fetchDetails = async () => {
      const data = await getProductDetails(product.productUrl);
      setDetails(data);
      setLoading(false);
    };

    fetchDetails();
  }, [product, navigate]);

  if (!product) return null;

  const handleAddToCart = async () => {
    await addToComparisonCart(product);
    addToCart(product);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Search Results
        </button>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <img
              src={product.image}
              alt={product.title}
              className="w-full rounded-lg object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold mb-4">{product.title}</h1>
              <div className="flex items-center mb-4">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="ml-2 text-lg">{product.rating}</span>
              </div>
              <p className="text-3xl font-bold mb-6">${product.price}</p>
              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Comparison Cart
              </button>
            </div>
          </div>

          {loading ? (
            <div className="mt-8 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ) : (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Review Analysis</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-3">
                    Positive Reviews
                  </h3>
                  <p className="text-green-700">{details?.reviews?.positive}</p>
                </div>
                <div className="bg-red-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-red-800 mb-3">
                    Negative Reviews
                  </h3>
                  <p className="text-red-700">{details?.reviews?.negative}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};