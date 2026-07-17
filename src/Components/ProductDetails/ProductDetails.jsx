import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth, useCart, useProducts } from "../../Store/useContext";
import styles from "./ProductDetails.module.css";
import { ArrowLeft, ShoppingBag, Package, ShieldCheck, Minus, Plus } from "lucide-react";
import { getImageUrl, formatPriceWithUnit } from "../../utils/getImageUrl ";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { products, loading, updateProduct, deleteProduct } = useProducts();
  const { addToCart } = useCart();
  const { isAdmin } = useAuth();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [similarProducts, setSimilarProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!loading) {
      const found = products.find((p) => p._id === id);
      if (found) {
        setProduct(found);
        setMainImage(found.image || "");
        setEditData({
          name: found.name,
          category: found.category,
          price: found.price,
          stock: found.stock,
          description: found.description,
          image: found.image,
          unit: found.unit || "",
        });
        const related = products.filter(
          (p) => p.category === found.category && p._id !== id,
        );
        setSimilarProducts(related);
        setQuantity(1);
      }
    }
  }, [id, products, loading]);

  if (loading) return <p className={styles.loading}>Loading product...</p>;
  if (!product) return <p className={styles.loading}>Product not found.</p>;

  const isOutOfStock = product.stock <= 0;

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(product._id);
      navigate(-1);
    }
  };

  const handleSave = async () => {
    try {
      let formData = new FormData();
      formData.append("name", editData.name);
      formData.append("category", editData.category);
      formData.append("price", editData.price);
      formData.append("stock", editData.stock);
      formData.append("unit", editData.unit);
      formData.append("description", editData.description);
      if (imageFile) {
        formData.append("image", imageFile);
      } else if (editData.image) {
        formData.append("image", editData.image);
      }
      await updateProduct(product._id, formData);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <motion.div
          className={styles.mainCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
            Back
          </button>

          <div className={styles.mediaSection}>
            <div className={styles.mainImage}>
              {isEditing ? (
                <div className={styles.editImageArea}>
                  <div className={styles.imageInputs}>
                    <input
                      type="text"
                      value={editData.image}
                      onChange={(e) => setEditData({ ...editData, image: e.target.value })}
                      placeholder="Paste Image URL"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setImageFile(file);
                          setPreview(URL.createObjectURL(file));
                          setEditData({ ...editData, image: "" });
                        }
                      }}
                    />
                  </div>
                  {(preview || editData.image) && (
                    <img
                      src={preview || getImageUrl(mainImage)}
                      alt="Preview"
                      className={styles.previewImg}
                    />
                  )}
                </div>
              ) : (
                <img
                  src={getImageUrl(mainImage) || "/images/default-product.jpg"}
                  alt={product.name}
                />
              )}
            </div>

            {product.images && product.images.length > 1 && !isEditing && (
              <div className={styles.thumbnails}>
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    className={`${styles.thumb} ${mainImage === img ? styles.thumbActive : ""}`}
                    onClick={() => setMainImage(img)}
                  >
                    <img src={getImageUrl(img)} alt={`${product.name} ${idx}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={styles.infoSection}>
            {isEditing ? (
              <div className={styles.editForm}>
                <input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
                <input value={editData.category} onChange={(e) => setEditData({ ...editData, category: e.target.value })} />
                <div className={styles.editRow}>
                  <input type="number" value={editData.price} onChange={(e) => setEditData({ ...editData, price: e.target.value })} />
                  <select value={editData.unit} onChange={(e) => setEditData({ ...editData, unit: e.target.value })}>
                    <option value="">Unit</option>
                    <option value="kg">Kilogram</option>
                    <option value="liter">Liter</option>
                    <option value="piece">Piece</option>
                  </select>
                  <input type="number" value={editData.stock} onChange={(e) => setEditData({ ...editData, stock: e.target.value })} />
                </div>
                <textarea value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} />
              </div>
            ) : (
              <>
                <h1 className={styles.productTitle}>{product.name}</h1>

                <div className={styles.badges}>
                  <span className={styles.categoryBadge}>{product.category}</span>
                  <span className={`${styles.stockBadge} ${isOutOfStock ? styles.outStock : styles.inStock}`}>
                    <Package size={14} />
                    {isOutOfStock ? "Out of Stock" : `In Stock (${product.stock})`}
                  </span>
                </div>

                <p className={styles.price}>
                  {formatPriceWithUnit(product.price, product.unit)}
                  {quantity > 1 && (
                    <span className={styles.totalPrice}>
                      {" "}× {quantity} = ₹{(product.price * quantity).toLocaleString()}
                    </span>
                  )}
                </p>

                <p className={styles.description}>{product.description}</p>

                <div className={styles.trustBadges}>
                  <span><ShieldCheck size={16} /> 100% Organic</span>
                  <span><ShieldCheck size={16} /> Free Shipping</span>
                </div>

                <div className={styles.quantitySelector}>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className={styles.qtyValue}>{quantity}</span>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                  >
                    <Plus size={16} />
                  </button>
                  <span className={styles.qtyLabel}>
                    {product.unit ? `(${product.unit})` : "units"}
                  </span>
                </div>
              </>
            )}

            <div className={styles.actions}>
              {isAdmin ? (
                isEditing ? (
                  <div className={styles.editActions}>
                    <button className={styles.saveBtn} onClick={handleSave}>Save</button>
                    <button className={styles.cancelBtn} onClick={() => setIsEditing(false)}>Cancel</button>
                  </div>
                ) : (
                  <div className={styles.editActions}>
                    <button className={styles.editBtn} onClick={() => setIsEditing(true)}>Edit Product</button>
                    <button className={styles.deleteBtn} onClick={handleDelete}>Delete</button>
                  </div>
                )
              ) : (
                <button
                  className={`${styles.addToCartBtn} ${isOutOfStock ? styles.disabled : ""}`}
                  disabled={isOutOfStock}
                  onClick={() => !isOutOfStock && (addToCart(product, quantity), setQuantity(1))}
                >
                  <ShoppingBag size={18} />
                  {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {similarProducts.length > 0 && (
          <section className={styles.similarSection}>
            <h2>Related Products</h2>
            <div className={styles.similarGrid}>
              {similarProducts.map((item) => {
                const isOut = item.stock <= 0;
                return (
                  <motion.div
                    key={item._id}
                    className={styles.similarCard}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className={styles.similarImage} onClick={() => navigate(`/product/${item._id}`)}>
                      <img src={getImageUrl(item.image) || "/images/default-product.jpg"} alt={item.name} loading="lazy" />
                      {isOut && <span className={styles.outBadge}>Out</span>}
                    </div>
                    <div className={styles.similarInfo}>
                      <p className={styles.similarName}>{item.name}</p>
                       <p className={styles.similarPrice}>{formatPriceWithUnit(item.price, item.unit)}</p>
                      <button
                        className={`${styles.similarBtn} ${isOut ? styles.disabled : ""}`}
                        disabled={isOut}
                        onClick={() => addToCart(item)}
                      >
                        {isOut ? "Out of Stock" : "Add to Cart"}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
