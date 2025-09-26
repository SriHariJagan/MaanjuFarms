import AuthProvider from "./Context/AuthContext";
import CartProvider from "./Context/CartContext";
import ProductsProvider from "./Context/ProductsContext";
import VillasProvider from "./Context/VillasContext";

const ContextStore = ({ children }) => {
  return (
    <AuthProvider>
      <VillasProvider>
        <ProductsProvider>
          <CartProvider>{children}</CartProvider>
        </ProductsProvider>
      </VillasProvider>
    </AuthProvider>
  );
};

export default ContextStore;
