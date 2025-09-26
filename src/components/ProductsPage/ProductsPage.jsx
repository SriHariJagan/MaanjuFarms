import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useCart, useProducts } from "../../Store/useContext";
import "./ProductsPage.css";

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

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="productsPage">
      {/* Hero Section */}
      <div className="heroSection">
        <div className="heroOverlay"></div>
        <h1 className="heroTitle">Our Premium Products</h1>
        <p className="heroSubtitle">Pure • Organic • Trusted Quality</p>

        {isAdmin ? (
          <button className="heroCTA" onClick={handleOpenModal}>
            ➕ Add Product
          </button>
        ) : (
          <button className="heroCTA" onClick={() => navigate("/cart")}>
            🛒 Shop Now
          </button>
        )}
      </div>

      {/* Category Sections */}
      {categories.map((category) => (
        <div key={category} className="categorySection">
          <h2 className="categoryTitle">{category.toUpperCase()}</h2>
          <div className="productGrid">
            {products
              .filter((p) => p.category === category)
              .map((product) => (
                <div key={product._id} className="productCard">
                  <div className="productImageWrapper">
                    <img
                      src={product.image || "/images/ghee.jpeg"}
                      alt={product.name}
                      className="productImage"
                    />
                    {isAdmin && <span className="adminBadge">ADMIN</span>}
                  </div>

                  <h3>{product.name}</h3>
                  {/* <p className="productPrice">₹{product.price}</p> */}
                  <p className="productDesc">
                    {/* {product.description || "High-quality organic product."} */}
                  </p>

                  <div className="buttonGroup">
                    {isAdmin ? (
                      <button
                        className="btnView"
                        onClick={() => handleViewDetails(product._id)}
                      >
                        👁 View Product
                      </button>
                    ) : (
                      <>
                       <button
                          className="btnDetails"
                          onClick={() => handleViewDetails(product._id)}
                        >
                          🔍 View Details
                        </button>
                        <button
                          className="btnCart"
                          onClick={() => handleAddToCart(product)}
                        >
                          🛒 Add to Cart
                        </button>
          
                      </>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}

      {/* ================== Add Product Modal ================== */}
      {showAddModal && (
        <div className="modalOverlay" onClick={handleCloseModal}>
          <div
            className="modalContent"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <h2>Add New Product</h2>
            <form onSubmit={handleSubmit} className="addProductForm">
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              {/* Category input with datalist */}
              <input
                list="categoriesList"
                name="category"
                placeholder="Select or type Category"
                value={formData.category}
                onChange={handleChange}
                required
              />
              <datalist id="categoriesList">
                {categories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>

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
              <div className="modalButtons">
                <button type="submit">➕ Add Product</button>
                <button type="button" onClick={handleCloseModal}>
                  ❌ Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
