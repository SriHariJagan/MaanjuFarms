import React from "react";
import { useNavigate } from "react-router-dom";
import { productsData } from "../../data.js";
import "./Bestsellers.css";
import { useCart } from "../../Store/useContext.jsx";

const BestSellers = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleViewDetails = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  return (
    <section className="best-sellers">
      <div className="container">
        <h2 className="section-title">Our Best Sellers</h2>
        <div className="products-grid">
          {productsData.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">₹ {product.price}</p>
                <div className="product-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleViewDetails(product)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
