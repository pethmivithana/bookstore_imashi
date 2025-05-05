"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"

const CartIcon = () => {
  const { cart } = useCart()
  const [showPreview, setShowPreview] = useState(false)

  // Calculate total items in cart
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="relative">
      <Link
        to="/cart"
        className="flex items-center text-gray-700 hover:text-blue-600"
        onMouseEnter={() => setShowPreview(true)}
        onMouseLeave={() => setShowPreview(false)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </Link>

      {/* Cart Preview Dropdown */}
      {showPreview && cart.items.length > 0 && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-50">
          <div className="p-3 border-b">
            <h3 className="font-semibold">Your Cart ({totalItems} items)</h3>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {cart.items.slice(0, 3).map((item) => (
              <div key={item.id} className="p-3 border-b flex items-center">
                {item.imageUrl && (
                  <img
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={item.title}
                    className="w-10 h-14 object-cover mr-2"
                  />
                )}
                <div className="flex-1 text-sm">
                  <p className="font-medium truncate">{item.title}</p>
                  <p className="text-gray-500">
                    {item.quantity} × ${Number(item.price).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
            {cart.items.length > 3 && (
              <div className="p-2 text-center text-sm text-gray-500">and {cart.items.length - 3} more item(s)</div>
            )}
          </div>
          <div className="p-3 border-t">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Total:</span>
              <span className="font-bold">${Number(cart.total).toFixed(2)}</span>
            </div>
            <Link
              to="/cart"
              className="block w-full bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700 transition"
            >
              View Cart
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default CartIcon
