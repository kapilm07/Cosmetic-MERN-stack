import Razorpay from 'razorpay';
import crypto from 'crypto';

// Cached Razorpay instance
let razorpayInstance = null;

// Function to get Razorpay instance (singleton pattern)
const getRazorpayInstance = () => {
  if (!razorpayInstance) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay keys not found in environment variables');
    }
    
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  
  return razorpayInstance;
};

/**
 * Create a Razorpay order
 * @param {number} amount - Amount in INR
 * @param {string} currency - Currency (default: INR)
 * @param {string} receipt - Receipt ID for tracking
 * @returns {Promise<Object>} Razorpay order object
 */
export const createRazorpayOrder = async (amount, currency = 'INR', receipt) => {
  try {
    // Get Razorpay instance
    const razorpay = getRazorpayInstance();
    
    const options = {
      amount: Math.round(amount * 100), // Amount in paise
      currency,
      receipt,
      payment_capture: 1, // Auto capture payment
    };

    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw new Error('Failed to create Razorpay order');
  }
};

/**
 * Verify Razorpay payment signature
 * @param {string} orderId - Razorpay order ID
 * @param {string} paymentId - Razorpay payment ID
 * @param {string} signature - Razorpay signature
 * @returns {boolean} Whether the payment is verified
 */
export const verifyRazorpayPayment = (orderId, paymentId, signature) => {
  try {
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');
    
    return expectedSignature === signature;
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);
    return false;
  }
};

/**
 * Fetch payment details from Razorpay
 * @param {string} paymentId - Razorpay payment ID
 * @returns {Promise<Object>} Payment details
 */
export const getPaymentDetails = async (paymentId) => {
  try {
    const razorpay = getRazorpayInstance();
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    console.error('Error fetching payment details:', error);
    throw new Error('Failed to fetch payment details');
  }
};

export default getRazorpayInstance;