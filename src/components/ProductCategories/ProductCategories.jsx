import React from "react";
import "./ProductCategories.css";
import { categories } from "../../data.js";



const ProductCategories = () => {
  return (
    <section className="categories-section">
      <h2>Explore Our Categories</h2>
      <div className="categories-grid">
        {categories.map((cat) => (
          <div className="category-card" key={cat.id}>
            <img src={cat.image} alt={cat.title} />
            <h3>{cat.title}</h3>
            <p>{cat.description}</p>
            {/* <button>{cat.buttonText}</button> */}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductCategories;
