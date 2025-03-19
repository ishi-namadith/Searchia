export interface Product {
  id: string;
  title: string;
  price: number;
  rating: number;
  image: string;
  productUrl: string;
  source: string;
  description?: string;
  reviews?: {
    positive: string[];
    negative: string[];
  };
}

export interface SearchFilters {
  sortBy: 'price' | 'rating';
  order: 'asc' | 'desc';
}

export interface ComparisonProduct extends Product {
  positiveReviewSummary: string;
  negativeReviewSummary: string;
}