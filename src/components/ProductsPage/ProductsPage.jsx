import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import productsData from "../../productsData.json";
import "./ProductsPage.css";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setProducts(productsData.products);
  }, []);

  // Group by category
  const categories = [...new Set(products.map((p) => p.category))];

  const handleAddToCart = (product) => {
    console.log("Added to cart:", product);
  };

  const handleViewDetails = (id) => {
    console.log("Viewing details for product ID:", id);
    navigate(`/product/${id}`);
  };

  return (
    <div className="productsPage">
      {/* ✅ Hero Section */}
      <div className="heroSection">
        <h1 className="heroTitle">Our Products</h1>
      </div>

      {/* ✅ Category Sections */}
      {categories.map((category) => (
        <div key={category} className="categorySection">
          <h2 className="categoryTitle">{category.toUpperCase()}</h2>
          <div className="productGrid">
            {products
              .filter((p) => p.category === category)
              .map((product) => (
                <div key={product.id} className="productCard">
                  <img
                    src={product.image || "/images/ghee.jpeg"}
                    alt={product.name}
                    className="productImage"
                  />
                  <h3>{product.name}</h3>
                  <p className="productPrice">
                    {product.price ? `₹${product.price}` : "Coming Soon"}
                  </p>

                  {/* ✅ Buttons */}
                  <div className="buttonGroup">
                    <button
                      className="btnCart"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </button>
                    <button
                      className="btnDetails"
                      onClick={() => handleViewDetails(product.id)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductsPage;
