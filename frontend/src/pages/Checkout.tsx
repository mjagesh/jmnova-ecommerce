import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import api from "../services/api";

import type { AppDispatch, RootState } from "../store/store";
import { clearCart } from "../store/cartSlice";

import "./Checkout.css";

const Checkout = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  const cartItems = useSelector((state: RootState) => state.cart.items);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Enter a valid 6-digit pincode";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      navigate("/cart");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await api.post("/orders", {
        shippingAddress: formData,
      });

      console.log("Order created:", response.data.order);

      dispatch(clearCart());

      navigate(`/order-success/${response.data.order._id}`);
    } catch (error: any) {
      console.error("Create order error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to place order. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const { items } = useSelector((state: RootState) => state.cart);

  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  if (items.length === 0) {
    return (
      <main className="checkout-page">
        <div className="checkout-empty">
          <h1>Your Cart is Empty</h1>

          <p>Add some products before proceeding to checkout.</p>

          <button onClick={() => navigate("/")}>Continue Shopping</button>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="checkout-header">
        <h1 className="checkout-title">Checkout</h1>
        <p className="checkout-subtitle">
          Complete your order with your delivery details
        </p>
      </div>

      <div className="checkout-layout">
        <section className="checkout-form-section">
          <h2>Delivery Information</h2>

          <form className="checkout-form" onSubmit={handlePlaceOrder}>
            <div className="checkout-field">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />

              {errors.name && (
                <span className="checkout-error">{errors.name}</span>
              )}
            </div>

            <div className="checkout-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />

              {errors.email && (
                <span className="checkout-error">{errors.email}</span>
              )}
            </div>

            <div className="checkout-field">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                maxLength={10}
              />

              {errors.phone && (
                <span className="checkout-error">{errors.phone}</span>
              )}
            </div>

            <div className="checkout-field">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                name="address"
                rows={3}
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your delivery address"
              />

              {errors.address && (
                <span className="checkout-error">{errors.address}</span>
              )}
            </div>

            <div className="checkout-row">
              <div className="checkout-field">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                />

                {errors.city && (
                  <span className="checkout-error">{errors.city}</span>
                )}
              </div>

              <div className="checkout-field">
                <label htmlFor="state">State</label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State"
                />

                {errors.state && (
                  <span className="checkout-error">{errors.state}</span>
                )}
              </div>
            </div>

            <div className="checkout-field">
              <label htmlFor="pincode">Pincode</label>
              <input
                id="pincode"
                name="pincode"
                type="text"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Enter pincode"
                maxLength={6}
              />

              {errors.pincode && (
                <span className="checkout-error">{errors.pincode}</span>
              )}
            </div>

            <button
              type="submit"
              className="place-order-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Placing Order..." : "Place Order"}
            </button>
          </form>
        </section>

        <aside className="checkout-summary">
          <h2>Order Summary</h2>

          <div className="checkout-products">
            {items.map((item) => (
              <div className="checkout-product" key={item.product._id}>
                <img src={item.product.image} alt={item.product.name} />

                <div>
                  <h3>{item.product.name}</h3>

                  <p>
                    ₹{item.product.price.toLocaleString("en-IN")} ×{" "}
                    {item.quantity}
                  </p>
                </div>

                <strong>
                  ₹
                  {(item.product.price * item.quantity).toLocaleString("en-IN")}
                </strong>
              </div>
            ))}
          </div>

          <div className="checkout-summary-row">
            <span>Subtotal</span>

            <span>₹{subtotal.toLocaleString("en-IN")}</span>
          </div>

          <div className="checkout-summary-row">
            <span>Shipping</span>

            <span className="shipping-free">FREE</span>
          </div>

          <div className="checkout-summary-total">
            <span>Total</span>

            <span>₹{subtotal.toLocaleString("en-IN")}</span>
          </div>

          <button className="back-to-cart" onClick={() => navigate("/cart")}>
            ← Back to Cart
          </button>
        </aside>
      </div>
    </main>
  );
};

export default Checkout;
