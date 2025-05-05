"use client"

import { createContext, useContext, useReducer, useEffect } from "react"

// Create the cart context
const CartContext = createContext()

// Initial state
const initialState = {
  items: [],
  total: 0,
}

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex((item) => item.id === action.payload.id)

      let updatedItems
      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        updatedItems = [...state.items]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        }
      } else {
        // Add new item with quantity 1
        updatedItems = [
          ...state.items,
          {
            ...action.payload,
            price: Number(action.payload.price),
            quantity: 1,
          },
        ]
      }

      const total = calculateTotal(updatedItems)

      // Save to localStorage
      localStorage.setItem(
        "cart",
        JSON.stringify({
          items: updatedItems,
          total,
        }),
      )

      return {
        items: updatedItems,
        total,
      }
    }

    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter((item) => item.id !== action.payload)
      const total = calculateTotal(updatedItems)

      // Save to localStorage
      localStorage.setItem(
        "cart",
        JSON.stringify({
          items: updatedItems,
          total,
        }),
      )

      return {
        items: updatedItems,
        total,
      }
    }

    case "UPDATE_QUANTITY": {
      const updatedItems = state.items.map((item) =>
        item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item,
      )
      const total = calculateTotal(updatedItems)

      // Save to localStorage
      localStorage.setItem(
        "cart",
        JSON.stringify({
          items: updatedItems,
          total,
        }),
      )

      return {
        items: updatedItems,
        total,
      }
    }

    case "CLEAR_CART": {
      // Clear localStorage
      localStorage.removeItem("cart")

      return {
        items: [],
        total: 0,
      }
    }

    case "LOAD_CART": {
      return {
        ...action.payload,
      }
    }

    default:
      return state
  }
}

// Helper function to calculate total price
const calculateTotal = (items) => {
  return items.reduce((total, item) => total + Number(item.price) * item.quantity, 0)
}

// Provider component
export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      dispatch({ type: "LOAD_CART", payload: JSON.parse(savedCart) })
    }
  }, [])

  // Cart actions
  const addToCart = (book) => {
    dispatch({ type: "ADD_ITEM", payload: book })
  }

  const removeFromCart = (bookId) => {
    dispatch({ type: "REMOVE_ITEM", payload: bookId })
  }

  const updateQuantity = (bookId, quantity) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id: bookId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// Custom hook for using the cart context
export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
