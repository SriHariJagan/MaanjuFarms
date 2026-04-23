import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./BestSellers.module.css";
import { useCart } from "../../../Store/useContext.jsx";
import { PRODUCTS_API } from "../../../urls.js";

const BestSellers = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  // 🔥 Shuffle + pick 4
  const getRandomProducts = (data, count = 4) => {
    return [...data]
      .sort(() => 0.5 - Math.random())
      .slice(0, count);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(PRODUCTS_API);
        const data = await res.json();

        const randomProducts = getRandomProducts(data, 4);
        setProducts(randomProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleViewDetails = (product) => {
    navigate(`/product/${product._id || product.id}`, {
      state: { product },
    });
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Our Best Sellers</h2>

        <div className={styles.grid}>
          {products.map((product) => (
            <div key={product._id || product.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img src={product.image} alt={product.name} />
              </div>

              <div className={styles.info}>
                <h3 className={styles.name}>{product.name}</h3>
                <p className={styles.price}>₹ {product.price}</p>

                <div className={styles.actions}>
                  <button
                    className={`${styles.btn} ${styles.primaryBtn}`}
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>

                  <button
                    className={`${styles.btn} ${styles.secondaryBtn}`}
                    onClick={() => handleViewDetails(product)}
                  >
                    Details
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