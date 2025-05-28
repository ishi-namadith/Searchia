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

// export const searchProducts = async (query: string): Promise<Product[]> => {
//   // if (!isProduction) {
//   //   // Return filtered mock data in development
//   //   const searchTerm = query.toLowerCase().trim();
//   //   return mockProducts.filter(product => 
//   //     product.title.toLowerCase().includes(searchTerm)
//   //   );
//   // }

//   try {
//     console.log(`Searching for: ${query}`);  // Debugging log

//     const [source1, source2] = await Promise.all([
//       axios.get(`${API_BASE_URL}/ebay?product=${query}`),
//       axios.get(`${API_BASE_URL}/amazon?product=${query}`),
//     ]);

//     const results = [...source1.data, ...source2.data, ];
//     console.log("Search results:", results); // Debugging log
//     return results;
//   } catch (error) {
//     console.error('Error searching products:', error);
//     return [];
//   }
// };
export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    console.log(`Searching for: ${query}`);  

    const source1 = await axios.get(`${API_BASE_URL}/search?product=${query}`)
    console.log("Source 1 data:", source1); 
    const results = source1.data;
    const mappedResults = results.map((item: any) => {

      const ratingMatch = item.rating ? item.rating.match(/(\d+(\.\d+)?)/) : null;
      const numericRating = ratingMatch ? parseFloat(ratingMatch[0]) : 0;
      
      let new_url = item.product_url;
      if (item.product_url && !item.product_url.startsWith('http')) {
        new_url = `https://www.amazon.com/${item.product_url}`;
      }
      
     
      let numericPrice = 0;
      if (item.price) {
       
        const priceString = item.price.trim();
        const matches = priceString.match(/\$(\d+(\.\d+)?)/);
        if (matches && matches[1]) {
          numericPrice = parseFloat(matches[1]);
        } else {
          
          const numMatches = priceString.match(/(\d+(\.\d+)?)/);
          if (numMatches && numMatches[0]) {
            numericPrice = parseFloat(numMatches[0]);
          }
        }
      }
      
      return {
        id: item.id,
        title: item.title,
        image: item.image,
        price: numericPrice,
        rating: numericRating,
        reviewsCount: item.reviews_count ? parseInt(item.reviews_count.replace(/,/g, '')) : 0,
        product_url: new_url,
      };
    });
    
   
    const filteredResults = mappedResults.filter((product: any) => product.price > 0);
    
    console.log("Search results:", filteredResults);
    return filteredResults;
  }
  catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
}

export const getProductDetails = async (product_url: string) => {
  console.log(`Fetching details for: ${product_url}`);

  if (product_url.startsWith("https://www.amazon.com/")) {
    try {
     
      const { data } = await axios.get(`${API_BASE_URL}/amazonreviews?url=${encodeURIComponent(product_url)}`);

      if (!data || data.error) {
        console.error("Error in amazonreviews response:", data?.error || "No data returned");
        return null;
      }

      const summaryResponse = await axios.get(
        `${API_BASE_URL}/review-summarize?reviews=${encodeURIComponent(JSON.stringify(data))}`
      );
      
      const extractedData = extractJsonFromResponse(summaryResponse.data);
      console.log("Amazon product details:", extractedData);
      return extractedData;
    } catch (error) {
      console.error("Error fetching Amazon product details:", error);
      return null;
    }
  } else {
    try {
     
      const { data } = await axios.get(`${API_BASE_URL}/ebayreviews?url=${encodeURIComponent(product_url)}`);
      console.log("eBay reviews data:", data);
      
      if (!data || data.error) {
        console.error("Error in ebayreviews response:", data?.error || "No data returned");
        return null;
      }


      const summaryResponse = await axios.get(
        `${API_BASE_URL}/review-summarize?reviews=${encodeURIComponent(JSON.stringify(data))}`
      );
      
      const extractedData = extractJsonFromResponse(summaryResponse.data);
      console.log("eBay product details:", extractedData);
      return extractedData;
    } catch (error) {
      console.error("Error fetching eBay product details:", error);
      return null;
    }
  }
};


