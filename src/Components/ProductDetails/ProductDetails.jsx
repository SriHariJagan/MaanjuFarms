import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth, useCart, useProducts } from "../../Store/useContext";
import styles from "./ProductDetails.module.css";
import { ArrowLeft } from "lucide-react";
import { getImageUrl } from "../../utils/getImageUrl ";

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

  /* ================= LOAD PRODUCT ================= */
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
        });

        const related = products.filter(
          (p) => p.category === found.category && p._id !== id,
        );
        setSimilarProducts(related);
      }
    }
  }, [id, products, loading]);

  if (loading) return <p className={styles.loading}>Loading product...</p>;
  if (!product) return <p className={styles.loading}>Product not found.</p>;

  /* ================= STOCK LOGIC ================= */
  const isOutOfStock = product.stock <= 0;

  /* ================= HANDLERS ================= */

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

  /* ================= UI ================= */

  return (
    <div className={styles.productDetailsWrapper}>
      <div className={styles.productMainCard}>
        {/* BACK */}
        <button className={styles.btnBack} onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>

        {/* ================= MEDIA ================= */}
        <div className={styles.productMedia}>
          <div className={styles.mainProductImage}>
            {isEditing ? (
              <>
                <div className={styles.imageInputsRow}>
                  <input
                    type="text"
                    value={editData.image}
                    onChange={(e) =>
                      setEditData({ ...editData, image: e.target.value })
                    }
                    placeholder="Paste Image URL"
                    className={styles.editInput}
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
                    className={styles.fileInput}
                  />
                </div>

                {(preview || editData.image) && (
                  <div className={styles.previewWrapper}>
                    <img
                      src={preview || getImageUrl(mainImage)}
                      alt="Preview"
                      className={styles.previewImage}
                    />
                  </div>
                )}
              </>
            ) : (
              <img
                src={getImageUrl(mainImage) || "/images/default-product.jpg"}
                alt={product.name}
              />
            )}
          </div>

          {product.images && product.images.length > 1 && !isEditing && (
            <div className={styles.productThumbnails}>
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={getImageUrl(img)}
                  alt={`${product.name} ${idx}`}
                  className={mainImage === img ? styles.thumbActive : ""}
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ================= INFO ================= */}
        <div className={styles.productInfo}>
          {isEditing ? (
            <>
              <input
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                className={styles.editInput}
              />
              <input
                value={editData.category}
                onChange={(e) =>
                  setEditData({ ...editData, category: e.target.value })
                }
                className={styles.editInput}
              />
              <input
                type="number"
                value={editData.price}
                onChange={(e) =>
                  setEditData({ ...editData, price: e.target.value })
                }
                className={styles.editInput}
              />
              <input
                type="number"
                value={editData.stock}
                onChange={(e) =>
                  setEditData({ ...editData, stock: e.target.value })
                }
                className={styles.editInput}
              />
              <textarea
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                className={styles.editTextarea}
              />
            </>
          ) : (
            <>
              <h1 className={styles.productTitle}>{product.name}</h1>

              <p className={styles.category}>Category: {product.category}</p>

              <p className={styles.price}>₹{product.price}</p>

              {/* ✅ STOCK UI */}
              <p
                className={`${styles.stock} ${
                  isOutOfStock ? styles.outStock : styles.inStock
                }`}
              >
                {isOutOfStock ? "Out of Stock" : `In Stock (${product.stock})`}
              </p>

              <p className={styles.productDesc}>{product.description}</p>
            </>
          )}

          {/* ================= ACTIONS ================= */}
          <div className={styles.actionButtons}>
            {isAdmin ? (
              isEditing ? (
                <>
                  <button
                    className={styles.btnProductSave}
                    onClick={handleSave}
                  >
                    💾 Save
                  </button>
                  <button
                    className={styles.btnProductCancel}
                    onClick={() => setIsEditing(false)}
                  >
                    ❌ Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    className={styles.btnEdit}
                    onClick={() => setIsEditing(true)}
                  >
                    ✏️ Edit Product
                  </button>
                  <button className={styles.btnDelete} onClick={handleDelete}>
                    🗑 Delete Product
                  </button>
                </>
              )
            ) : (
              <button
                className={`${styles.btnAddCart} ${
                  isOutOfStock ? styles.disabledBtn : ""
                }`}
                disabled={isOutOfStock}
                onClick={() => {
                  if (isOutOfStock) return;
                  addToCart(product);
                }}
              >
                {isOutOfStock ? "❌ Out of Stock" : "🛒 Add to Cart"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ================= SIMILAR ================= */}
      {similarProducts.length > 0 && (
        <div className={styles.similarProducts}>
          <h2>Related Products</h2>

          <div className={styles.similarGrid}>
            {similarProducts.map((item) => {
              const isOut = item.stock <= 0;

              return (
                <div key={item._id} className={styles.similarCard}>
                  {/* IMAGE */}
                  <div
                    className={styles.similarImageWrapper}
                    onClick={() => navigate(`/product/${item._id}`)}
                  >
                    <img
                      src={
                        getImageUrl(item.image) || "/images/default-product.jpg"
                      }
                      alt={item.name}
                      className={styles.similarImg}
                    />

                    {isOut && <span className={styles.badgeOut}>Out</span>}
                  </div>

                  {/* INFO */}
                  <div className={styles.similarInfo}>
                    <p className={styles.similarName}>{item.name}</p>

                    <p className={styles.similarPrice}>₹{item.price}</p>

                    <button
                      className={`${styles.similarCartBtn} ${
                        isOut ? styles.disabledBtn : ""
                      }`}
                      disabled={isOut}
                      onClick={() => addToCart(item)}
                    >
                      {isOut ? "Out of Stock" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
