"use client"

import { useEffect, useRef } from "react"
import { useLocation, useNavigate, Link } from "react-router-dom"
import { FaArrowLeft, FaPrint, FaDownload } from "react-icons/fa"
import { toast } from "react-toastify"

const OrderDetails = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const invoiceRef = useRef()

  // Get order data from location state
  const { order } = location.state || {}

  useEffect(() => {
    // If no order data (e.g., direct URL access), redirect to purchase history
    if (!order) {
      toast.error("Order information not found")
      navigate("/purchase-history")
    }
  }, [order, navigate])

  // If no order data, show loading until redirect
  if (!order) {
    return <div className="text-center py-12">Loading...</div>
  }

  // Calculate order totals
  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 5.99
  const tax = subtotal * 0.05

  // Print invoice handler
  const handlePrintInvoice = () => {
    const printContents = invoiceRef.current.innerHTML
    const originalContents = document.body.innerHTML

    document.body.innerHTML = `
      <html>
        <head>
          <title>Order Invoice - ${order.id}</title>
          <style>
            body { font-family: Arial, sans-serif; }
            .invoice-header { text-align: center; margin-bottom: 20px; }
            .invoice-section { margin-bottom: 15px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f2f2f2; }
            .totals { margin-top: 20px; text-align: right; }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `

    window.print()
    document.body.innerHTML = originalContents
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/purchase-history" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6">
        <FaArrowLeft /> Back to Purchase History
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Order Details</h1>
          <div className="flex gap-2">
            <button
              onClick={handlePrintInvoice}
              className="bg-white text-blue-600 px-3 py-1 rounded flex items-center text-sm"
            >
              <FaPrint className="mr-1" /> Print
            </button>
            <button
              onClick={handlePrintInvoice} // In a real app, this would be a different function to download PDF
              className="bg-white text-blue-600 px-3 py-1 rounded flex items-center text-sm"
            >
              <FaDownload className="mr-1" /> Download
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Order Information</h3>
              <p>
                <span className="font-medium">Order ID:</span> {order.id}
              </p>
              <p>
                <span className="font-medium">Date:</span> {new Date(order.date).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">Status:</span>
                <span
                  className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
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
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Shipping Address</h3>
              <p>{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          <div ref={invoiceRef}>
            <div className="invoice-header">
              <h2 className="text-xl font-bold">INVOICE</h2>
              <p>Order #{order.id}</p>
              <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            </div>

            <div className="invoice-section">
              <h3 className="font-semibold mb-2">Items</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left">Item</th>
                      <th className="px-4 py-2 text-center">Quantity</th>
                      <th className="px-4 py-2 text-right">Price</th>
                      <th className="px-4 py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-4 py-3">
                          <div className="font-medium">{item.title}</div>
                          <div className="text-sm text-gray-500">{item.author}</div>
                        </td>
                        <td className="px-4 py-3 text-center">{item.quantity}</td>
                        <td className="px-4 py-3 text-right">${item.price.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right font-medium">${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="invoice-section mt-6">
              <div className="flex justify-end">
                <div className="w-64">
                  <div className="flex justify-between py-2 border-b">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Shipping:</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Tax (5%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 font-bold">
                    <span>Total:</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="invoice-section mt-8 text-center text-gray-600">
              <p>Thank you for your purchase!</p>
              <p className="text-sm">For any questions or issues, please contact support@bookstore.com</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Timeline</h2>
        <div className="space-y-6">
          <div className="flex">
            <div className="flex flex-col items-center mr-4">
              <div className="bg-green-500 rounded-full h-4 w-4"></div>
              <div className="h-full w-0.5 bg-gray-200"></div>
            </div>
            <div>
              <p className="font-medium">Order Placed</p>
              <p className="text-sm text-gray-500">{new Date(order.date).toLocaleString()}</p>
            </div>
          </div>

          <div className="flex">
            <div className="flex flex-col items-center mr-4">
              <div className="bg-green-500 rounded-full h-4 w-4"></div>
              <div className="h-full w-0.5 bg-gray-200"></div>
            </div>
            <div>
              <p className="font-medium">Payment Confirmed</p>
              <p className="text-sm text-gray-500">
                {new Date(new Date(order.date).getTime() + 1000 * 60 * 5).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex">
            <div className="flex flex-col items-center mr-4">
              <div
                className={`${order.status === "Processing" || order.status === "Shipped" || order.status === "Delivered" ? "bg-green-500" : "bg-gray-300"} rounded-full h-4 w-4`}
              ></div>
              <div className="h-full w-0.5 bg-gray-200"></div>
            </div>
            <div>
              <p className="font-medium">Processing</p>
              <p className="text-sm text-gray-500">
                {order.status === "Processing" || order.status === "Shipped" || order.status === "Delivered"
                  ? new Date(new Date(order.date).getTime() + 1000 * 60 * 60 * 2).toLocaleString()
                  : "Pending"}
              </p>
            </div>
          </div>

          <div className="flex">
            <div className="flex flex-col items-center mr-4">
              <div
                className={`${order.status === "Shipped" || order.status === "Delivered" ? "bg-green-500" : "bg-gray-300"} rounded-full h-4 w-4`}
              ></div>
              <div className="h-full w-0.5 bg-gray-200"></div>
            </div>
            <div>
              <p className="font-medium">Shipped</p>
              <p className="text-sm text-gray-500">
                {order.status === "Shipped" || order.status === "Delivered"
                  ? new Date(new Date(order.date).getTime() + 1000 * 60 * 60 * 24).toLocaleString()
                  : "Pending"}
              </p>
            </div>
          </div>

          <div className="flex">
            <div className="flex flex-col items-center mr-4">
              <div
                className={`${order.status === "Delivered" ? "bg-green-500" : "bg-gray-300"} rounded-full h-4 w-4`}
              ></div>
            </div>
            <div>
              <p className="font-medium">Delivered</p>
              <p className="text-sm text-gray-500">
                {order.status === "Delivered"
                  ? new Date(new Date(order.date).getTime() + 1000 * 60 * 60 * 24 * 3).toLocaleString()
                  : "Pending"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetails
