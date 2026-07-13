import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth, useCart, useProducts } from "../../../Store/useContext";
import { ShoppingBag, Eye, X, Plus, Leaf } from "lucide-react";
import "./ProductsPage.css";
import { getImageUrl } from "../../../utils/getImageUrl ";

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
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    image: "",
  });

  const handleAddToCart = (product) => {
    if (product.stock <= 0) return;
    const productWithPrice = { ...product, price: product.price || 100 };
    addToCart(productWithPrice);
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
    });
    handleCloseModal();
  };

  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="products-page">
      <section className="products-hero">
        <div className="products-hero-overlay" />
        <div className="products-hero-content">
          <motion.span
            className="products-hero-badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Pure • Organic • Trusted Quality
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            Our Premium Products
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            {isAdmin ? (
              <button className="products-hero-cta" onClick={handleOpenModal}>
                <Plus size={18} />
                Add Product
              </button>
            ) : (
              <button className="products-hero-cta" onClick={() => navigate("/cart")}>
                <ShoppingBag size={18} />
                Shop Now
              </button>
            )}
          </motion.div>
        </div>
      </section>

      <div className="products-container">
        {categories.map((category) => (
          <section key={category} className="category-section">
            <h2 className="category-title">
              <Leaf size={20} className="category-icon" />
              {category}
            </h2>

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
                    <div className="product-card-image">
                      <img
                        src={getImageUrl(product.image) || "/Images/image.png"}
                        alt={product.name}
                        loading="lazy"
                      />
                      {isAdmin && <span className="admin-badge">Admin</span>}
                      <div className="product-card-overlay">
                        <button
                          className="product-quick-view"
                          onClick={() => handleViewDetails(product._id)}
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="product-card-info">
                      <h3>{product.name}</h3>

                      <span
                        className={`product-stock ${
                          product.stock > 0 ? "in-stock" : "out-of-stock"
                        }`}
                      >
                        {product.stock > 0
                          ? `In Stock (${product.stock})`
                          : "Out of Stock"}
                      </span>

                      <div className="product-card-actions">
                        {isAdmin ? (
                          <button
                            className="product-btn product-btn-primary"
                            onClick={() => handleViewDetails(product._id)}
                          >
                            <Eye size={15} />
                            View Product
                          </button>
                        ) : (
                          <>
                            <button
                              className="product-btn product-btn-secondary"
                              onClick={() => handleViewDetails(product._id)}
                            >
                              Details
                            </button>
                            {product.stock > 0 && (
                              <button
                                className="product-btn product-btn-primary"
                                onClick={() => handleAddToCart(product)}
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
        ))}
      </div>

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
                  {categories.map((cat) => (
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
                  <button type="button" className="modal-btn-cancel" onClick={handleCloseModal}>
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
