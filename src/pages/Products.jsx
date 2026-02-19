import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter } from 'react-icons/fi';
import { productService, authService } from '../utils/services';
import ProductCard from '../components/ProductCard';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isAuthenticated = authService.isAuthenticated();

  const categories = ['Electronics', 'Accessories', 'Storage', 'Cables'];

  useEffect(() => {
    loadProducts();
  }, [search, category, page]);

  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites();
    }
  }, [isAuthenticated]);

  const loadProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await productService.getProducts(search, category, page, 10);
      setProducts(response.products);
      setTotalPages(response.pages);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const response = await productService.getFavorites();
      setFavorites(response.favorites.map((fav) => (typeof fav === 'string' ? fav : fav._id)));
    } catch (err) {
      console.error('Failed to load favorites:', err);
    }
  };

  const handleFavoriteChange = (productId, isFavorite) => {
    if (isFavorite) {
      setFavorites([...favorites, productId]);
    } else {
      setFavorites(favorites.filter((id) => id !== productId));
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };

  return (
    <div className="products-container">
      <motion.div className="products-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1>Browse Products</h1>
        <p>Discover amazing products from our sellers</p>
      </motion.div>

      <motion.div className="filters-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={handleSearch}
            className="search-input"
          />
        </div>

        <div className="filter-box">
          <FiFilter className="filter-icon" />
          <select value={category} onChange={handleCategoryChange} className="category-select">
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {error && <div className="error-box">{error}</div>}

      {loading ? (
        <div className="spinner-container">
          <div className="loading"></div>
          <p>Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="no-products">
          <p>No products found</p>
          <small>Try adjusting your search or filters</small>
        </div>
      ) : (
        <>
          <motion.div className="products-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard
                  product={product}
                  isFavorite={favorites.includes(product._id)}
                  onFavoriteChange={handleFavoriteChange}
                />
              </motion.div>
            ))}
          </motion.div>

          <div className="pagination">
            <button
              className="btn-outline"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="page-info">
              Page {page} of {totalPages}
            </span>
            <button
              className="btn-outline"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Products;
