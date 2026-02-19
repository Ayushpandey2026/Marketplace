import { Link, useNavigate } from 'react-router-dom';
import { FiHome, FiLogOut, FiLogIn, FiUserPlus } from 'react-icons/fi';
import { MdFavoriteBorder } from 'react-icons/md';
import { authService } from '../utils/services';
import { motion } from 'framer-motion';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <motion.nav className="navbar" initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.3 }}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <FiHome /> MicroMarketplace
        </Link>

        <div className="navbar-menu">
          <Link to="/" className="nav-link">
            Products
          </Link>

          {isAuthenticated && (
            <>
              <Link to="/favorites" className="nav-link">
                <MdFavoriteBorder /> Favorites
              </Link>
              <span className="nav-user">{user?.name}</span>
              <button onClick={handleLogout} className="btn-primary">
                <FiLogOut /> Logout
              </button>
            </>
          )}

          {!isAuthenticated && (
            <>
              <Link to="/login" className="nav-link">
                <FiLogIn /> Login
              </Link>
              <Link to="/register" className="nav-link">
                <FiUserPlus /> Register
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
