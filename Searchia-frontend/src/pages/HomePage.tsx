import SearchBar from "../components/SearchBar"
import ProductList from "../components/ProductList"

export default function HomePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-8">Find and Compare Products</h1>
      <SearchBar />
      <ProductList />
    </div>
  )
}

