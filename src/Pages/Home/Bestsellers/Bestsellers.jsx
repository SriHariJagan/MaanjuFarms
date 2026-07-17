import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import styles from "./BestSellers.module.css";
import { SectionTitle, ProductCardSkeleton } from "../../../Components/ui";
import { useCart } from "../../../Store/useContext.jsx";
import { PRODUCTS_API } from "../../../urls.js";
import { getImageUrl, formatPriceWithUnit } from "../../../utils/getImageUrl .js";
import { ShoppingBag, Eye, Check, Image as ImageIcon } from "lucide-react";
import { toast } from "react-toastify";

const ProductImage = ({ src, alt }) => {
  const [imgError, setImgError] = useState(false);
  const handleError = useCallback(() => setImgError(true), []);
  if (imgError || !src || src === "/Images/image.png") {
    return (
      <div className={styles.imgFallback}>
        <ImageIcon size={28} />
        <span>Image coming soon</span>
      </div>
    );
  }
  return <img src={src} alt={alt} loading="lazy" onError={handleError} />;
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const cardVariant = {
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
  const [loading, setLoading] = useState(true);
  const [addedIds, setAddedIds] = useState(new Set());

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
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart`, { icon: "🛒", autoClose: 1500 });
    setAddedIds((prev) => new Set(prev).add(product._id || product.id));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(product._id || product.id);
        return next;
      });
    }, 2000);
  };

  const handleViewDetails = (product) => {
    navigate(`/product/${product._id || product.id}`, { state: { product } });
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <SectionTitle
          title="Our Best Sellers"
          subtitle="Handpicked favorites from our farm to your table"
        />

        <motion.div
          className={styles.grid}
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : products.map((product) => {
                const productId = product._id || product.id;
                const isAdded = addedIds.has(productId);
                return (
                  <motion.div
                    key={productId}
                    className={styles.card}
                    variants={cardVariant}
                  >
                    <div
                      className={styles.imageWrapper}
                      onClick={() => handleViewDetails(product)}
                    >
                      <ProductImage
                        src={getImageUrl(product.image)}
                        alt={product.name}
                      />
                      <div className={styles.imageOverlay}>
                        <motion.button
                          className={styles.quickView}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(product);
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Eye size={16} />
                        </motion.button>
                      </div>
                    </div>

                    <div className={styles.info}>
                      <h3
                        className={styles.name}
                        onClick={() => handleViewDetails(product)}
                      >
                        {product.name}
                      </h3>
                      <p className={styles.price}>{formatPriceWithUnit(product.price, product.unit)}</p>

                      <motion.button
                        className={`${styles.addBtn} ${isAdded ? styles.added : ""}`}
                        onClick={() => handleAddToCart(product)}
                        whileTap={{ scale: 0.95 }}
                      >
                        <AnimatePresence mode="wait">
                          {isAdded ? (
                            <motion.span
                              key="check"
                              className={styles.btnContent}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Check size={15} />
                              Added
                            </motion.span>
                          ) : (
                            <motion.span
                              key="cart"
                              className={styles.btnContent}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ShoppingBag size={15} />
                              Add to Cart
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
        </motion.div>
      </div>
    </section>
  );
};

export default BestSellers;
