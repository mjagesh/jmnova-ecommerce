import { useNavigate, useParams } from "react-router-dom";

import "./OrderSuccess.css";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();

  return (
    <main className="order-success-page">
      <section className="order-success-card">
        <div className="order-success-icon" aria-hidden="true">
          ✓
        </div>

        <p className="order-success-label">ORDER CONFIRMED</p>

        <h1>Thank You for Your Order!</h1>

        <p className="order-success-message">
          Your order has been placed successfully. We&apos;ll start processing
          it shortly.
        </p>

        {orderId && (
          <div className="order-success-id">
            <span>Order ID</span>
            <strong>#{orderId}</strong>
          </div>
        )}

        <div className="order-success-info">
          <div className="order-success-info-item">
            <span className="info-icon">✓</span>
            <div>
              <strong>Order received</strong>
              <p>Your order has been successfully created.</p>
            </div>
          </div>

          <div className="order-success-info-item">
            <span className="info-icon">→</span>
            <div>
              <strong>Next step</strong>
              <p>We&apos;ll process your order and prepare it for delivery.</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="order-success-button"
          onClick={() => navigate("/")}
        >
          Continue Shopping
        </button>
      </section>
    </main>
  );
};

export default OrderSuccess;
