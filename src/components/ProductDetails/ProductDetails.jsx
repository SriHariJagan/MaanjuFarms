import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // ✅ import useNavigate
import { useAuth, useCart, useProducts } from "../../Store/useContext";
import styles from "./ProductDetails.module.css";
import { ArrowLeft } from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // ✅ initialize navigate
  const { products, loading, updateProduct, deleteProduct } = useProducts();
  const { addToCart } = useCart();
  const { isAdmin } = useAuth();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [similarProducts, setSimilarProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

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
          (p) => p.category === found.category && p._id !== id
        );
        setSimilarProducts(related);
      }
    }
  }, [id, products, loading]);

  if (loading) return <p className={styles.loading}>Loading product...</p>;
  if (!product) return <p className={styles.loading}>Product not found.</p>;

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(product._id);
      navigate(-1); // ✅ go back after deletion
    }
  };

  const handleSave = async () => {
    await updateProduct(product._id, editData);
    setProduct({ ...product, ...editData });
    setMainImage(editData.image || mainImage);
    setIsEditing(false);
  };

  return (
    <div className={styles.productDetailsWrapper}>
      <div className={styles.productMainCard}>
        {/* ✅ Back Button */}
        <button className={styles.btnBack} onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        {/* --- Media Section --- */}
        <div className={styles.productMedia}>
          <div className={styles.mainProductImage}>
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={editData.image}
                  onChange={(e) =>
                    setEditData({ ...editData, image: e.target.value })
                  }
                  placeholder="Image URL"
                  className={styles.editInput}
                />
                {editData.image && (
                  <img
                    src={editData.image}
                    alt="Preview"
                    className={styles.previewImage}
                  />
                )}
              </>
            ) : (
              <img
                src={mainImage || "/images/default-product.jpg"}
                alt={product.name}
              />
            )}
          </div>

          {product.images && product.images.length > 1 && !isEditing && (
            <div className={styles.productThumbnails}>
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${product.name} ${idx}`}
                  className={mainImage === img ? styles.thumbActive : ""}
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
          )}
        </div>

        {/* --- Info Section --- */}
        <div className={styles.productInfo}>
          {isEditing ? (
            <>
              <input
                type="text"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                className={styles.editInput}
                placeholder="Product Name"
              />
              <input
                type="text"
                value={editData.category}
                onChange={(e) =>
                  setEditData({ ...editData, category: e.target.value })
                }
                className={styles.editInput}
                placeholder="Category"
              />
              <input
                type="number"
                value={editData.price}
                onChange={(e) =>
                  setEditData({ ...editData, price: e.target.value })
                }
                className={styles.editInput}
                placeholder="Price"
              />
              <input
                type="number"
                value={editData.stock}
                onChange={(e) =>
                  setEditData({ ...editData, stock: e.target.value })
                }
                className={styles.editInput}
                placeholder="Stock"
              />
              <textarea
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                className={styles.editTextarea}
                placeholder="Description"
              />
            </>
          ) : (
            <>
              <h1 className={styles.productTitle}>{product.name}</h1>
              {product.category && (
                <p className={styles.category}>Category: {product.category}</p>
              )}
              {product.price && (
                <p className={styles.price}>₹{product.price}</p>
              )}
              {product.stock !== undefined && (
                <p className={styles.stock}>{product.stock} in stock</p>
              )}
              <p className={styles.productDesc}>{product.description}</p>
            </>
          )}

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
                className={styles.btnAddCart}
                onClick={() => addToCart(product)}
              >
                🛒 Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>

      {/* --- Similar Products --- */}
      {similarProducts.length > 0 && (
        <div className={styles.similarProducts}>
          <h2>Related Products</h2>
          <div className={styles.similarGrid}>
            {similarProducts.map((item) => (
              <div
                key={item._id}
                className={styles.similarCard}
                onClick={() => navigate(`/product/${item._id}`)}
              >
                <img
                  src={item.image || "/images/default-product.jpg"}
                  alt={item.name}
                  className={styles.similarImg}
                />
                <div className={styles.similarInfo}>
                  <p className={styles.similarName}>{item.name}</p>
                  {/* {item.price && (
                    <p className={styles.similarPrice}>₹{item.price}</p>
                  )} */}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
