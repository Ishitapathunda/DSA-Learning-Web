import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.footer
      className="footer"
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>DSA Learning</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
              Master Data Structures and Algorithms with interactive learning and practice problems.
            </p>
          </div>
          
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/datastructures">Data Structures</Link></li>
              <li><Link to="/algorithms">Algorithms</Link></li>
              <li><Link to="/problems">Problems</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Learn</h3>
            <ul>
              <li><Link to="/datastructures">Arrays</Link></li>
              <li><Link to="/datastructures">Linked Lists</Link></li>
              <li><Link to="/datastructures">Trees</Link></li>
              <li><Link to="/datastructures">Graphs</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Account</h3>
            <ul>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Sign Up</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/aboutus">About Us</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} DSA Learning. All rights reserved. Created by Ishita & Riya.</p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;

