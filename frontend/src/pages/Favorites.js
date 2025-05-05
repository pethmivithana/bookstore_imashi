"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FaHeart, FaSearch } from "react-icons/fa"
import Spinner from "../components/Spinner"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const Favorites = () => {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredFavorites, setFilteredFavorites] = useState([])

  // Fetch favorites from API or localStorage
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true)

        // In a real app, you would fetch from your API
        // const response = await axios.get('/api/favorites', {
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem('token')}`
        //   }
        // })

        // For demo purposes, we'll use mock data
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Check if we have favorites in localStorage
        const storedFavorites = localStorage.getItem("favorites")
        let favoritesData = []

        if (storedFavorites) {
          favoritesData = JSON.parse(storedFavorites)
        } else {
          // Mock data if no favorites exist
          favoritesData = [
            {
              id: "OL7353617W",
              title: "The Great Gatsby",
              author: "F. Scott Fitzgerald",
              coverUrl: "https://covers.openlibrary.org/b/id/8432047-M.jpg",
              price: "12.99",
              addedOn: new Date().toISOString(),
            },
            {
              id: "OL24347578W",
              title: "To Kill a Mockingbird",
              author: "Harper Lee",
              coverUrl: "https://covers.openlibrary.org/b/id/8529716-M.jpg",
              price: "10.99",
              addedOn: new Date().toISOString(),
            },
          ]

          // Save mock data to localStorage
          localStorage.setItem("favorites", JSON.stringify(favoritesData))
        }

        setFavorites(favoritesData)
        setFilteredFavorites(favoritesData)
      } catch (error) {
        console.error("Error fetching favorites:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [])

  // Filter favorites based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredFavorites(favorites)
    } else {
      const filtered = favorites.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredFavorites(filtered)
    }
  }, [searchTerm, favorites])

  const handleRemoveFavorite = (bookId) => {
    // Remove from state
    const updatedFavorites = favorites.filter((book) => book.id !== bookId)
    setFavorites(updatedFavorites)

    // Update localStorage
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites))

    // In a real app, you would also call your API
    // axios.delete(`/api/favorites/${bookId}`, {
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem('token')}`
    //   }
    // })

    toast.success("Removed from favorites")
  }

  if (loading) {
    return <Spinner />
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">My Favorites</h1>

        <div className="relative">
          <input
            type="text"
            placeholder="Search favorites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {filteredFavorites.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <FaHeart className="text-gray-300 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No favorites yet</h2>
          <p className="text-gray-600 mb-6">Browse our collection and add books to your favorites</p>
          <Link
            to="/books"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredFavorites.map((book) => (
            <div
              key={book.id}
              className="bg-white border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300"
            >
              <div className="relative">
                <Link to={`/books/${book.id}`}>
                  <img
                    src={book.coverUrl || "/placeholder.svg"}
                    alt={book.title}
                    className="w-full h-56 object-cover"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = "/placeholder-book.png"
                    }}
                  />
                </Link>
                <button
                  onClick={() => handleRemoveFavorite(book.id)}
                  className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-red-50"
                >
                  <FaHeart className="text-red-500" />
                </button>
              </div>
              <div className="p-4">
                <Link to={`/books/${book.id}`}>
                  <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition line-clamp-2 mb-1">
                    {book.title}
                  </h3>
                </Link>
                <p className="text-gray-600 mb-2">{book.author}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-blue-600">${book.price}</span>
                  <span className="text-xs text-gray-500">Added {new Date(book.addedOn).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Favorites
