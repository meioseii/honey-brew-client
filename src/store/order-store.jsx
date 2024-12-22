import { create } from "zustand";

const useOrderStore = create((set) => ({
  userOrders: { products: [] },
  allOrders: [],
  isLoading: false,
  checkOutOrder: async () => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://honey-brew.onrender.com/api/order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to check out order");
      }
    } catch (error) {
      console.error("Error checking out order:", error.message);
    } finally {
      set({ isLoading: false });
    }
  },
  fetchOrders: async () => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://honey-brew.onrender.com/api/order",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const userOrders = await response.json();
      set({ userOrders: userOrders });
    } catch (error) {
      console.error("Error fetching orders:", error.message);
    } finally {
      set({ isLoading: false });
    }
  },
  fetchAllOrders: async (status) => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem("token");

      const url = new URL("https://honey-brew.onrender.com/api/order/admin");
      if (status) {
        url.searchParams.append("status", status);
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 404) {
        console.warn("No orders found");
        set({
          allOrders: {},
          errorMessage: "No orders found",
        });
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const orders = await response.json();
      set({ allOrders: orders });
    } catch (error) {
      console.error("Error fetching orders:", error.message);
    } finally {
      set({ isLoading: false });
    }
  },
  updateOrderStatus: async (orderId, status) => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem("token");

      if (!token) throw new Error("Authentication token not found.");
      const response = await fetch(
        `https://honey-brew.onrender.com/api/order/admin/${orderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update order status");
      }

      set((state) => {
        const updatedOrders = state.allOrders.map((order) =>
          order._id === orderId ? { ...order, status } : order
        );
        console.log("Updated orders:", updatedOrders);
        return { allOrders: updatedOrders };
      });
    } catch (error) {
      console.error("Error updating order status:", error.message);
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useOrderStore;
