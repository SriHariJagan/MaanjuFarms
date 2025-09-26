import { createContext, useContext } from "react";

export const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
}


export const AuthContext = createContext();
export const useAuth = () => {
  return useContext(AuthContext);
}


export const ProductsContext = createContext();
export const useProducts = () => {
  return useContext(ProductsContext);
}


export const VillasContext = createContext();
export const useVillas = () => {
  return useContext(VillasContext);
}
