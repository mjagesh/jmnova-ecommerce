import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import api from "../services/api";

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

interface ProductFormProps {
  product?: Product | null;
  onSuccess: (product: Product) => void;
  onCancel: () => void;
}

const ProductForm = ({ product, onSuccess, onCancel }: ProductFormProps) => {
  const token = useSelector((state: RootState) => state.auth.token);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [stock, setStock] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isEditMode = Boolean(product);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setPrice(String(product.price));
      setCategory(product.category);
      setImage(product.image);
      setStock(String(product.stock));
    } else {
      setName("");
      setDescription("");
      setPrice("");
      setCategory("");
      setImage("");
      setStock("");
    }
  }, [product]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    const productData = {
      name,
      description,
      price: Number(price),
      category,
      image,
      stock: Number(stock),
    };

    try {
      let response;

      if (isEditMode && product) {
        response = await api.put(`/products/${product._id}`, productData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        response = await api.post("/products", productData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      onSuccess(response.data.product);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>{isEditMode ? "Edit Product" : "Add Product"}</h2>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Product Name</label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="description">Description</label>

          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="price">Price</label>

          <input
            id="price"
            type="number"
            min="0"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="category">Category</label>

          <input
            id="category"
            type="text"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="image">Image URL</label>

          <input
            id="image"
            type="url"
            value={image}
            onChange={(event) => setImage(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="stock">Stock</label>

          <input
            id="stock"
            type="number"
            min="0"
            value={stock}
            onChange={(event) => setStock(event.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading
            ? "Saving..."
            : isEditMode
              ? "Update Product"
              : "Create Product"}
        </button>

        <button type="button" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
