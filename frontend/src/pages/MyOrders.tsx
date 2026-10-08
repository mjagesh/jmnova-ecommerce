import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

import "./MyOrders.css";

interface OrderProduct {
  _id: string;
  name: string;
  slug: string;
  image?: string;
}

interface OrderItem {
  _id?: string;
  product: OrderProduct;
  name: string;
  price: number;
  quantity: number;
}

interface ShippingAddress {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

const MyOrders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/orders");

        const data = response.data;

        setOrders(data.orders || data || []);
      } catch (error: any) {
        console.error("Fetch orders error:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load your orders. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatOrderId = (id: string) => {
    return `#${id.slice(-8).toUpperCase()}`;
  };

  const getStatusLabel = (status: Order["orderStatus"]) => {
    switch (status) {
      case "pending":
        return "Pending";

      case "processing":
        return "Processing";

      case "shipped":
        return "Shipped";

      case "delivered":
        return "Delivered";

      case "cancelled":
        return "Cancelled";

      default:
        return status;
    }
  };

  const getStatusClass = (status: Order["orderStatus"]) => {
    return `status-${status}`;
  };

  if (loading) {
    return (
      <main className="my-orders-page">
        <div className="my-orders-loading">
          <div className="orders-loading-spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="my-orders-page">
        <div className="my-orders-error">
          <div className="orders-error-icon">!</div>

          <h1>Unable to load orders</h1>

          <p>{error}</p>

          <button type="button" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="my-orders-page">
        <div className="my-orders-header">
          <div>
            <h1>My Orders</h1>
            <p>View and track your recent orders</p>
          </div>
        </div>

        <div className="orders-empty">
          <div className="orders-empty-icon" aria-hidden="true">
            📦
          </div>

          <h2>No Orders Yet</h2>

          <p>
            You haven&apos;t placed any orders yet. Start shopping and your
            orders will appear here.
          </p>

          <button type="button" onClick={() => navigate("/")}>
            Start Shopping
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="my-orders-page">
      <div className="my-orders-header">
        <div>
          <h1>My Orders</h1>
          <p>View and track your recent orders</p>
        </div>

        <span className="orders-count">
          {orders.length} {orders.length === 1 ? "Order" : "Orders"}
        </span>
      </div>

      <section className="orders-list">
        {orders.map((order) => {
          const itemCount = order.items.reduce(
            (total, item) => total + item.quantity,
            0,
          );

          return (
            <article className="order-card" key={order._id}>
              <div className="order-card-header">
                <div>
                  <span className="order-label">Order</span>

                  <h2>{formatOrderId(order._id)}</h2>
                </div>

                <div className="order-date">{formatDate(order.createdAt)}</div>
              </div>

              <div className="order-card-body">
                <div className="order-products">
                  {order.items.slice(0, 3).map((item, index) => (
                    <div
                      className="order-product"
                      key={item._id || `${order._id}-${index}`}
                    >
                      {item.product?.image ? (
                        <img src={item.product.image} alt={item.name} />
                      ) : (
                        <div className="order-product-placeholder">📦</div>
                      )}

                      <div className="order-product-info">
                        <h3>{item.name}</h3>

                        <p>
                          ₹{item.price.toLocaleString("en-IN")} ×{" "}
                          {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}

                  {order.items.length > 3 && (
                    <span className="more-products">
                      +{order.items.length - 3} more
                    </span>
                  )}
                </div>

                <div className="order-total">
                  <span>{itemCount} items</span>

                  <strong>₹{order.total.toLocaleString("en-IN")}</strong>
                </div>
              </div>

              <div className="order-card-footer">
                <span
                  className={`order-status ${getStatusClass(
                    order.orderStatus,
                  )}`}
                >
                  <span className="status-dot"></span>

                  {getStatusLabel(order.orderStatus)}
                </span>

                <button
                  type="button"
                  className="view-order-button"
                  onClick={() => navigate(`/orders/${order._id}`)}
                >
                  View Order
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
};

export default MyOrders;
