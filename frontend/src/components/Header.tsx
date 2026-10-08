import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "../store/store";
import { loadCart } from "../store/cartSlice";
import { logout } from "../store/authSlice";

import "./Header.css";

const Header = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  const cartItems = useSelector((state: RootState) => state.cart.items);

  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(loadCart());
    }
  }, [isAuthenticated, dispatch]);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleSectionNavigation = (sectionId: string) => {
    closeMenu();

    if (location.pathname === "/") {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
      });

      return;
    }

    navigate("/", {
      state: {
        scrollTo: sectionId,
      },
    });
  };

  const handleLogout = () => {
    dispatch(logout());
    closeMenu();
  };

  return (
    <header className="site-header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <span className="logo-jm">JM</span>
          <span className="logo-name">NOVA</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <NavLink
            to="/"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Home
          </NavLink>

          <button
            type="button"
            className="nav-link nav-button"
            onClick={() => handleSectionNavigation("products-section")}
          >
            Shop
          </button>

          <button
            type="button"
            className="nav-link nav-button"
            onClick={() => handleSectionNavigation("category-section")}
          >
            Categories
          </button>

          {isAuthenticated && (
            <NavLink to="/my-orders" className="nav-link">
              My Orders
            </NavLink>
          )}
        </nav>

        {/* Header Actions */}
        <div className="header-actions">
          {/* Cart */}
          {isAuthenticated && (
            <Link to="/cart" className="header-cart" aria-label="Shopping cart">
              <span className="cart-icon">🛒</span>

              {cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span>
              )}
            </Link>
          )}

          {/* Logout */}
          {isAuthenticated && (
            <button
              type="button"
              className="header-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}

          {/* Login */}
          {!isAuthenticated && (
            <Link to="/login" className="header-login">
              Login
            </Link>
          )}

          {/* Mobile menu button */}
          <button
            type="button"
            className="menu-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`mobile-nav ${menuOpen ? "mobile-nav-open" : ""}`}>
        <NavLink to="/" onClick={closeMenu} className="mobile-nav-link">
          Home
        </NavLink>

        <button
          type="button"
          className="mobile-nav-link mobile-nav-button"
          onClick={() => handleSectionNavigation("products-section")}
        >
          Shop
        </button>

        <button
          type="button"
          className="mobile-nav-link mobile-nav-button"
          onClick={() => handleSectionNavigation("category-section")}
        >
          Categories
        </button>

        {isAuthenticated && (
          <NavLink
            to="/my-orders"
            onClick={closeMenu}
            className="mobile-nav-link"
          >
            My Orders
          </NavLink>
        )}

        {isAuthenticated && (
          <button
            type="button"
            onClick={handleLogout}
            className="mobile-nav-link mobile-logout"
          >
            Logout
          </button>
        )}

        {!isAuthenticated && (
          <NavLink
            to="/login"
            onClick={closeMenu}
            className="mobile-nav-link mobile-login"
          >
            Login
          </NavLink>
        )}
      </div>
    </header>
  );
};

export default Header;
