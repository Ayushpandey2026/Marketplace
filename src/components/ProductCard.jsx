import { Link } from 'react-router-dom';
import { MdFavoriteBorder, MdFavorite } from 'react-icons/md';
import { FiShoppingCart } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { productService } from '../utils/services';
import { useState } from 'react';
import './ProductCard.css';

const ProductCard = ({ product, isFavorite, onFavoriteChange }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFavorite = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isFavorite) {
        await productService.removeFromFavorites(product._id);
      } else {
        await productService.addToFavorites(product._id);
      }
      onFavoriteChange?.(product._id, !isFavorite);
    } catch (error) {
      console.error('Favorite error:', error);
    }
    setLoading(false);
  };

  return (
    <motion.div
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/product/${product._id}`} className="product-image-container">
        <img src={product.image} alt={product.title} className="product-image" />
        {isHovered && (
          <motion.div className="product-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <button className="btn-primary">View Details</button>
          </motion.div>
        )}
      </Link>

      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-category">{product.category}</p>

        <div className="product-rating">
          <span className="rating-stars">★★★★★</span>
          <span className="rating-count">({product.reviews})</span>
        </div>

        <div className="product-footer">
          <div className="product-price">${product.price}</div>
          <motion.button
            className="favorite-btn"
            onClick={handleFavorite}
            disabled={loading}
            whileTap={{ scale: 0.9 }}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? <MdFavorite size={20} /> : <MdFavoriteBorder size={20} />}
          </motion.button>
        </div>

        {product.stock > 0 ? (
          <div className="in-stock">In Stock</div>
        ) : (
          <div className="out-of-stock">Out of Stock</div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
