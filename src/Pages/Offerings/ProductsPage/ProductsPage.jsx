import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth, useCart, useProducts } from "../../../Store/useContext";
import {
  ShoppingBag,
  Eye,
  X,
  Plus,
  Leaf,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "react-toastify";

const ProductImage = ({ src, alt }) => {
  const [imgError, setImgError] = useState(false);
  const handleError = useCallback(() => setImgError(true), []);

  if (imgError || !src || src === "/Images/image.png") {
    return (
      <div className="img-fallback">
        <ImageIcon size={32} />
        <span>Image coming soon</span>
      </div>
    );
  }

  return <img src={src} alt={alt} loading="lazy" onError={handleError} />;
};
import "./ProductsPage.css";
import { getImageUrl } from "../../../utils/getImageUrl ";
import { Badge } from "../../../Components/ui";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const ProductsPage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products, loading, addProduct } = useProducts();
  const { isAdmin } = useAuth();

  const [showAddModal, setShowAddModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    image: "",
    unit: "",
  });

  const handleAddToCart = (product) => {
    if (product.stock <= 0) return;
    const productWithPrice = { ...product, price: product.price || 100 };
    addToCart(productWithPrice);
    toast.success(`${product.name} added to cart`, { icon: "🛒", autoClose: 1500 });
  };

  const handleViewDetails = (id) => navigate(`/product/${id}`);

  const handleOpenModal = () => setShowAddModal(true);
  const handleCloseModal = () => setShowAddModal(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addProduct(formData);
    setFormData({
      name: "",
      category: "",
      price: "",
      stock: "",
      description: "",
      image: "",
      unit: "",
    });
    handleCloseModal();
  };

  const categories = ["All", ...new Set(products.map((p) => p.category))];
  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <div className="products-page">
      {/* Hero Banner */}
      <section className="products-hero">
        <div className="products-hero-bg" />
        <div className="products-hero-overlay" />
        <div className="products-hero-content">
          <motion.span
            className="products-hero-badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Leaf size={12} />
            Pure • Organic • Trusted Quality
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            Our Premium Products
          </motion.h1>
          <motion.p
            className="products-hero-desc"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            Fresh from our farm to your table — 100% organic, ethically sourced
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {isAdmin ? (
              <button className="products-hero-cta" onClick={handleOpenModal}>
                <Plus size={18} />
                Add Product
              </button>
            ) : (
              <button
                className="products-hero-cta"
                onClick={() => navigate("/cart")}
              >
                <ShoppingBag size={18} />
                Shop Now
              </button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <div className="products-container">
        <div className="products-filter-bar">
          <div className="filter-tabs">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                className={`filter-tab ${activeCategory === cat ? "active" : ""}`}
                onClick={() => setActiveCategory(cat)}
                whileTap={{ scale: 0.95 }}
              >
                {cat}
                {activeCategory === cat && (
                  <motion.div
                    className="filter-tab-indicator"
                    layoutId="filterIndicator"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {categories.length > 1 &&
          categories.slice(1).map(
            (category) =>
              filteredProducts.filter((p) => p.category === category).length >
                0 && (
                <section key={category} className="category-section">
                  <motion.h2
                    className="category-title"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                  >
                    <Leaf size={18} className="category-icon" />
                    {category}
                    <span className="category-line" />
                  </motion.h2>

                  <motion.div
                    className="product-grid"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-30px" }}
                  >
                    {products
                      .filter((p) => p.category === category)
                      .map((product) => (
                        <motion.div
                          key={product._id}
                          className="product-card"
                          variants={cardVariants}
                        >
                          <div
                            className="product-card-image"
                            onClick={() => handleViewDetails(product._id)}
                          >
                            <ProductImage
                              src={getImageUrl(product.image)}
                              alt={product.name}
                            />
                            {product.stock <= 0 && (
                              <div className="product-out-badge">
                                Out of Stock
                              </div>
                            )}
                            {product.stock > 0 && product.stock <= 5 && (
                              <Badge
                                status="low-stock"
                                className="product-stock-badge"
                              />
                            )}
                            {isAdmin && (
                              <span className="admin-badge">Admin</span>
                            )}
                            <div className="product-card-overlay">
                              <motion.button
                                className="product-quick-view"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewDetails(product._id);
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Eye size={16} />
                              </motion.button>
                            </div>
                          </div>

                          <div className="product-card-info">
                            <div className="product-info-header">
                              <h3>{product.name}</h3>
                            </div>

                            <span
                              className={`product-stock ${
                                product.stock > 0 ? "in-stock" : "out-of-stock"
                              } ${product.stock > 0 && product.stock <= 5 ? "low-stock" : ""}`}
                            >
                              <span className="stock-dot" />
                              {product.stock > 0
                                ? `In Stock (${product.stock})`
                                : "Out of Stock"}
                            </span>

                            <div className="product-card-actions">
                              {isAdmin ? (
                                <button
                                  className="product-btn product-btn-primary"
                                  onClick={() =>
                                    handleViewDetails(product._id)
                                  }
                                >
                                  <Eye size={15} />
                                  View Product
                                </button>
                              ) : (
                                <>
                                  <button
                                    className="product-btn product-btn-secondary"
                                    onClick={() =>
                                      handleViewDetails(product._id)
                                    }
                                  >
                                    Details
                                  </button>
                                  {product.stock > 0 && (
                                    <button
                                      className="product-btn product-btn-primary"
                                      onClick={() =>
                                        handleAddToCart(product)
                                      }
                                    >
                                      <ShoppingBag size={15} />
                                      Add to Cart
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </motion.div>
                </section>
              )
          )}
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Add New Product</h2>
                <button className="modal-close" onClick={handleCloseModal}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="modal-form">
                <input
                  type="text"
                  name="name"
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <input
                  list="categoriesList"
                  name="category"
                  placeholder="Category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
                <datalist id="categoriesList">
                  {categories
                    .filter((c) => c !== "All")
                    .map((cat) => (
                      <option key={cat} value={cat} />
                    ))}
                </datalist>
                <div className="modal-row">
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="modal-select"
                  >
                    <option value="">Unit</option>
                    <option value="kg">Kilogram</option>
                    <option value="liter">Liter</option>
                    <option value="piece">Piece</option>
                  </select>
                  <input
                    type="number"
                    name="stock"
                    placeholder="Stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                  />
                </div>
                <input
                  type="text"
                  name="image"
                  placeholder="Image URL"
                  value={formData.image}
                  onChange={handleChange}
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleChange}
                />
                <div className="modal-actions">
                  <button
                    type="button"
                    className="modal-btn-cancel"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="modal-btn-submit">
                    Add Product
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductsPage;
