import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import ProductDetailsPage from "./pages/ProductDetailsPage"
import ComparisonCartPage from "./pages/ComparisonCartPage"
import Header from "./components/Header"

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />
            <Route path="/comparison-cart" element={<ComparisonCartPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App

