import React, { useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../useContext";

import {AUTH_API} from '../../urls'

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // User info
  const [isAdmin, setIsAdmin] = useState(false); // Admin flag
  const [token, setToken] = useState(null);     // JWT token
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // On app load, if token exists, fetch user info
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const ADMIN_EMAIL = "admin@maanjufarms.com";

  const checkIsAdmin = (userData) => {
    if (userData.role === "admin") return true;
    if (userData.isAdmin) return true;
    if (userData.email === ADMIN_EMAIL) return true;
    return false;
  };

  // Fetch user details from backend
  const fetchUser = async (jwtToken) => {
    try {
      const res = await axios.get(`${AUTH_API}/me`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      const userData = res.data.user;
      const admin = checkIsAdmin(userData);

      setUser(userData);
      setIsAdmin(admin);
      return { user: userData, isAdmin: admin };
    } catch (err) {
      console.error(err.response);
      setError("Failed to fetch user info");
      setToken(null);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    setError("");
    try {
      const res = await axios.post(`${AUTH_API}/login`, { email, password });
      const jwtToken = res.data.token;
      setToken(jwtToken);
      localStorage.setItem("token", jwtToken);

      const result = await fetchUser(jwtToken);
      return { success: true, ...result };
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
      return { success: false };
    }
  };

  // Signup function
  const signup = async (name, email, password) => {
    setError("");
    try {
      const res = await axios.post(
        `${AUTH_API}/signup`,
        { name, email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      return { success: true, msg: res.data.msg };
    } catch (err) {
      console.error(err.response);
      setError(err.response?.data?.msg || "Signup failed");
      return { success: false, msg: err.response?.data?.msg };
    }
  };

  // Logout function
const logout = () => {
  setUser(null);
  setIsAdmin(false);
  setToken(null);
  localStorage.removeItem("token");

  // Force a soft page reload
  window.location.href = "/";
};


  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        token,
        loading,
        error,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
