import { Link } from "react-router-dom"
import { ShoppingCart } from "lucide-react"
import { useComparisonStore } from "@/store/comparisonStore"

export default function Header() {
  const { products } = useComparisonStore()

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-primary">
          ShopCompare
        </Link>
        <Link to="/comparison-cart" className="flex items-center gap-2 text-sm font-medium">
          <ShoppingCart className="h-5 w-5" />
          <span>Compare ({products.length})</span>
        </Link>
      </div>
    </header>
  )
}

