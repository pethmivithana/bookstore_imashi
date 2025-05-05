"use client"

// BookManagement/BookDetail.jsx
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"
import { FaArrowLeft, FaHeart, FaShare, FaStar } from "react-icons/fa"
import LoadingSpinner from "../components/Spinner"
import AddToCartButton from "../components/AddToCartButton"
import { toast } from "react-toastify"

const BookDetail = () => {
  const { bookId } = useParams()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true)

        // First, get the book data from Open Library
        const response = await axios.get(`https://openlibrary.org/works/${bookId}.json`)

        // Then get the book editions to find more details
        const editionsResponse = await axios.get(`https://openlibrary.org/works/${bookId}/editions.json?limit=1`)

        // Generate mock data for price and stock
        const mockPrice = (Math.random() * 50 + 5).toFixed(2)
        const mockStock = Math.floor(Math.random() * 20)

        // Construct book object with available data
        const bookData = {
          id: bookId,
          title: response.data.title,
          author: response.data.authors
            ? (
                await Promise.all(
                  response.data.authors.map(async (author) => {
                    if (author.author?.key) {
                      try {
                        const authorResponse = await axios.get(`https://openlibrary.org${author.author.key}.json`)
                        return authorResponse.data.name || "Unknown Author"
                      } catch (err) {
                        return "Unknown Author"
                      }
                    }
                    return "Unknown Author"
                  }),
                )
              ).join(", ")
            : "Unknown Author",
          coverUrl: response.data.covers?.[0]
            ? `https://covers.openlibrary.org/b/id/${response.data.covers[0]}-L.jpg`
            : "/placeholder-book.png",
          description: response.data.description?.value || response.data.description || "No description available.",
          publishYear: response.data.first_publish_date || "Unknown",
          publisher: editionsResponse.data.entries?.[0]?.publishers?.[0] || "Unknown Publisher",
          language: editionsResponse.data.entries?.[0]?.languages?.[0]?.key?.split("/")?.[2] || "English",
          pages: editionsResponse.data.entries?.[0]?.number_of_pages || "Unknown",
          isbn:
            editionsResponse.data.entries?.[0]?.isbn_13?.[0] ||
            editionsResponse.data.entries?.[0]?.isbn_10?.[0] ||
            "Unknown",
          price: mockPrice,
          inStock: mockStock > 0,
          stockCount: mockStock,
          rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3-5
          reviews: Math.floor(Math.random() * 500), // Random number of reviews
          categories: response.data.subjects?.slice(0, 5) || ["Fiction"],
        }

        setBook(bookData)
      } catch (err) {
        console.error("Error fetching book details:", err)
        setError("Failed to load book details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (bookId) {
      fetchBookDetails()
    }
  }, [bookId])

  useEffect(() => {
    if (book) {
      // Check if this book is in favorites
      const storedFavorites = localStorage.getItem("favorites")
      if (storedFavorites) {
        const favorites = JSON.parse(storedFavorites)
        const isBookFavorite = favorites.some((fav) => fav.id === book.id)
        setIsFavorite(isBookFavorite)
      }
    }
  }, [book])

  const handleIncrement = () => {
    if (book?.inStock && quantity < book.stockCount) {
      setQuantity(quantity + 1)
    }
  }

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const addToCart = () => {
    // This is now handled by the AddToCartButton component
  }

  const toggleFavorite = () => {
    // Get current favorites from localStorage
    const storedFavorites = localStorage.getItem("favorites")
    const favorites = storedFavorites ? JSON.parse(storedFavorites) : []

    // Check if this book is already in favorites
    const existingIndex = favorites.findIndex((fav) => fav.id === book.id)

    if (existingIndex >= 0) {
      // Remove from favorites
      favorites.splice(existingIndex, 1)
      toast.success(`Removed "${book.title}" from favorites!`)
    } else {
      // Add to favorites
      favorites.push({
        id: book.id,
        title: book.title,
        author: book.author,
        coverUrl: book.coverUrl,
        price: book.price,
        addedOn: new Date().toISOString(),
      })
      toast.success(`Added "${book.title}" to favorites!`)
    }

    // Save updated favorites to localStorage
    localStorage.setItem("favorites", JSON.stringify(favorites))

    // Update isFavorite state
    setIsFavorite(!isFavorite)
  }

  if (loading) return <LoadingSpinner />
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>
  if (!book) return <div className="text-center py-8">Book not found</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/books" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6">
        <FaArrowLeft /> Back to Books
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Book Cover */}
          <div className="md:w-1/3 bg-gray-100 flex justify-center p-8">
            <img
              src={book.coverUrl || "/placeholder.svg"}
              alt={book.title}
              className="object-contain max-h-96 rounded-lg shadow-md"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = "/placeholder-book.png"
              }}
            />
          </div>

          {/* Book Info */}
          <div className="md:w-2/3 p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{book.title}</h1>
                <p className="text-xl text-gray-600 mb-4">by {book.author}</p>

                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`${i < Math.floor(book.rating) ? "text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                  <span className="ml-2 text-gray-600">
                    {book.rating} ({book.reviews} reviews)
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={toggleFavorite}
                  className={`p-2 border rounded-full ${isFavorite ? "bg-red-50 text-red-500" : "hover:bg-gray-100 text-gray-400 hover:text-red-500"}`}
                  title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <FaHeart />
                </button>
                <button className="p-2 border rounded-full hover:bg-gray-100">
                  <FaShare className="text-gray-400 hover:text-blue-500" />
                </button>
              </div>
            </div>

            <div className="my-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex flex-wrap justify-between items-center">
                <div>
                  <span className="text-2xl font-bold text-blue-600">${book.price}</span>
                  <span className="text-gray-500 text-sm ml-2">USD</span>
                </div>

                <div
                  className={`text-sm px-3 py-1 rounded-full ${book.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {book.inStock ? `In Stock (${book.stockCount} available)` : "Out of Stock"}
                </div>
              </div>

              {book.inStock && (
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex items-center">
                    <button
                      onClick={handleDecrement}
                      className="px-3 py-1 bg-gray-200 rounded-l-lg hover:bg-gray-300"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      readOnly
                      className="w-12 text-center border-y bg-white py-1"
                    />
                    <button
                      onClick={handleIncrement}
                      className="px-3 py-1 bg-gray-200 rounded-r-lg hover:bg-gray-300"
                      disabled={quantity >= book.stockCount}
                    >
                      +
                    </button>
                  </div>

                  <AddToCartButton book={book} />

                  <button
                    onClick={toggleFavorite}
                    className={`p-2 border rounded-full ${isFavorite ? "bg-red-50 text-red-500" : "hover:bg-gray-100 text-gray-400 hover:text-red-500"}`}
                    title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    <FaHeart />
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Publisher</p>
                <p>{book.publisher}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Publication Date</p>
                <p>{book.publishYear}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Language</p>
                <p>{book.language}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Pages</p>
                <p>{book.pages}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">ISBN</p>
                <p>{book.isbn}</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-1">Categories</p>
              <div className="flex flex-wrap gap-2">
                {book.categories.map((category, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Book Description */}
        <div className="p-6 md:p-8 border-t">
          <h2 className="text-xl font-bold mb-4">Description</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">{book.description}</p>
          </div>
        </div>

        {/* Additional Sections (could be expanded) */}
        <div className="p-6 md:p-8 border-t">
          <h2 className="text-xl font-bold mb-4">Reviews</h2>
          <p className="text-gray-500">
            This book has {book.reviews} reviews with an average rating of {book.rating}/5.
          </p>
          {/* Review components would go here */}
        </div>
      </div>
    </div>
  )
}

export default BookDetail
