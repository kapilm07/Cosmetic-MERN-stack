import { useState, useEffect } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../slices/cartSlice';

const PaymentScreen = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [navigate, shippingAddress]);

  const [paymentMethod, setPaymentMethod] = useState('Razorpay');

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1 style={{ color: '#e91e63', marginBottom: '30px' }}>💳 Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as='legend' style={{ fontWeight: '600', marginBottom: '20px' }}>Select Method</Form.Label>
          <Col>
            <Form.Check
              className='my-3'
              type='radio'
              label='🔒 Razorpay - Cards, UPI, Wallets & NetBanking'
              id='Razorpay'
              name='paymentMethod'
              value='Razorpay'
              checked
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={{ fontSize: '1.1rem' }}
            ></Form.Check>
            <div style={{ 
              marginLeft: '25px', 
              color: '#666', 
              fontSize: '0.9rem',
              marginTop: '10px'
            }}>
              💡 Secure payment gateway supporting all major payment methods
            </div>
          </Col>
        </Form.Group>

        <Button 
          type='submit' 
          variant='primary'
          style={{ 
            background: 'linear-gradient(135deg, #e91e63 0%, #f06292 100%)', 
            border: 'none',
            padding: '12px 30px',
            fontWeight: 'bold',
            borderRadius: '25px',
            marginTop: '20px'
          }}
        >
          ✨ Continue to Payment
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
