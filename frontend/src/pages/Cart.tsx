import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import type { AppDispatch, RootState } from "../store/store";
import { loadCart, setCart } from "../store/cartSlice";
import api from "../services/api";
import "./Cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { items, loading, error } = useSelector(
    (state: RootState) => state.cart,
  );

  useEffect(() => {
    dispatch(loadCart());
  }, [dispatch]);

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) {
      return;
    }

    try {
      const response = await api.put(`/cart/${productId}`, {
        quantity,
      });

      dispatch(setCart(response.data.cart.items));
    } catch (error: any) {
      console.error("Update cart error:", error);

      alert(error.response?.data?.message || "Failed to update cart");
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      const response = await api.delete(`/cart/${productId}`);

      dispatch(setCart(response.data.cart.items));
    } catch (error: any) {
      console.error("Remove cart item error:", error);

      alert(error.response?.data?.message || "Failed to remove item");
    }
  };

  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  if (loading) {
    return <p>Loading cart...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (items.length === 0) {
    return (
      <main className="cart-page">
        <div className="empty-cart">
          <div className="empty-cart-icon" aria-hidden="true">
            🛒
          </div>

          <h1>Your Cart is Empty</h1>

          <p>Looks like you haven't added anything to your cart yet.</p>

          <button className="empty-cart-button" onClick={() => navigate("/")}>
            Continue Shopping
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="cart-header">
        <div>
          <h1 className="cart-title">Your Cart</h1>
          <p className="cart-subtitle">Review your items before checkout</p>
        </div>
      </div>

      <div className="cart-layout">
        <section className="cart-items">
          {items.map((item) => (
            <article className="cart-item" key={item.product._id}>
              <img
                className="cart-item-image"
                src={item.product.image}
                alt={item.product.name}
              />

              <div className="cart-item-details">
                <h2 className="cart-item-name">{item.product.name}</h2>

                <p className="cart-item-price">
                  ₹{item.product.price.toLocaleString("en-IN")}
                </p>

                <div className="cart-quantity">
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.product._id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.product._id, item.quantity + 1)
                    }
                    disabled={item.quantity >= item.product.stock}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <p className="cart-item-total">
                  Item Total: ₹
                  {(item.product.price * item.quantity).toLocaleString("en-IN")}
                </p>

                <button
                  className="cart-remove"
                  onClick={() => handleRemove(item.product._id)}
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </section>

        <aside className="cart-summary">
          <h2>Order Summary</h2>

          <div className="cart-summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString("en-IN")}</span>
          </div>

          <div className="cart-summary-row">
            <span>Shipping</span>
            <span className="shipping-free">FREE</span>
          </div>

          <div className="cart-summary-divider"></div>

          <div className="cart-summary-total">
            <span>Total</span>
            <span>₹{subtotal.toLocaleString("en-IN")}</span>
          </div>

          <div className="cart-actions">
            <button
              className="checkout-button"
              onClick={() => navigate("/checkout")}
            >
              Checkout
            </button>

            <button className="continue-shopping" onClick={() => navigate("/")}>
              Continue Shopping
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Cart;
