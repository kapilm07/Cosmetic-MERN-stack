import { Row, Col } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { Link } from 'react-router-dom';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import Meta from '../components/Meta';

const HomeScreen = () => {
  const { pageNumber, keyword, category } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
    category: category || '',
  });

  const categories = [
    { value: '', label: 'All Products', emoji: '🛍️' },
    { value: 'Face', label: 'Face', emoji: '💄' },
    { value: 'Eyes', label: 'Eyes', emoji: '👁️' },
    { value: 'Lips', label: 'Lips', emoji: '💋' },
    { value: 'Skincare', label: 'Skincare', emoji: '🌿' },
  ];

  const handleCategoryChange = (selectedCategory) => {
    if (selectedCategory === '') {
      navigate('/');
    } else {
      navigate(`/category/${selectedCategory}`);
    }
  };

  return (
    <>
      {keyword && (
        <Link to='/' className='btn btn-light mb-4'>
          Go Back
        </Link>
      )}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Meta />
          <div className="beauty-hero-section mb-4" style={{
            background: 'linear-gradient(135deg, #fff3f7 0%, #fce4ec 50%, #f8bbd9 100%)',
            padding: '3rem 2rem',
            borderRadius: '20px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(233, 30, 99, 0.1)',
            border: '1px solid #fce4ec'
          }}>
            <h1 style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>
              ✨ Discover Your Perfect Beauty Look
            </h1>
            <p style={{ color: '#666', fontSize: '1.2rem', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto' }}>
              Explore our curated collection of premium beauty products from top brands
            </p>
            <div style={{ 
              display: 'inline-flex', 
              gap: '10px', 
              background: 'rgba(255,255,255,0.7)',
              padding: '10px 20px',
              borderRadius: '30px',
              backdropFilter: 'blur(10px)'
            }}>
              <span>💄</span>
              <span>✨</span>
              <span>💋</span>
              <span>🌸</span>
            </div>
          </div>
          
          <div className="category-filters mb-5">
            <h4 style={{ color: '#2c2c2c', marginBottom: '20px', fontWeight: '600' }}>🛍️ Shop by Category:</h4>
            <div className="d-flex gap-3 flex-wrap">
              {categories.map((cat) => (
                <span 
                  key={cat.value}
                  className={`badge ${category === cat.value ? 'active-category' : ''}`}
                  style={{ 
                    fontSize: '1rem', 
                    padding: '12px 20px', 
                    cursor: 'pointer',
                    borderRadius: '25px',
                    background: category === cat.value 
                      ? 'linear-gradient(135deg, #e91e63 0%, #f06292 100%)'
                      : 'white',
                    color: category === cat.value ? 'white' : '#e91e63',
                    border: '2px solid #e91e63',
                    boxShadow: category === cat.value 
                      ? '0 4px 15px rgba(233, 30, 99, 0.3)'
                      : '0 2px 8px rgba(233, 30, 99, 0.1)',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => handleCategoryChange(cat.value)}
                >
                  {cat.emoji} {cat.label}
                </span>
              ))}
            </div>
          </div>
          
          <h2 style={{ 
            color: '#2c2c2c', 
            marginBottom: '30px', 
            fontWeight: '600',
            fontSize: '2rem',
            textAlign: 'center'
          }}>
            🌟 Featured Products
          </h2>
          <Row>
            {data.products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={data.pages}
            page={data.page}
            keyword={keyword ? keyword : ''}
            category={category || ''}
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;
