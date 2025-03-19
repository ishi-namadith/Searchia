import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';
import { useStore } from '../store/useStore';
import { compareProducts } from '../lib/api';

export const CartPage = () => {
  const navigate = useNavigate();
  const { comparisonCart, removeFromComparisonCart } = useStore();
  const [comparisonResults, setComparisonResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCompare = async () => {
    setLoading(true);
    const results = await compareProducts(comparisonCart);
    setComparisonResults(results);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Search
        </button>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold mb-8">Comparison Cart</h1>

          {comparisonCart.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Your comparison cart is empty
            </p>
          ) : (
            <>
              <div className="grid gap-6 mb-8">
                {comparisonCart.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{product.title}</h3>
                      <div className="flex items-center mt-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1">{product.rating}</span>
                      </div>
                      <p className="text-lg font-bold mt-2">${product.price}</p>
                    </div>
                    <button
                      onClick={() => removeFromComparisonCart(product.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={handleCompare}
                disabled={loading || comparisonCart.length < 2}
                className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300"
              >
                {loading ? 'Comparing...' : 'Compare Products'}
              </button>

              {comparisonResults && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">
                    Comparison Results
                  </h2>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(comparisonResults, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};