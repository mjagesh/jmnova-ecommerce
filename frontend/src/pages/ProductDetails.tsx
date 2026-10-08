import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "../store/store";
import { setCart } from "../store/cartSlice";

import "./ProductDetails.css";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  rating: number;
  numReviews: number;
}

const ProductDetails = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/products/${slug}`);

      setProduct(response.data.product);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product) {
      return;
    }

    if (!isAuthenticated) {
      alert("Please login to add products to your cart.");
      navigate("/login");
      return;
    }

    try {
      const response = await api.post("/cart", {
        productId: product._id,
        quantity: 1,
      });

      dispatch(setCart(response.data.cart.items));

      alert("Product added to cart");
    } catch (error: any) {
      console.error("Add to cart error:", error);

      alert(error.response?.data?.message || "Failed to add product to cart");
    }
  };

  if (loading) {
    return (
      <main className="product-details-page">
        <div className="product-details-loading">
          <div className="product-loading-spinner"></div>
          <p>Loading product...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="product-details-page">
        <div className="product-details-error">
          <div className="error-icon">!</div>

          <h2>Unable to load product</h2>

          <p>{error}</p>

          <button
            type="button"
            className="back-products-button"
            onClick={() => navigate("/")}
          >
            ← Back to Products
          </button>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="product-details-page">
        <div className="product-details-error">
          <h2>Product not found</h2>

          <p>The product you're looking for could not be found.</p>

          <button
            type="button"
            className="back-products-button"
            onClick={() => navigate("/")}
          >
            ← Back to Products
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="product-details-page">
      <div className="product-details-container">
        {/* Breadcrumb */}
        <div className="product-breadcrumb">
          <button type="button" onClick={() => navigate("/")}>
            Home
          </button>

          <span>/</span>

          <button type="button" onClick={() => navigate("/")}>
            Products
          </button>

          <span>/</span>

          <span className="breadcrumb-current">{product.name}</span>
        </div>

        {/* Back button */}
        <button
          type="button"
          className="product-back-button"
          onClick={() => navigate("/")}
        >
          ← Back to Products
        </button>

        {/* Product */}
        <section className="product-details-card">
          {/* Product Image */}
          <div className="product-details-image-section">
            <div className="product-details-image-wrapper">
              <img
                src={product.image}
                alt={product.name}
                className="product-details-image"
              />
            </div>
          </div>

          {/* Product Information */}
          <div className="product-details-info">
            <span className="product-details-category">{product.category}</span>

            <h1>{product.name}</h1>

            <div className="product-details-rating">
              <span className="stars">⭐ {product.rating}</span>

              <span className="review-count">
                ({product.numReviews} reviews)
              </span>
            </div>

            <div className="product-details-price">
              ₹{product.price.toLocaleString("en-IN")}
            </div>

            <div className="product-details-divider"></div>

            <div className="product-details-description">
              <h3>Description</h3>

              <p>{product.description}</p>
            </div>

            {/* Stock */}
            <div
              className={`product-details-stock ${
                product.stock > 0 ? "stock-available" : "stock-unavailable"
              }`}
            >
              <span className="stock-dot"></span>

              {product.stock > 0
                ? `${product.stock} items available`
                : "Out of stock"}
            </div>

            {/* Add to Cart */}
            <button
              type="button"
              className="add-to-cart-button"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </button>

            {/* Extra information */}
            <div className="product-details-features">
              <div className="product-feature">
                <span className="feature-icon">✓</span>

                <div>
                  <strong>Quality Products</strong>
                  <p>Carefully selected products</p>
                </div>
              </div>

              <div className="product-feature">
                <span className="feature-icon">↗</span>

                <div>
                  <strong>Easy Shopping</strong>
                  <p>Simple and secure checkout</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProductDetails;
