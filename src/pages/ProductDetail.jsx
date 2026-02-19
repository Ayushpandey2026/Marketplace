import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';
import { MdFavoriteBorder, MdFavorite } from 'react-icons/md';
import { productService, authService } from '../utils/services';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isAuthenticated = authService.isAuthenticated();

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await productService.getProductById(id);
      setProduct(response.product);

      if (isAuthenticated) {
        const favResponse = await productService.getFavorites();
        const favIds = favResponse.favorites.map((fav) => (typeof fav === 'string' ? fav : fav._id));
        setIsFavorite(favIds.includes(id));
      }
    } catch (err) {
      setError('Failed to load product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      if (isFavorite) {
        await productService.removeFromFavorites(id);
      } else {
        await productService.addToFavorites(id);
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Favorite error:', err);
    }
  };

  if (loading) {
    return (
      <div className="detail-container">
        <div className="loading"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="detail-container">
        <button className="btn-outline" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>
        <div className="error-box">{error || 'Product not found'}</div>
      </div>
    );
  }

  return(
    <motion.div className="detail-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <button className="btn-outline back-btn" onClick={() => navigate(-1)}>
        <FiArrowLeft /> Back to Products
      </button>

      <motion.div className="detail-content" initial={{ y: 20 }} animate={{ y: 0 }} transition={{ delay: 0.1 }}>
        <div className="detail-image">
          <img src={product.image} alt={product.title} />
        </div>

        <div className="detail-info">
          <div className="detail-header">
            <div>
              <h1 className="detail-title">{product.title}</h1>
              <p className="detail-category">{product.category}</p>
            </div>
            <motion.button
              className="favorite-btn-large"
              onClick={handleFavorite}
              whileTap={{ scale: 0.9 }}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorite ? <MdFavorite size={32} /> : <MdFavoriteBorder size={32} />}
            </motion.button>
          </div>

          <div className="detail-rating">
            <span className="stars">★★★★★</span>
            <span className="rating-text">{product.rating} ({product.reviews} reviews)</span>
          </div>

          <div className="detail-price">
            <span className="price-label">Price:</span>
            <span className="price-value">${product.price}</span>
          </div>

          <div className="detail-stock">
            <span className="stock-label">Availability:</span>
            {product.stock > 0 ? (
              <span className="in-stock-large">In Stock ({product.stock} available)</span>
            ) : (
              <span className="out-of-stock-large">Out of Stock</span>
            )}
          </div>

          <div className="detail-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          {product.tags && product.tags.length > 0 && (
            <div className="detail-tags">
              <h3>Tags</h3>
              <div className="tags-list">
                {product.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="detail-seller">
            <h3>Seller Information</h3>
            <p>{product.seller?.name}</p>
            <small>{product.seller?.email}</small>
          </div>

          <motion.div className="detail-actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <button className="btn-primary btn-large" disabled={product.stock === 0}>
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
            {!isAuthenticated && (
              <button className="btn-secondary" onClick={() => navigate('/login')}>
                Login to Save
              </button>
            )}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductDetail;
