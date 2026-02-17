import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import Loader from '../components/Loader';
import {
  useCreateOrderMutation,
  useVerifyRazorpayPaymentMutation,
  useGetRazorpayConfigQuery,
} from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);

    const [createOrder, { isLoading }] = useCreateOrderMutation();
  const [verifyRazorpayPayment] = useVerifyRazorpayPaymentMutation();

  const {
    data: razorpayConfig,
    isLoading: loadingRazorpay,
    error: errorRazorpay,
  } = useGetRazorpayConfigQuery();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const dispatch = useDispatch();

  const placeOrderHandler = async () => {
    if (loadingRazorpay || !razorpayConfig?.keyId) {
      toast.error('Loading payment configuration...');
      return;
    }

    if (errorRazorpay) {
      toast.error('Failed to load payment configuration');
      return;
    }

    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();

      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        // Razorpay payment options
        const options = {
          key: razorpayConfig.keyId, // Fetched from backend
          amount: Math.round(parseFloat(cart.totalPrice) * 100), // Amount in paise
          currency: 'INR',
          name: 'BeautyHub',
          description: 'Beauty Products Order',
          order_id: res.razorpayOrderId, // This should come from backend
        handler: async function (response) {
          try {
            // Verify payment on backend
            await verifyRazorpayPayment({
              orderId: res._id,
              paymentData: {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              },
            }).unwrap();

            // Payment successful and verified
            toast.success('Payment successful! 🎉');
            dispatch(clearCartItems());
            navigate(`/order/${res._id}`);
          } catch (error) {
            toast.error('Payment verification failed. Please contact support.');
            console.error('Payment verification error:', error);
          }
        },
        prefill: {
          name: cart.shippingAddress.address,
          email: 'customer@beautyhub.com', // You can get this from user info
          contact: '9999999999', // You can add phone to shipping address
        },
        notes: {
          address: `${cart.shippingAddress.address}, ${cart.shippingAddress.city}`,
        },
        theme: {
          color: '#e91e63',
        },
        modal: {
          ondismiss: function () {
            toast.error('Payment cancelled by user');
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    };
    
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address:</strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
                {cart.shippingAddress.postalCode},{' '}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ₹{item.price} = ₹
                          {(item.qty * (item.price * 100)) / 100}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2 style={{ color: '#8b2c7a' }}>✨ Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>₹{cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>₹{cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>GST (18%)</Col>
                  <Col>₹{cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>₹{cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type='button'
                  className='btn-block'
                  disabled={cart.cartItems === 0}
                  onClick={placeOrderHandler}
                  style={{ 
                    background: 'linear-gradient(135deg, #e91e63 0%, #f06292 100%)', 
                    border: 'none',
                    padding: '15px',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    borderRadius: '25px',
                    boxShadow: '0 4px 15px rgba(233, 30, 99, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(233, 30, 99, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(233, 30, 99, 0.3)';
                  }}
                >
                  💕 Complete Your Beauty Order
                </Button>
                {isLoading && <Loader />}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
