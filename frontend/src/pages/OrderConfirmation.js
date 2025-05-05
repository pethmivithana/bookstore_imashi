import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const invoiceRef = useRef();
  
  // Get order data from location state
  const orderData = location.state;
  
  useEffect(() => {
    // If no order data (e.g., direct URL access), redirect to home
    if (!orderData) {
      toast.error('No order information found.');
      navigate('/');
    }
  }, [orderData, navigate]);
  
  // If no order data, show loading until redirect
  if (!orderData) {
    return <div className="text-center py-12">Loading...</div>;
  }
  
  const { orderId, shippingInfo, items, total } = orderData;
  const orderDate = new Date().toLocaleDateString();
  
  // Calculate order totals
  const subtotal = total;
  const shipping = 5.99;
  const tax = total * 0.05;
  const grandTotal = subtotal + shipping + tax;
  
  // Print invoice handler
  const handlePrintInvoice = () => {
    const printContents = invoiceRef.current.innerHTML;
    const originalContents = document.body.innerHTML;
    
    document.body.innerHTML = `
      <html>
        <head>
          <title>Order Invoice</title>
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
    `;
    
    window.print();
    document.body.innerHTML = originalContents;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 className="text-3xl font-bold text-green-800 mb-2">Order Confirmed!</h1>
        <p className="text-lg text-green-700">Thank you for your purchase.</p>
        <p className="text-gray-600 mt-2">
          Your order #{orderId} has been placed and is being processed.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Order Details</h2>
          <button
            onClick={handlePrintInvoice}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Invoice
          </button>
        </div>
        
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Order Information</h3>
              <p><span className="font-medium">Order ID:</span> {orderId}</p>
              <p><span className="font-medium">Date:</span> {orderDate}</p>
              <p><span className="font-medium">Email:</span> {shippingInfo.email}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Shipping Address</h3>
              <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
              <p>{shippingInfo.address}</p>
              <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
              <p>{shippingInfo.country}</p>
            </div>
          </div>
        </div>
        
        <div ref={invoiceRef}>
          <div className="invoice-header">
            <h2 className="text-xl font-bold">INVOICE</h2>
            <p>Order #{orderId}</p>
            <p>Date: {orderDate}</p>
          </div>
          
          <div className="invoice-section">
            <h3 className="font-semibold mb-2">Items</h3>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">Item</th>
                  <th className="text-center">Quantity</th>
                  <th className="text-right">Price</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-gray-500">{item.author}</div>
                    </td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-right">${item.price.toFixed(2)}</td>
                    <td className="text-right">${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="invoice-section">
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
                  <span>${grandTotal.toFixed(2)}</span>
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
      
      <div className="text-center mb-8">
        <Link
          to="/books"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;