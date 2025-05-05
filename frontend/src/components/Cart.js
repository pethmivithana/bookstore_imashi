"use client"
import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useCart()

  const handleQuantityChange = (bookId, newQuantity) => {
    // Ensure quantity is at least 1
    const quantity = Math.max(1, Number.parseInt(newQuantity, 10))
    updateQuantity(bookId, quantity)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>

      {cart.items.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Link
            to="/books"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Browse Books
          </Link>
        </div>
      ) : (
        <>
          <div className="border-b pb-4 mb-4">
            <div className="grid grid-cols-6 font-semibold text-gray-600">
              <div className="col-span-3">Book</div>
              <div className="text-center">Price</div>
              <div className="text-center">Quantity</div>
              <div className="text-right">Total</div>
            </div>
          </div>

          {cart.items.map((item) => (
            <div key={item.id} className="grid grid-cols-6 items-center py-4 border-b">
              <div className="col-span-3 flex items-center">
                {item.imageUrl && (
                  <img
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={item.title}
                    className="w-16 h-20 object-cover mr-4"
                  />
                )}
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  {item.author && <p className="text-sm text-gray-500">{item.author}</p>}
                </div>
              </div>

              <div className="text-center">${Number(item.price).toFixed(2)}</div>

              <div className="text-center">
                <div className="flex items-center justify-center">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="bg-gray-200 px-2 py-1 rounded-l"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                    className="w-12 text-center border-t border-b"
                  />
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="bg-gray-200 px-2 py-1 rounded-r"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-right flex items-center justify-end">
                <span className="mr-4">${(Number(item.price) * item.quantity).toFixed(2)}</span>
                <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          <div className="mt-6 flex justify-between items-center">
            <div className="text-xl font-bold">Total: ${Number(cart.total).toFixed(2)}</div>
            <Link to="/checkout" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

export default Cart
