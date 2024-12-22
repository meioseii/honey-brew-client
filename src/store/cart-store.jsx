import { create } from "zustand";

const useCartStore = create((set) => ({
  cart: [],
  userCart: { products: [] },
  productData: {},
  isLoading: false,
  clearCart: () => set({ userCart: { products: [] } }),
  handleAddToCart: async (data) => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://honey-brew.onrender.com/api/cart/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add item to cart");
      }

      const updatedCart = await response.json();
      set({ cart: updatedCart, productData: data });
    } catch (error) {
      console.error("Error adding item to cart: ", error);
    } finally {
      set({ isLoading: false });
    }
  },
  fetchUserCart: async () => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No token found in localStorage.");
      }

      const response = await fetch(
        `https://honey-brew.onrender.com/api/cart/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to fetch user cart: ${
            errorData.message || response.statusText
          }`
        );
      }

      const cart = await response.json();
      set({ userCart: cart });
    } catch (error) {
      console.error("Error fetching user cart:", error.message);
    } finally {
      set({ isLoading: false });
    }
  },
  updateProductQuantity: async (productId, action) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found.");

      const response = await fetch(
        `https://honey-brew.onrender.com/api/cart/${productId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ action }), // Pass the action ("add" or "deduct")
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to update product quantity."
        );
      }

      const updatedCart = await response.json();
      set({ userCart: updatedCart });
    } catch (error) {
      console.error("Error updating product quantity:", error.message);
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  handleDeleteProduct: async (productId) => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found.");

      const response = await fetch(
        `https://honey-brew.onrender.com/api/cart/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete product from cart.");
      }

      const updatedCart = await response.json();
      set({ userCart: updatedCart });
    } catch (error) {
      console.error("Error deleting product from cart:", error.message);
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useCartStore;
