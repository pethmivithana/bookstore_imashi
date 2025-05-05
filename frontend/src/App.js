import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import BookList from "./pages/BookList"
import BookDetail from "./pages/BookDetails"
import Cart from "./pages/Cart"
import Checkout from "./pages/Checkout"
import OrderConfirmation from "./pages/OrderConfirmation"
import Profile from "./pages/Profile"
import Favorites from "./pages/Favorites"
import PurchaseHistory from "./pages/PurchaseHistory"

// Layout Components
import Header from "./components/Header"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import PrivateRoute from "./components/PrivateRoute"

function App() {
  return (
    <>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Navbar />
          <Header />
          <main className="flex-grow container mx-auto px-4 py-6">
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Redirect root to login or books based on auth */}
              <Route path="/" element={<Navigate to="/books" />} />

              {/* Book Routes */}
              <Route
                path="/books"
                element={
                  <PrivateRoute>
                    <BookList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/books/:bookId"
                element={
                  <PrivateRoute>
                    <BookDetail />
                  </PrivateRoute>
                }
              />

              {/* Cart & Checkout Routes */}
              <Route
                path="/cart"
                element={
                  <PrivateRoute>
                    <Cart />
                  </PrivateRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <PrivateRoute>
                    <Checkout />
                  </PrivateRoute>
                }
              />
              <Route
                path="/order-confirmation"
                element={
                  <PrivateRoute>
                    <OrderConfirmation />
                  </PrivateRoute>
                }
              />

              {/* User Profile Routes */}
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/favorites"
                element={
                  <PrivateRoute>
                    <Favorites />
                  </PrivateRoute>
                }
              />
              <Route
                path="/purchase-history"
                element={
                  <PrivateRoute>
                    <PurchaseHistory />
                  </PrivateRoute>
                }
              />

              {/* Dashboard (if needed) */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
      <ToastContainer />
    </>
  )
}

export default App
