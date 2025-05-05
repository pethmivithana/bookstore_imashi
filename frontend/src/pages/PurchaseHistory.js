"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FaFileInvoice, FaSearch, FaEye } from "react-icons/fa"
import Spinner from "../components/Spinner"

const PurchaseHistory = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredOrders, setFilteredOrders] = useState([])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)

        // In a real app, you would fetch from your API
        // const response = await axios.get('/api/orders', {
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem('token')}`
        //   }
        // })

        // For demo purposes, we'll use mock data
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Check if we have orders in localStorage
        const storedOrders = localStorage.getItem("orders")
        let ordersData = []

        if (storedOrders) {
          ordersData = JSON.parse(storedOrders)
        } else {
          // Mock data if no orders exist
          ordersData = [
            {
              id: "ORD-ABCD1234",
              date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              total: 45.97,
              status: "Delivered",
              items: [
                {
                  id: "OL7353617W",
                  title: "The Great Gatsby",
                  author: "F. Scott Fitzgerald",
                  price: 12.99,
                  quantity: 1,
                },
                {
                  id: "OL24347578W",
                  title: "To Kill a Mockingbird",
                  author: "Harper Lee",
                  price: 10.99,
                  quantity: 3,
                },
              ],
              shippingAddress: {
                name: "John Doe",
                address: "123 Main St",
                city: "Anytown",
                state: "CA",
                zipCode: "12345",
                country: "United States",
              },
            },
            {
              id: "ORD-EFGH5678",
              date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
              total: 29.98,
              status: "Delivered",
              items: [
                {
                  id: "OL24347578W",
                  title: "To Kill a Mockingbird",
                  author: "Harper Lee",
                  price: 10.99,
                  quantity: 2,
                },
                {
                  id: "OL7353617W",
                  title: "The Great Gatsby",
                  author: "F. Scott Fitzgerald",
                  price: 8.0,
                  quantity: 1,
                },
              ],
              shippingAddress: {
                name: "John Doe",
                address: "123 Main St",
                city: "Anytown",
                state: "CA",
                zipCode: "12345",
                country: "United States",
              },
            },
          ]

          // Save mock data to localStorage
          localStorage.setItem("orders", JSON.stringify(ordersData))
        }

        setOrders(ordersData)
        setFilteredOrders(ordersData)
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // Filter orders based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredOrders(orders)
    } else {
      const filtered = orders.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.items.some(
            (item) =>
              item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.author.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      )
      setFilteredOrders(filtered)
    }
  }, [searchTerm, orders])

  if (loading) {
    return <Spinner />
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Purchase History</h1>

        <div className="relative">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <FaFileInvoice className="text-gray-300 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No orders yet</h2>
          <p className="text-gray-600 mb-6">Browse our collection and make your first purchase</p>
          <Link
            to="/books"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Shipped"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "Processing"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.items.length} {order.items.length === 1 ? "item" : "items"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/order-details/${order.id}`}
                        state={{ order }}
                        className="text-blue-600 hover:text-blue-900 flex items-center justify-end"
                      >
                        <FaEye className="mr-1" /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default PurchaseHistory
