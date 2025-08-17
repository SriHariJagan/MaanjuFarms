import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import productsData from "../../productsData.json";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [similarProducts, setSimilarProducts] = useState([]);

  useEffect(() => {
    const found = productsData.products.find((p) => String(p.id) === id);
    if (found) {
      setProduct(found);
      setMainImage(found.image || "");
      const related = productsData.products.filter(
        (p) => p.category === found.category && String(p.id) !== id
      );
      setSimilarProducts(related);
    }
  }, [id]);

  if (!product) return <div>Product not found.</div>;

  return (
    <div className="detailsWrapper">
      <div className="mainCard">
        {/* === Media Section === */}
        <div className="mediaWrapper">
          <div className="mainMedia">
            <img
              src={mainImage || "/images/Moongdal.jpeg"}
              alt={product.name}
              className="carouselMedia"
            />
          </div>

          {/* ✅ Thumbnails if multiple images exist */}
          {product.images && product.images.length > 1 && (
            <div className="thumbnailWrapper">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.name} ${index}`}
                  className={`thumbnail ${
                    mainImage === img ? "activeThumb" : ""
                  }`}
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
          )}
        </div>

        {/* === Info Section === */}
        <div className="infoSection">
          <h1>{product.name}</h1>
          <p className="category">Category: {product.category}</p>
          {product.price && <p className="price">Price: ₹{product.price}</p>}

          <button className="addToCart">Add to Cart</button>
        </div>
      </div>

      {/* === Similar Products === */}
      {similarProducts.length > 0 && (
        <div className="similarWrapper">
          <h2>Similar Products</h2>
          <div className="relatedGrid">
            {similarProducts.map((item) => (
              <div
                key={item.id}
                className="relatedCard"
                onClick={() => navigate(`/product/${item.id}`)}
              >
                <img
                  src={item.image || "/images/millets.jpeg"}
                  alt={item.name}
                />
                <p>{item.name}</p>
                {item.price && <p>₹{item.price}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
