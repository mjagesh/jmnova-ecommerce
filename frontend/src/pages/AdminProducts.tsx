import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import api from "../services/api";
import ProductForm from "../components/ProductForm";

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

const AdminProducts = () => {
  const token = useSelector((state: RootState) => state.auth.token);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await api.get("/products");

      setProducts(response.data.products);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts((currentProducts) =>
        currentProducts.filter((product) => product._id !== id),
      );
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to delete product");
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormSuccess = (product: Product) => {
    if (editingProduct) {
      setProducts((currentProducts) =>
        currentProducts.map((item) =>
          item._id === product._id ? product : item,
        ),
      );
    } else {
      setProducts((currentProducts) => [product, ...currentProducts]);
    }

    setShowForm(false);
    setEditingProduct(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Product Management</h1>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div>
          {products.map((product) => (
            <div key={product._id}>
              <img src={product.image} alt={product.name} width="120" />

              <h2>{product.name}</h2>

              <p>{product.description}</p>

              <p>₹{product.price}</p>

              <p>Category: {product.category}</p>

              <p>Stock: {product.stock}</p>

              <button onClick={() => handleDelete(product._id)}>Delete</button>
              <button onClick={() => handleEditProduct(product)}>Edit</button>
            </div>
          ))}
        </div>
      )}
      <button onClick={handleAddProduct}>Add Product</button>
      {showForm && (
        <ProductForm
          product={editingProduct}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};

export default AdminProducts;
