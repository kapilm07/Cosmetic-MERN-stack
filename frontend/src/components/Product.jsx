import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating';

const Product = ({ product }) => {
  return (
    <Card className='my-3 p-3 rounded beauty-product-card' style={{ 
      border: '1px solid #fce4ec', 
      transition: 'all 0.3s ease',
      borderRadius: '15px',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #ffffff 0%, #fff3f7 100%)'
    }}>
      <Link to={`/product/${product._id}`}>
        <Card.Img 
          src={product.image} 
          variant='top' 
          style={{ 
            borderRadius: '12px', 
            height: '220px', 
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }} 
        />
      </Link>

      <Card.Body style={{ padding: '1.2rem 0' }}>
        <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
          <Card.Title as='div' className='product-title'>
            <strong style={{ color: '#2c2c2c', fontSize: '1.1rem', lineHeight: '1.4' }}>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as='div' className='mb-3'>
          <span className='brand-badge' style={{ 
            background: 'linear-gradient(135deg, #e91e63 0%, #f06292 100%)', 
            color: 'white', 
            padding: '4px 12px', 
            borderRadius: '15px', 
            fontSize: '0.85rem',
            marginRight: '10px',
            boxShadow: '0 2px 8px rgba(233, 30, 99, 0.3)'
          }}>
            {product.brand}
          </span>
          <span style={{ 
            color: '#666', 
            fontSize: '0.85rem',
            background: '#fce4ec',
            padding: '4px 10px',
            borderRadius: '12px',
            border: '1px solid #e91e63'
          }}>
            {product.category}
          </span>
        </Card.Text>

        <Card.Text as='div' className='mb-3'>
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </Card.Text>

        <Card.Text as='h4' style={{ 
          color: '#e91e63',
          fontWeight: 'bold', 
          margin: '0',
          fontSize: '1.3rem'
        }}>
          ₹{product.price}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
