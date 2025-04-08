import axios from 'axios';
import { Product } from '../types';

// Mock data for development
// const mockProducts: Product[] = [
//   {
//     id: '1',
//     title: 'Smartphone X Pro',
//     price: 999.99,
//     rating: 4.5,
//     image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
//     productUrl: 'https://example.com/product-1',
//     source: 'Store A'
//   },
//   {
//     id: '2',
//     title: 'Smartphone X',
//     price: 970.99,
//     rating: 4.5,
//     image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
//     productUrl: 'https://example.com/product-2',
//     source: 'Store A'
//   },
//   {
//     id: '3',
//     title: 'Wireless Headphones Pro',
//     price: 299.99,
//     rating: 4.7,
//     image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
//     productUrl: 'https://example.com/product-3',
//     source: 'Store B'
//   },
//   {
//     id: '4',
//     title: 'Gaming Headphones X',
//     price: 199.99,
//     rating: 4.3,
//     image: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
//     productUrl: 'https://example.com/product-4',
//     source: 'Store C'
//   },
//   {
//     id: '5',
//     title: 'Premium Headphones Elite',
//     price: 249.99,
//     rating: 4.6,
//     image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
//     productUrl: 'https://example.com/product-5',
//     source: 'Store A'
//   }
// ];

const API_BASE_URL = 'http://127.0.0.1:5000/';

// const isProduction = process.env.NODE_ENV === 'production';

export const searchProducts = async (query: string): Promise<Product[]> => {
  // if (!isProduction) {
  //   // Return filtered mock data in development
  //   const searchTerm = query.toLowerCase().trim();
  //   return mockProducts.filter(product => 
  //     product.title.toLowerCase().includes(searchTerm)
  //   );
  // }

  try {
    console.log(`Searching for: ${query}`);  // Debugging log

    const [source1, source2] = await Promise.all([
      axios.get(`${API_BASE_URL}/ebay?product=${query}`),
      axios.get(`${API_BASE_URL}/amazon?product=${query}`),
    ]);

    const results = [...source1.data, ...source2.data, ];
    console.log("Search results:", results); // Debugging log
    return results;
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
};

export const getProductDetails = async (productUrl: string) => {
  // if (!isProduction) {
  //   return {
  //     reviews: {
  //       positive: 'Great build quality and performance. Battery life is excellent.',
  //       negative: 'Price is a bit high. Could have more color options.'
  //     }
  //   };
  // }

  try {
    const { data } = await axios.get(`${API_BASE_URL}/product-details?url=${productUrl}`);
    return data;
  } catch (error) {
    console.error('Error fetching product details:', error);
    return null;
  }
};

export const addToComparisonCart = async (product: Product) => {
  // if (!isProduction) {
  //   return true;
  // }

  try {
    await axios.post(`${API_BASE_URL}/comparison-cart`, product);
  } catch (error) {
    console.error('Error adding to comparison cart:', error);
  }
};

export const getComparisonCart = async () => {
  // if (!isProduction) {
  //   return [];
  // }

  try {
    const { data } = await axios.get(`${API_BASE_URL}/comparison-cart`);
    return data;
  } catch (error) {
    console.error('Error fetching comparison cart:', error);
    return [];
  }
};

export const compareProducts = async (products: Product[]) => {
  // if (!isProduction) {
  //   return {
  //     ranking: products.sort((a, b) => b.rating - a.rating),
  //     analysis: 'Products ranked based on customer ratings and price-performance ratio.'
  //   };
  // }

  try {
    const { data } = await axios.post(`${API_BASE_URL}/compare`, { products });
    return data;
  } catch (error) {
    console.error('Error comparing products:', error);
    return null;
  }
};