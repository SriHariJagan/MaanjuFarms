import React from 'react';
import { productsData } from '../../data.js';
import './BestSellers.css';

const BestSellers = () => {
  const handleAddToCart = (product) => {
    console.log('Added to cart:', product);
    // Add your cart logic here
  };

  const handleViewDetails = (product) => {
    console.log('View details:', product);
    // Add your view details logic here
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