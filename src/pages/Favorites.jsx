import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { productService, authService } from '../utils/services';
import ProductCard from '../components/ProductCard';
import './Favorites.css';

const Favorites = () => {
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const isAuthenticated = authService.isAuthenticated();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    loadFavorites();
  }, [isAuthenticated, navigate]);

  const loadFavorites = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await productService.getFavorites();
      setFavoriteProducts(response.favorites);
    } catch (err) {
      setError('Failed to load favorites');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = (productId) => {
    setFavoriteProducts(favoriteProducts.filter((product) => product._id !== productId));
  };

  return (
    <motion.div className="favorites-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <button className="btn-outline back-btn" onClick={() => navigate(-1)}>
        <FiArrowLeft /> Back
      </button>

      <motion.div className="favorites-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1>My Favorites</h1>
        <p>{favoriteProducts.length} product(s) saved</p>
      </motion.div>

      {error && <div className="error-box">{error}</div>}

      {loading ? (
        <div className="spinner-container">
          <div className="loading"></div>
          <p>Loading favorites...</p>
        </div>
      ) : favoriteProducts.length === 0 ? (
        <motion.div className="empty-favorites" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2>No Favorites Yet</h2>
          <p>Start adding your favorite products to see them here</p>
          <button className="btn-primary" onClick={() => navigate('/')}>
            Browse Products
          </button>
        </motion.div>
      ) : (
        <motion.div className="favorites-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          {favoriteProducts.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ProductCard
                product={product}
                isFavorite={true}
                onFavoriteChange={() => handleRemoveFavorite(product._id)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Favorites;
