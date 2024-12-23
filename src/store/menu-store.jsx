import { create } from "zustand";

const useMenuStore = create((set) => ({
  menu: [],
  categories: [],
  selectedMenuItem: null,
  isLoading: false,
  errorMessage: null,
  message: "",
  fetchMenuProductsByCategory: async (category) => {
    try {
      set({ isLoading: true });

      const response = await fetch(
        `https://honey-brew.onrender.com/api/menu/${encodeURIComponent(
          category
        )}`
      );

      if (response.status === 404) {
        console.warn("No menu items found for this category.");
        set({
          menu: [],
          errorMessage: "No menu items found for this category.",
        });
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch menu products by category.");
      }

      const data = await response.json();
      set({ menu: data, errorMessage: null });
    } catch (error) {
      console.error("Error fetching menu products by category:", error.message);
      set({ errorMessage: "An error occurred while fetching menu items." });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchMenuCategories: async () => {
    try {
      set({ isLoggedIn: true });
      const response = await fetch(
        "https://honey-brew.onrender.com/api/category"
      );
      const data = await response.json();
      set({ categories: data });
    } catch (error) {
      console.error("Error fetching menu categories: ", error);
    } finally {
      set({ isLoading: false });
    }
  },
  fetchMenuProductById: async (id, category) => {
    try {
      set({ isLoading: true });

      const response = await fetch(
        `https://honey-brew.onrender.com/api/menu/${category}/${id}`
      );

      if (response.status === 404) {
        console.warn("Menu item not found.");
        set({
          selectedMenuItem: null,
          errorMessage: "Menu item not found.",
        });
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch product by ID.");
      }

      const data = await response.json();
      set({
        selectedMenuItem: data,
        errorMessage: null,
      });
    } catch (error) {
      console.error("Error fetching menu item by ID:", error.message);
      set({ errorMessage: "An error occurred while fetching the menu item." });
    } finally {
      set({ isLoading: false });
    }
  },
  addMenuProduct: async (productData) => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("https://honey-brew.onrender.com/api/menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error("Failed to add menu product.");
      }

      const data = await response.json();
      set((state) => ({
        menu: [...state.menu, data.menu],
        errorMessage: null,
      }));
    } catch (error) {
      console.error("Error adding menu product:", error.message);
      set({ errorMessage: "An error occurred while adding the menu product." });
    } finally {
      set({ isLoading: false });
    }
  },
  updateMenuProduct: async (data, id, navigate) => {
    set({ isLoading: true });

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://honey-brew.onrender.com/api/menu/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update menu product.");
      }
      set({ message: "Product updated successfully." });
      navigate("/menu/espresso");
    } catch (error) {
      console.error("Error updating menu product:", error.message);
      set({
        errorMessage: "An error occurred while updating the menu product.",
      });
    } finally {
      set({ isLoading: false });
    }
  },
  deleteMenuProduct: async (id, navigate) => {
    set({ isLoading: true });

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://honey-brew.onrender.com/api/menu/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update menu product.");
      }

      navigate("/menu/espresso");
    } catch (error) {
      console.error("Error updating menu product:", error.message);
      set({
        errorMessage: "An error occurred while updating the menu product.",
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useMenuStore;
