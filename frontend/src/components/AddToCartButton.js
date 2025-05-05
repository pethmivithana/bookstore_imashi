"use client"

import { useState } from "react"
import { toast } from "react-toastify"
import { useCart } from "../context/CartContext"

const AddToCartButton = ({ book }) => {
  const { addToCart } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = () => {
    // Prevent multiple rapid clicks
    if (isAdding) return

    setIsAdding(true)

    // Create cart item from book data
    const cartItem = {
      id: book.id,
      title: book.title,
      author: book.authors ? book.authors.join(", ") : book.author || "Unknown",
      price: Number(book.price) || 9.99, // Default price if not available
      imageUrl: book.coverUrl || book.imageLinks?.thumbnail || null,
      quantity: 1,
    }

    addToCart(cartItem)

    // Show success message
    toast.success(`Added "${book.title}" to cart!`, {
      position: "bottom-right",
      autoClose: 2000,
    })

    // Reset button state after a short delay
    setTimeout(() => setIsAdding(false), 500)
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding}
      className={`px-6 py-2 rounded font-medium ${
        isAdding ? "bg-green-500 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
      } transition-colors duration-200`}
    >
      {isAdding ? "Added!" : "Add to Cart"}
    </button>
  )
}

export default AddToCartButton
