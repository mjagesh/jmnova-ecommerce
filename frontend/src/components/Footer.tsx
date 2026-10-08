import { Link } from "react-router-dom";

import "./Footer.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-main">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="footer-logo-jm">JM</span>
              <span className="footer-logo-name">NOVA</span>
            </Link>

            <p>Modern shopping, made simple.</p>
          </div>

          {/* Shop */}
          <div className="footer-column">
            <h3>Shop</h3>

            <Link to="/">Products</Link>
            <Link to="/">Categories</Link>
          </div>

          {/* Customer */}
          <div className="footer-column">
            <h3>Customer</h3>

            <Link to="/my-orders">My Orders</Link>
            <Link to="/">Contact</Link>
          </div>

          {/* Account */}
          <div className="footer-column">
            <h3>Account</h3>

            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 JM NOVA</p>

          <p>All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
