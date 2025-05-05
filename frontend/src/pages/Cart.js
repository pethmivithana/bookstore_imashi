import React from 'react';
import { Link } from 'react-router-dom';
import Cart from '../components/Cart';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cart } = useCart();

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Cart />
        </div>
        
        {cart.items.length > 0 && (
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal ({cart.items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>${cart.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span>$5.99</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span>${(cart.total * 0.05).toFixed(2)}</span>
                </div>
              </div>
              
              <div className="border-t pt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${(cart.total + 5.99 + (cart.total * 0.05)).toFixed(2)}</span>
                </div>
              </div>
              
              <Link
                to="/checkout"
                className="block w-full bg-green-600 text-white text-center py-3 rounded mt-6 hover:bg-green-700 transition"
              >
                Proceed to Checkout
              </Link>
              
              <Link
                to="/books"
                className="block w-full bg-blue-600 text-white text-center py-3 rounded mt-3 hover:bg-blue-700 transition"
              >
                Continue Shopping
              </Link>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
              <h3 className="font-medium mb-2">Have a promo code?</h3>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Enter code"
                  className="flex-1 p-2 border rounded-l"
                />
                <button className="bg-gray-200 px-4 py-2 rounded-r hover:bg-gray-300">
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;