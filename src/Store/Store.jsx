import CartProvider from "./Context/CartContext";

const ContextStore = ({ children }) => {
  return <CartProvider>{children}</CartProvider>;
};

export default ContextStore;
