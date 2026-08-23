import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          DSA Learning
        </Link>
        
        <ul className="navbar-links">
          <li>
            <Link
              to="/"
              className={`navbar-link ${isActive('/') ? 'active' : ''}`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/datastructures"
              className={`navbar-link ${isActive('/datastructures') ? 'active' : ''}`}
            >
              Data Structures
            </Link>
          </li>
          <li>
            <Link
              to="/algorithms"
              className={`navbar-link ${isActive('/algorithms') ? 'active' : ''}`}
            >
              Algorithms
            </Link>
          </li>
          <li>
            <Link
              to="/problems"
              className={`navbar-link ${isActive('/problems') ? 'active' : ''}`}
            >
              Problems
            </Link>
          </li>
          <li>
            <Link
              to="/leaderboard"
              className={`navbar-link ${isActive('/leaderboard') ? 'active' : ''}`}
            >
              Leaderboard
            </Link>
          </li>
          <li>
            <Link
              to="/aboutus"
              className={`navbar-link ${isActive('/aboutus') ? 'active' : ''}`}
            >
              About Us
            </Link>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <Link
                  to="/dashboard"
                  className={`navbar-link ${isActive('/dashboard') ? 'active' : ''}`}
                >
                  {user?.username}
                </Link>
              </li>
              <li>
                <button type="button" className="btn btn-primary" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  className={`navbar-link ${isActive('/login') ? 'active' : ''}`}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="btn btn-primary">
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </motion.nav>
  );
};

export default Navbar;

