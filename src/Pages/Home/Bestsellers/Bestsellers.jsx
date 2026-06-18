import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import styles from "./BestSellers.module.css";
import { useCart } from "../../../Store/useContext.jsx";
import { PRODUCTS_API } from "../../../urls.js";
import { getImageUrl } from "../../../utils/getImageUrl .js";
import { ShoppingBag, Eye } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const BestSellers = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  const getRandomProducts = (data, count = 4) => {
    return [...data].sort(() => 0.5 - Math.random()).slice(0, count);
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
        <motion.h2
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          Our Best Sellers
        </motion.h2>

        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {products.map((product) => (
            <motion.div
              key={product._id || product.id}
              className={styles.card}
              variants={cardVariants}
            >
              <div className={styles.imageWrapper}>
                <img
                  src={getImageUrl(product.image) || "/Images/image.png"}
                  alt={product.name}
                  loading="lazy"
                />
                <div className={styles.imageOverlay}>
                  <button
                    className={styles.quickView}
                    onClick={() => handleViewDetails(product)}
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </div>

              <div className={styles.info}>
                <h3 className={styles.name}>{product.name}</h3>
                <p className={styles.price}>₹ {product.price}</p>

                <button
                  className={styles.addBtn}
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingBag size={15} />
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BestSellers;
