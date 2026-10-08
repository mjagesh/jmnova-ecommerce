const products = [
  // Electronics
  {
    name: "Wireless Headphones",
    description:
      "Bluetooth wireless headphones with noise cancellation and deep bass.",
    price: 2499,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    stock: 25,
    rating: 4.5,
    numReviews: 120,
  },
  {
    name: "Mechanical Keyboard",
    description:
      "RGB mechanical keyboard with blue switches for gaming and productivity.",
    price: 3499,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3",
    stock: 15,
    rating: 4.4,
    numReviews: 85,
  },
  {
    name: "Smart Watch",
    description:
      "Smart watch with fitness tracking, notifications and heart-rate monitoring.",
    price: 4999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    stock: 20,
    rating: 4.3,
    numReviews: 95,
  },
  {
    name: "USB-C Hub",
    description: "Multi-port USB-C hub with HDMI, USB 3.0 and SD card support.",
    price: 1299,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1625842268584-8f3296236761",
    stock: 30,
    rating: 4.2,
    numReviews: 62,
  },
  {
    name: "Bluetooth Speaker",
    description:
      "Portable Bluetooth speaker with powerful sound and long battery life.",
    price: 1899,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1",
    stock: 22,
    rating: 4.5,
    numReviews: 74,
  },

  // Clothing
  {
    name: "Men's T-Shirt",
    description: "Comfortable regular-fit cotton t-shirt for everyday wear.",
    price: 799,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    stock: 40,
    rating: 4.2,
    numReviews: 55,
  },
  {
    name: "Men's Hoodie",
    description:
      "Soft cotton-blend hoodie suitable for casual and outdoor wear.",
    price: 1499,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7",
    stock: 25,
    rating: 4.4,
    numReviews: 68,
  },
  {
    name: "Women's Jacket",
    description:
      "Stylish lightweight jacket designed for casual everyday outfits.",
    price: 2499,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a",
    stock: 15,
    rating: 4.5,
    numReviews: 48,
  },
  {
    name: "Denim Jeans",
    description:
      "Classic slim-fit denim jeans with stretch fabric for comfort.",
    price: 1999,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d",
    stock: 30,
    rating: 4.3,
    numReviews: 82,
  },
  {
    name: "Casual Shirt",
    description: "Modern casual shirt made from breathable cotton fabric.",
    price: 1199,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf",
    stock: 35,
    rating: 4.1,
    numReviews: 42,
  },

  // Shoes
  {
    name: "Running Shoes",
    description:
      "Lightweight running shoes with cushioned sole for daily training.",
    price: 2999,
    category: "Shoes",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    stock: 20,
    rating: 4.6,
    numReviews: 135,
  },
  {
    name: "Casual Sneakers",
    description: "Comfortable sneakers designed for everyday casual outfits.",
    price: 2499,
    category: "Shoes",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
    stock: 30,
    rating: 4.3,
    numReviews: 92,
  },
  {
    name: "Sports Shoes",
    description:
      "Durable sports shoes with responsive cushioning and breathable mesh.",
    price: 3499,
    category: "Shoes",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3",
    stock: 18,
    rating: 4.5,
    numReviews: 110,
  },
  {
    name: "Walking Shoes",
    description:
      "Comfortable walking shoes with lightweight construction and soft cushioning.",
    price: 2199,
    category: "Shoes",
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86",
    stock: 24,
    rating: 4.2,
    numReviews: 64,
  },
  {
    name: "Training Shoes",
    description:
      "Versatile training shoes suitable for gym workouts and outdoor activities.",
    price: 2799,
    category: "Shoes",
    image: "https://images.unsplash.com/photo-1539185441755-769473a23570",
    stock: 16,
    rating: 4.4,
    numReviews: 51,
  },

  // Accessories
  {
    name: "Leather Wallet",
    description:
      "Classic leather wallet with multiple card slots and cash compartment.",
    price: 999,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93",
    stock: 35,
    rating: 4.3,
    numReviews: 77,
  },
  {
    name: "Laptop Backpack",
    description:
      "Water-resistant backpack with a dedicated laptop compartment.",
    price: 1799,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
    stock: 20,
    rating: 4.5,
    numReviews: 88,
  },
  {
    name: "Sunglasses",
    description:
      "Classic UV-protection sunglasses suitable for everyday outdoor use.",
    price: 1299,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083",
    stock: 28,
    rating: 4.2,
    numReviews: 46,
  },
  {
    name: "Leather Belt",
    description: "Premium leather belt with a durable metal buckle.",
    price: 899,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc",
    stock: 32,
    rating: 4.1,
    numReviews: 39,
  },

  // Home & Kitchen
  {
    name: "Coffee Maker",
    description: "Compact coffee maker for preparing fresh coffee at home.",
    price: 3999,
    category: "Home & Kitchen",
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6",
    stock: 12,
    rating: 4.4,
    numReviews: 72,
  },
  {
    name: "Air Fryer",
    description:
      "Digital air fryer with multiple cooking presets and temperature control.",
    price: 5499,
    category: "Home & Kitchen",
    image: "https://images.unsplash.com/photo-1648132906571-3b4a7c6c8b93",
    stock: 10,
    rating: 4.6,
    numReviews: 104,
  },
  {
    name: "Electric Kettle",
    description:
      "Fast-boiling electric kettle with automatic shut-off protection.",
    price: 1499,
    category: "Home & Kitchen",
    image: "https://images.unsplash.com/photo-1594213114663-d94db9b1715a",
    stock: 25,
    rating: 4.3,
    numReviews: 58,
  },
  {
    name: "Non-Stick Cookware Set",
    description: "Complete non-stick cookware set for everyday home cooking.",
    price: 2999,
    category: "Home & Kitchen",
    image: "https://images.unsplash.com/photo-1584990347449-a6d8f3b8d6e9",
    stock: 14,
    rating: 4.4,
    numReviews: 61,
  },
];

module.exports = products;
