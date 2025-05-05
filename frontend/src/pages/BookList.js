// BookManagement/BookList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaSortAmountDown } from 'react-icons/fa';
import LoadingSpinner from '../components/Spinner';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('title-asc');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    inStock: false,
    priceRange: [0, 100],
  });

  // Fetch books from API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        // Fetch from Open Library API
        const response = await axios.get('https://openlibrary.org/people/mekBot/books/want-to-read.json');
        
        // Process the data - adding mock price and stock information since OpenLibrary doesn't have these
        const processedBooks = response.data.reading_log_entries.map(entry => {
          const work = entry.work;
          // Generate mock data for demonstration
          const mockPrice = (Math.random() * 50 + 5).toFixed(2);
          const mockStock = Math.floor(Math.random() * 20);
          
          return {
            id: work.key.split('/').pop(),
            title: work.title,
            author: work.author_names?.[0] || 'Unknown Author',
            coverUrl: work.cover_id ? 
              `https://covers.openlibrary.org/b/id/${work.cover_id}-M.jpg` : 
              '/placeholder-book.png',
            price: mockPrice,
            inStock: mockStock > 0,
            stockCount: mockStock,
            publishYear: work.first_publish_year || 'Unknown',
            description: work.description?.value || 'No description available.'
          };
        });
        
        setBooks(processedBooks);
        setFilteredBooks(processedBooks);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError('Failed to load books. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Handle search and filtering
  useEffect(() => {
    let result = [...books];
    
    // Apply search
    if (searchTerm) {
      result = result.filter(
        book => 
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply filters
    if (filters.inStock) {
      result = result.filter(book => book.inStock);
    }
    
    // Apply price filter
    result = result.filter(
      book => 
        parseFloat(book.price) >= filters.priceRange[0] && 
        parseFloat(book.price) <= filters.priceRange[1]
    );
    
    // Apply sorting
    switch (sortOption) {
      case 'title-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'price-asc':
        result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'price-desc':
        result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      default:
        break;
    }
    
    setFilteredBooks(result);
  }, [books, searchTerm, filters, sortOption]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleFilterToggle = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterChange = (field, value) => {
    setFilters({
      ...filters,
      [field]: value,
    });
  };

  const handlePriceRangeChange = (index, value) => {
    const newRange = [...filters.priceRange];
    newRange[index] = parseInt(value);
    handleFilterChange('priceRange', newRange);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Book Collection</h1>
        
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search books or authors..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="pl-4 pr-8 py-2 border rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
            >
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
              <option value="price-asc">Price (Low-High)</option>
              <option value="price-desc">Price (High-Low)</option>
            </select>
            <FaSortAmountDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
          </div>
          
          {/* Filter Button */}
          <button
            onClick={handleFilterToggle}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <FaFilter />
            <span>Filters</span>
          </button>
        </div>
      </div>
      
      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-3">Filters</h2>
          <div className="flex flex-wrap gap-6">
            {/* In Stock Filter */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="inStock"
                checked={filters.inStock}
                onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                className="mr-2 h-5 w-5 text-blue-600"
              />
              <label htmlFor="inStock" className="text-gray-700">In Stock Only</label>
            </div>
            
            {/* Price Range Filter */}
            <div className="w-full md:w-auto">
              <label className="block text-gray-700 mb-1">Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.priceRange[0]}
                  onChange={(e) => handlePriceRangeChange(0, e.target.value)}
                  className="w-24 md:w-32"
                />
                <span>to</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceRangeChange(1, e.target.value)}
                  className="w-24 md:w-32"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Book Grid */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No books found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <Link to={`/books/${book.id}`} key={book.id} className="group">
              <div className="bg-white border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
                <div className="relative pt-[56.25%] bg-gray-200">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-book.png';
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-1">{book.title}</h3>
                  <p className="text-gray-600 mb-2">{book.author}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-blue-600">${book.price}</span>
                    <span className={`text-sm px-2 py-1 rounded ${book.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {book.inStock ? `In Stock (${book.stockCount})` : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      
      {/* Pagination placeholder - could be implemented for large collections */}
      <div className="mt-8 flex justify-center">
        <nav className="flex items-center gap-1">
          <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-100">&laquo;</button>
          <button className="px-3 py-1 border rounded bg-blue-600 text-white">1</button>
          <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-100">2</button>
          <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-100">3</button>
          <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-100">&raquo;</button>
        </nav>
      </div>
    </div>
  );
};

export default BookList;
