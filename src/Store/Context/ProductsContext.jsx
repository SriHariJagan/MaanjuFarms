import React, { useState, useEffect } from "react";
import axios from "axios";
import { ProductsContext, useAuth } from "../useContext"; // make sure useAuth is exported from useContext

import { PRODUCTS_API } from "../../urls";
import { productsData } from "../../data";


const ProductsProvider = ({ children }) => {
  const { token } = useAuth(); // get JWT token from Auth context
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Get all products (public)
  const getProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(PRODUCTS_API);
      setProducts(res.data || productsData);
    } catch (err) {
      console.error("Error fetching products:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add product (Admin)
  const addProduct = async (productData) => {
    if (!token) return console.error("No token found");
    try {
      const res = await axios.post(PRODUCTS_API, productData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Added product:", res);
      setProducts((prev) => [...prev, res.data.product]);
    } catch (err) {
      console.error("Error adding product:", err.message);
    }
  };

  // ✅ Update product (Admin)
  const updateProduct = async (id, updatedData) => {
    if (!token) return console.error("No token found");
    try {
      const res = await axios.put(`${PRODUCTS_API}/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Updated product:", res.data.product);
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? res.data.product : p))
      );
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  // ✅ Delete product (Admin)
  const deleteProduct = async (id) => {
    if (!token) return console.error("No token found");
    try {
      await axios.delete(`${PRODUCTS_API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error deleting product:", err.message);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
        getProducts,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export default ProductsProvider;
