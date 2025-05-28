import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, BarChart2, ExternalLink, Trash2, ShoppingBag } from 'lucide-react';
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

  // Function to format JSON keys for better display
  const formatKey = (key: string) => {
    return key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Function to render JSON values with appropriate styling
  const renderValue = (value: any) => {
    if (value === null || value === undefined) return <span className="text-gray-400">null</span>;
    if (typeof value === 'boolean') 
      return <span className="text-purple-600 font-semibold">{value.toString()}</span>;
    if (typeof value === 'number') 
      return <span className="text-blue-600 font-semibold">{value}</span>;
    if (typeof value === 'string') 
      return <span className="text-green-600">"{value}"</span>;
    return value;
  };

  // Recursive function to render JSON data in a more attractive way
  const renderJson = (data: any, level = 0) => {
    if (typeof data !== 'object' || data === null) {
      return renderValue(data);
    }

    const isArray = Array.isArray(data);
    const indent = level * 20; // Indentation based on nesting level

    return (
      <div style={{ marginLeft: indent }} className="my-1">
        {isArray ? '[' : '{'}
        <div className="ml-5">
          {Object.entries(data).map(([key, value], index) => (
            <div key={key} className="my-1 font-mono">
              {!isArray && (
                <span className="text-pink-600 font-medium">"{key}"</span>
              )}
              {!isArray && <span className="text-gray-500">: </span>}
              {typeof value === 'object' && value !== null ? (
                renderJson(value, level + 1)
              ) : (
                renderValue(value)
              )}
              {index < Object.entries(data).length - 1 && (
                <span className="text-gray-500">,</span>
              )}
            </div>
          ))}
        </div>
        <div>{isArray ? ']' : '}'}</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
          <span>Back to Search</span>
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <h1 className="text-3xl font-bold mb-8 text-gray-800 flex items-center">
            <ShoppingBag className="w-7 h-7 mr-3 text-purple-500" />
            Comparison Cart
          </h1>

          {comparisonCart.length === 0 ? (
            <div className="text-gray-500 text-center py-12 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex justify-center mb-4">
                <ShoppingBag className="w-16 h-16 text-gray-300" />
              </div>
              <p className="text-lg font-medium">Your comparison cart is empty</p>
              <button 
                onClick={() => navigate('/')}
                className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="grid gap-6 mb-8">
                {comparisonCart.map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-col md:flex-row items-center gap-6 p-6 border border-gray-100 rounded-xl hover:shadow-md transition-shadow duration-200 bg-white"
                  >
                    <div className="relative group w-full md:w-auto">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.title}
                        className="w-full md:w-32 md:h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg"></div>
                    </div>
                    
                    <div className="flex-1 w-full">
                      <h3 className="font-semibold text-lg text-gray-800">{product.title}</h3>
                      <div className="flex items-center mt-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-gray-700">{product.rating}</span>
                        </div>
                        <span className="mx-2 text-gray-300">|</span>
                        {/* <span className="text-gray-500 text-sm">{product.category || 'General'}</span> */}
                      </div>
                      <p className="text-xl font-bold mt-2 text-purple-600">${product.price}</p>
                      
                      <div className="flex flex-wrap gap-3 mt-4">
                        <a
                          href={product.product_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 text-sm font-medium"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View Product
                        </a>
                        
                        <button
                          onClick={() => removeFromComparisonCart(product.id)}
                          className="inline-flex items-center gap-1 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors duration-200 text-sm font-medium"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleCompare}
                disabled={loading || comparisonCart.length < 2}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-6 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed font-medium text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Comparing...
                  </>
                ) : (
                  'Compare Products'
                )}
              </button>

              {comparisonResults && (
                <div className="mt-12 animate-fadeIn">
                  <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800 border-b pb-4">
                    <BarChart2 className="w-6 h-6 mr-3 text-purple-500" />
                    AI Comparison Results
                  </h2>
                  <div className="bg-gradient-to-r from-gray-50 to-indigo-50 p-6 rounded-xl border border-indigo-100 shadow-sm overflow-auto max-h-[600px]">
                    <div className="font-sans text-base leading-relaxed text-gray-800">
                      {renderJson(comparisonResults)}
                    </div>
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