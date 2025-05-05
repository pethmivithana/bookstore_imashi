"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import CartIcon from "./CartIcon"
import { FaUser, FaHeart, FaHistory } from "react-icons/fa"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  // Check if user is logged in (using localStorage in this example)
  const isLoggedIn = localStorage.getItem("user") !== null

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <Link to={isLoggedIn ? "/books" : "/login"} className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <span className="ml-2 text-xl font-bold">BookStore</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {isLoggedIn ? (
              <>
                <Link to="/books" className="text-gray-700 hover:text-blue-600">
                  Books
                </Link>
                <Link to="/favorites" className="text-gray-700 hover:text-blue-600 flex items-center">
                  <FaHeart className="mr-1" /> Favorites
                </Link>
                <Link to="/purchase-history" className="text-gray-700 hover:text-blue-600 flex items-center">
                  <FaHistory className="mr-1" /> Orders
                </Link>
                <Link to="/profile" className="text-gray-700 hover:text-blue-600 flex items-center">
                  <FaUser className="mr-1" /> Profile
                </Link>
                <button onClick={handleLogout} className="text-gray-700 hover:text-blue-600">
                  Logout
                </button>
                <CartIcon />
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600">
                  Login
                </Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-4 md:hidden">
            {isLoggedIn && <CartIcon />}
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-500 hover:text-gray-800">
              {isOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-3 border-t">
            {isLoggedIn ? (
              <>
                <Link
                  to="/books"
                  className="block py-2 text-gray-700 hover:text-blue-600"
                  onClick={() => setIsOpen(false)}
                >
                  Books
                </Link>
                <Link
                  to="/favorites"
                  className="block py-2 text-gray-700 hover:text-blue-600 flex items-center"
                  onClick={() => setIsOpen(false)}
                >
                  <FaHeart className="mr-1" /> Favorites
                </Link>
                <Link
                  to="/purchase-history"
                  className="block py-2 text-gray-700 hover:text-blue-600 flex items-center"
                  onClick={() => setIsOpen(false)}
                >
                  <FaHistory className="mr-1" /> Orders
                </Link>
                <Link
                  to="/profile"
                  className="block py-2 text-gray-700 hover:text-blue-600 flex items-center"
                  onClick={() => setIsOpen(false)}
                >
                  <FaUser className="mr-1" /> Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setIsOpen(false)
                  }}
                  className="block w-full text-left py-2 text-gray-700 hover:text-blue-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-2 text-gray-700 hover:text-blue-600"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