const extractJsonFromResponse = (response: any): any => {

  if (typeof response === 'object' && response !== null && !response.error) {
    return response;
  }

 
  if (typeof response === 'object' && response.raw_response) {
    response = response.raw_response;
  }

  const responseStr = typeof response === 'string' ? response : JSON.stringify(response);

  try {
    
    try {
      const parsed = JSON.parse(responseStr);
      if (parsed.positive_reviews || parsed.negative_reviews) {
        return parsed;
      }
    } catch (e) {
 
    }

    let extractedJsonStr = responseStr;
    
    const jsonStartIndex = extractedJsonStr.indexOf('{');
    if (jsonStartIndex !== -1) {
      extractedJsonStr = extractedJsonStr.substring(jsonStartIndex);
      
      let braceCount = 0;
      let inQuotes = false;
      let escape = false;
      
      for (let i = 0; i < extractedJsonStr.length; i++) {
        const char = extractedJsonStr[i];
        
        if (escape) {
          escape = false;
          continue;
        }
        
        if (char === '\\') {
          escape = true;
          continue;
        }
        
        if (char === '"' && !escape) {
          inQuotes = !inQuotes;
          continue;
        }
        
        if (!inQuotes) {
          if (char === '{') braceCount++;
          if (char === '}') {
            braceCount--;
            
            if (braceCount === 0) {
              extractedJsonStr = extractedJsonStr.substring(0, i + 1);
              break;
            }
          }
        }
      }
      
      while (braceCount > 0) {
        extractedJsonStr += '}';
        braceCount--;
      }
      
      try {
        const parsed = JSON.parse(extractedJsonStr);
        if (parsed.positive_reviews || parsed.negative_reviews) {
          return parsed;
        }
      } catch (e) {

      }
    }

    const jsonRegex = /(\{[\s\S]*?\})/g;
    const jsonMatches = [...responseStr.matchAll(jsonRegex)];

    if (jsonMatches.length > 0) {

      for (const match of jsonMatches) {
        try {
          const possibleJson = match[1].trim();
          const parsed = JSON.parse(possibleJson);
  
          if (parsed.positive_reviews || parsed.negative_reviews) {
            return parsed;
          }
        } catch {
          continue; 
        }
      }
    }

    const positiveMatch = /\"positive_reviews\":\s*\"([^\"]+)\"/i.exec(responseStr);
    const negativeMatch = /\"negative_reviews\":\s*\"([^\"]+)\"/i.exec(responseStr);
    
    if (positiveMatch || negativeMatch) {
      return {
        positive_reviews: positiveMatch ? positiveMatch[1] : "",
        negative_reviews: negativeMatch ? negativeMatch[1] : ""
      };
    }

    return {
      error: "Failed to extract valid JSON",
      raw_response: responseStr
    };
  } catch (error) {
    console.error("Error extracting JSON from response:", error);
    return {
      error: "Failed to extract valid JSON",
      raw_response: responseStr
    };
  }
};

export const addToComparisonCart = async (product: Product) => {

  try {
    await axios.post(`${API_BASE_URL}/comparison-cart`, product);
  } catch (error) {
    console.error('Error adding to comparison cart:', error);
  }
};

export const getComparisonCart = async () => {

  try {
    const { data } = await axios.get(`${API_BASE_URL}/comparison-cart`);
    return data;
  } catch (error) {
    console.error('Error fetching comparison cart:', error);
    return [];
  }
};

export const compareProducts = async (products: Product[]) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/compare`, { products });


    const raw = data?.analysis?.raw || '';
    const cleanText = raw
      .replace(/\\n/g, ' ')      
      .replace(/\\"/g, '"')      
      .replace(/[\{\}\\]/g, '')   
      .trim();

    return cleanText;
  } catch (error) {
    console.error('Error comparing products:', error);
    return null;
  }
};