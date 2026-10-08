import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import type { AppDispatch, RootState } from "../store/store";
import { loadCart } from "../store/cartSlice";
import api from "../services/api";

import "./Home.css";

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  rating: number;
  numReviews: number;
}

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useDispatch<AppDispatch>();

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      title: "Elevate Your Everyday",
      description:
        "Discover products designed for modern living, combining style, quality and value.",
      button: "Shop Now",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "New Season. New Style.",
      description:
        "Fresh picks for your wardrobe and lifestyle. Find something you'll love.",
      button: "Explore Collection",
      image:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Technology That Moves With You",
      description:
        "Upgrade your everyday with modern technology and essential accessories.",
      button: "Shop Electronics",
      image:
        "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  /* =========================
     HERO SLIDER
  ========================= */

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((current) =>
        current === heroSlides.length - 1 ? 0 : current + 1,
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((current) =>
      current === heroSlides.length - 1 ? 0 : current + 1,
    );
  };

  const previousSlide = () => {
    setCurrentSlide((current) =>
      current === 0 ? heroSlides.length - 1 : current - 1,
    );
  };

  /* =========================
     FETCH PRODUCTS
  ========================= */

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (search.trim()) {
        params.append("search", search.trim());
      }

      if (category !== "all") {
        params.append("category", category);
      }

      params.append("page", String(page));
      params.append("limit", "8");

      const response = await api.get(`/products?${params.toString()}`);

      setProducts(response.data.products);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, category, page]);

  /* =========================
     CROSS-PAGE SECTION NAVIGATION
  ========================= */

  useEffect(() => {
    const sectionId = location.state?.scrollTo;

    if (!sectionId || loading) {
      return;
    }

    const timer = window.setTimeout(() => {
      const section = document.getElementById(sectionId);

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
        });

        navigate("/", {
          replace: true,
          state: null,
        });
      }
    }, 100);

    return () => window.clearTimeout(timer);
  }, [location.state, loading, navigate]);

  /* =========================
     SEARCH
  ========================= */

  const handleSearch = () => {
    setPage(1);
    setSearch(searchInput);
  };

  const handleClear = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  /* =========================
     CATEGORY
  ========================= */

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setPage(1);
  };

  /* =========================
     LOAD CART
  ========================= */

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(loadCart());
    }
  }, [isAuthenticated, dispatch]);

  /* =========================
     LOADING / ERROR
  ========================= */

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main className="home-page">
      {/* =========================
          HERO SLIDER
      ========================= */}

      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <span className="hero-label">NEW COLLECTION</span>

            <h1>{heroSlides[currentSlide].title}</h1>

            <p>{heroSlides[currentSlide].description}</p>

            <button
              type="button"
              className="hero-button"
              onClick={() => {
                document.getElementById("products-section")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              {heroSlides[currentSlide].button}
              <span>→</span>
            </button>
          </div>

          <div className="hero-image-wrapper">
            <img
              src={heroSlides[currentSlide].image}
              alt={heroSlides[currentSlide].title}
              className="hero-image"
            />
          </div>

          <button
            type="button"
            className="hero-arrow hero-arrow-prev"
            onClick={previousSlide}
            aria-label="Previous slide"
          >
            ←
          </button>

          <button
            type="button"
            className="hero-arrow hero-arrow-next"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            →
          </button>

          <div className="hero-indicators">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`hero-indicator ${
                  currentSlide === index ? "active" : ""
                }`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =========================
          SHOP BY CATEGORY
      ========================= */}

      <section id="category-section" className="category-section">
        <div className="category-section-header">
          <div>
            <span className="section-eyebrow">EXPLORE</span>
            <h2>Shop by Category</h2>
          </div>

          <button
            type="button"
            className="view-all-button"
            onClick={() => {
              handleCategoryChange("all");

              document.getElementById("products-section")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            View All →
          </button>
        </div>

        <div className="category-grid">
          {/* Electronics */}

          <button
            type="button"
            className="category-card category-card-electronics"
            onClick={() => {
              handleCategoryChange("Electronics");

              document.getElementById("products-section")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            <div className="category-card-overlay">
              <span className="category-icon">⌁</span>
              <h3>Electronics</h3>
              <span>Explore Collection →</span>
            </div>
          </button>

          {/* Clothing */}

          <button
            type="button"
            className="category-card category-card-clothing"
            onClick={() => {
              handleCategoryChange("Clothing");

              document.getElementById("products-section")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            <div className="category-card-overlay">
              <span className="category-icon">◈</span>
              <h3>Clothing</h3>
              <span>Explore Collection →</span>
            </div>
          </button>

          {/* Shoes */}

          <button
            type="button"
            className="category-card category-card-shoes"
            onClick={() => {
              handleCategoryChange("Shoes");

              document.getElementById("products-section")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            <div className="category-card-overlay">
              <span className="category-icon">◇</span>
              <h3>Shoes</h3>
              <span>Explore Collection →</span>
            </div>
          </button>

          {/* All Products */}

          <button
            type="button"
            className="category-card category-card-all"
            onClick={() => {
              handleCategoryChange("all");

              document.getElementById("products-section")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            <div className="category-card-overlay">
              <span className="category-icon">✦</span>
              <h3>All Products</h3>
              <span>View Everything →</span>
            </div>
          </button>
        </div>
      </section>

      {/* =========================
          FEATURED PRODUCTS
      ========================= */}

      <section className="featured-section">
        <div className="featured-section-header">
          <div>
            <span className="section-eyebrow">HANDPICKED FOR YOU</span>

            <h2>Featured Products</h2>

            <p>Our top picks from the latest collection.</p>
          </div>

          <button
            type="button"
            className="view-all-button"
            onClick={() => {
              handleCategoryChange("all");

              document.getElementById("products-section")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            Shop All →
          </button>
        </div>

        <div className="featured-grid">
          {products.slice(0, 4).map((product) => (
            <article
              key={product._id}
              className="featured-card"
              onClick={() => navigate(`/products/${product.slug}`)}
            >
              <div className="featured-image-wrapper">
                <img
                  src={product.image}
                  alt={product.name}
                  className="featured-image"
                />

                <span className="featured-badge">Featured</span>
              </div>

              <div className="featured-card-content">
                <p className="product-category">{product.category}</p>

                <h3>{product.name}</h3>

                <div className="featured-bottom">
                  <strong>₹{product.price.toLocaleString("en-IN")}</strong>

                  <span>⭐ {product.rating}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* =========================
          SHOP OUR PRODUCTS
      ========================= */}

      <section id="products-section" className="products-section">
        <div className="products-header">
          <h2>Shop Our Products</h2>

          <p>Discover our latest products at great prices.</p>
        </div>

        {/* SEARCH */}

        <div className="product-toolbar">
          <input
            type="text"
            className="product-search"
            placeholder="Search products..."
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSearch();
              }
            }}
          />

          <button
            type="button"
            className="product-search-button"
            onClick={handleSearch}
          >
            Search
          </button>

          <button
            type="button"
            className="product-clear-button"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>

        {/* CATEGORY FILTERS */}

        <div className="category-filters">
          <button
            type="button"
            className={`category-button ${category === "all" ? "active" : ""}`}
            onClick={() => handleCategoryChange("all")}
          >
            All
          </button>

          <button
            type="button"
            className={`category-button ${
              category === "Electronics" ? "active" : ""
            }`}
            onClick={() => handleCategoryChange("Electronics")}
          >
            Electronics
          </button>

          <button
            type="button"
            className={`category-button ${
              category === "Clothing" ? "active" : ""
            }`}
            onClick={() => handleCategoryChange("Clothing")}
          >
            Clothing
          </button>

          <button
            type="button"
            className={`category-button ${
              category === "Shoes" ? "active" : ""
            }`}
            onClick={() => handleCategoryChange("Shoes")}
          >
            Shoes
          </button>
        </div>

        {/* PRODUCT LIST */}

        {products.length === 0 ? (
          <div className="empty-products">
            <h3>No products found</h3>

            <p>Try changing your search or category filter.</p>
          </div>
        ) : (
          <>
            <div className="product-grid">
              {products.map((product) => (
                <article key={product._id} className="product-card">
                  <div className="product-image-wrapper">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-image"
                    />
                  </div>

                  <div className="product-card-content">
                    <p className="product-category">{product.category}</p>

                    <h3>{product.name}</h3>

                    <p className="product-description">{product.description}</p>

                    <div className="product-price">
                      ₹{product.price.toLocaleString("en-IN")}
                    </div>

                    <div className="product-rating">
                      ⭐ {product.rating} ({product.numReviews})
                    </div>

                    <div className="product-stock">
                      {product.stock > 0
                        ? `${product.stock} available`
                        : "Out of stock"}
                    </div>

                    <button
                      type="button"
                      className="product-details-button"
                      onClick={() => navigate(`/products/${product.slug}`)}
                    >
                      View Details
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {/* PAGINATION */}

            <div className="pagination">
              <button
                type="button"
                onClick={() => setPage((currentPage) => currentPage - 1)}
                disabled={page === 1}
              >
                Previous
              </button>

              <span>
                Page {page} of {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setPage((currentPage) => currentPage + 1)}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default Home;
