import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const [step, setStep] = useState(1);
  
  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });
  
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });

  // Order ID generation for confirmation
  const generateOrderId = () => {
    return 'ORD-' + Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  // Handle shipping form input changes
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  // Handle payment form input changes
  const handleCardInfoChange = (e) => {
    const { name, value } = e.target;
    setCardInfo(prev => ({ ...prev, [name]: value }));
  };

  // Validate shipping info
  const validateShippingInfo = () => {
    const { firstName, lastName, email, address, city, state, zipCode } = shippingInfo;
    if (!firstName || !lastName || !email || !address || !city || !state || !zipCode) {
      toast.error('Please fill all required fields.');
      return false;
    }
    return true;
  };

  // Validate payment info
  const validatePaymentInfo = () => {
    if (paymentMethod === 'credit') {
      const { cardNumber, cardHolder, expiryDate, cvv } = cardInfo;
      if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
        toast.error('Please fill all card details.');
        return false;
      }
      // Basic card number validation
      if (cardNumber.replace(/\\s/g, '').length !== 16) {
        toast.error('Please enter a valid card number.');
        return false;
      }
    }
    return true;
  };

  // Step handlers
  const handleNextStep = () => {
    if (step === 1 && validateShippingInfo()) {
      setStep(2);
    } else if (step === 2 && validatePaymentInfo()) {
      setStep(3);
      // In a real application, we would process payment here
    }
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  // Place order handler
  const handlePlaceOrder = () => {
    // In a real app, you'd send this data to your backend
    const orderId = generateOrderId();
    
    // Clear the cart
    clearCart();
    
    // Show success message
    toast.success('Order placed successfully!');
    
    // Navigate to order confirmation
    navigate('/order-confirmation', { 
      state: { 
        orderId,
        shippingInfo,
        items: cart.items,
        total: cart.total
      }
    });
  };

  // If cart is empty, redirect to books
  if (cart.items.length === 0 && step !== 3) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Add some books to your cart before checking out.</p>
        <button
          onClick={() => navigate('/books')}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Browse Books
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      {/* Progress Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className={`flex flex-col items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              1
            </div>
            <span className="mt-2">Shipping</span>
          </div>
          <div className={`flex-grow h-0.5 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`flex flex-col items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              2
            </div>
            <span className="mt-2">Payment</span>
          </div>
          <div className={`flex-grow h-0.5 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`flex flex-col items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              3
            </div>
            <span className="mt-2">Confirmation</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Step 1: Shipping Information */}
        {step === 1 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={shippingInfo.firstName}
                  onChange={handleShippingChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={shippingInfo.lastName}
                  onChange={handleShippingChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={shippingInfo.email}
                  onChange={handleShippingChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-1">Address *</label>
                <input
                  type="text"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleShippingChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleShippingChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">State/Province *</label>
                <input
                  type="text"
                  name="state"
                  value={shippingInfo.state}
                  onChange={handleShippingChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">ZIP/Postal Code *</label>
                <input
                  type="text"
                  name="zipCode"
                  value={shippingInfo.zipCode}
                  onChange={handleShippingChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Country *</label>
                <select
                  name="country"
                  value={shippingInfo.country}
                  onChange={handleShippingChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Japan">Japan</option>
                </select>
              </div>
            </div>
          </>
        )}

        {/* Step 2: Payment Method */}
        {step === 2 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <input
                  type="radio"
                  id="credit"
                  name="paymentMethod"
                  value="credit"
                  checked={paymentMethod === 'credit'}
                  onChange={() => setPaymentMethod('credit')}
                  className="mr-2"
                />
                <label htmlFor="credit" className="flex items-center">
                  <span className="mr-2">Credit Card</span>
                  <div className="flex space-x-1">
                    <span className="px-2 py-1 bg-blue-100 rounded text-xs">Visa</span>
                    <span className="px-2 py-1 bg-blue-100 rounded text-xs">Mastercard</span>
                    <span className="px-2 py-1 bg-blue-100 rounded text-xs">Amex</span>
                  </div>
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="paypal"
                  name="paymentMethod"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={() => setPaymentMethod('paypal')}
                  className="mr-2"
                />
                <label htmlFor="paypal">PayPal</label>
              </div>
            </div>

            {paymentMethod === 'credit' && (
              <div className="border p-4 rounded bg-gray-50">
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">Card Number *</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={cardInfo.cardNumber}
                    onChange={handleCardInfoChange}
                    placeholder="1234 5678 9012 3456"
                    className="w-full p-2 border rounded"
                    maxLength="16"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">Card Holder Name *</label>
                  <input
                    type="text"
                    name="cardHolder"
                    value={cardInfo.cardHolder}
                    onChange={handleCardInfoChange}
                    placeholder="John Doe"
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-1">Expiry Date *</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={cardInfo.expiryDate}
                      onChange={handleCardInfoChange}
                      placeholder="MM/YY"
                      className="w-full p-2 border rounded"
                      maxLength="5"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">CVV *</label>
                    <input
                      type="text"
                      name="cvv"
                      value={cardInfo.cvv}
                      onChange={handleCardInfoChange}
                      placeholder="123"
                      className="w-full p-2 border rounded"
                      maxLength="3"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'paypal' && (
              <div className="border p-4 rounded bg-gray-50">
                <p className="mb-4">You will be redirected to PayPal to complete your payment after reviewing your order.</p>
                <div className="flex items-center justify-center p-4 bg-blue-50 text-blue-700 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>You'll need a PayPal account to complete this transaction.</span>
                </div>
              </div>
            )}
          </>
        )}

        {/* Step 3: Review & Confirm */}
        {step === 3 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Order Review</h2>
            
            {/* Shipping Info Summary */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Shipping Address</h3>
              <div className="bg-gray-50 p-3 rounded">
                <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                <p>{shippingInfo.address}</p>
                <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                <p>{shippingInfo.country}</p>
                <p className="mt-1">{shippingInfo.email}</p>
              </div>
            </div>
            
            {/* Payment Method Summary */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Payment Method</h3>
              <div className="bg-gray-50 p-3 rounded">
                {paymentMethod === 'credit' ? (
                  <p>Credit Card ending in {cardInfo.cardNumber.slice(-4)}</p>
                ) : (
                  <p>PayPal</p>
                )}
              </div>
            </div>
            
            {/* Order Items */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Order Items</h3>
              <div className="border rounded overflow-hidden">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center p-3 border-b">
                    {item.imageUrl && (
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="w-12 h-16 object-cover mr-3"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.author}</p>
                    </div>
                    <div className="text-right">
                      <p>{item.quantity} × ${item.price.toFixed(2)}</p>
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
                
                {/* Order Summary */}
                <div className="p-3 bg-gray-50">
                  <div className="flex justify-between mb-1">
                    <span>Subtotal:</span>
                    <span>${cart.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Shipping:</span>
                    <span>$5.99</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Tax:</span>
                    <span>${(cart.total * 0.05).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t mt-2">
                    <span>Total:</span>
                    <span>${(cart.total + 5.99 + (cart.total * 0.05)).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {step > 1 && (
            <button
              onClick={handlePreviousStep}
              className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Back
            </button>
          )}
          
          {step < 3 ? (
            <button
              onClick={handleNextStep}
              className="ml-auto px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {step === 2 ? 'Review Order' : 'Continue to Payment'}
            </button>
          ) : (
            <button
              onClick={handlePlaceOrder}
              className="ml-auto px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Place Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;