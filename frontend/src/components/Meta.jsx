import { Helmet } from 'react-helmet-async';

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: 'Welcome To BeautyHub',
  description: 'Premium beauty products at affordable prices - Skincare, Makeup, and more',
  keywords: 'beauty, makeup, skincare, cosmetics, lipstick, foundation, moisturizer, beauty products',
};

export default Meta;
