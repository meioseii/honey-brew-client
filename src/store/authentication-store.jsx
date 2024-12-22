import { create } from "zustand";

const useAuthenticationStore = create((set) => ({
  message: "",
  isLoggedIn: localStorage.getItem("token") ? true : false,
  isAdmin: localStorage.getItem("role") === "admin",
  isLoading: false,
  handleLogin: async (data, navigate) => {
    set({ isLoading: true });

    try {
      const response = await fetch("https://honey-brew.onrender.com/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const { token, role } = await response.json();
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        navigate("/menu/espresso");
        set({
          isLoggedIn: true,
          isAdmin: localStorage.getItem("role") === "admin",
        });
      } else {
        const error = await response.json();
        set({
          message: error.error || "Login failed. Please try again.",
        });
        setTimeout(() => set({ message: "" }), 1500);
      }
    } catch (error) {
      set({
        message: error.message || "An error occurred. Please try again.",
      });
      setTimeout(() => set({ message: "" }), 1500);
    } finally {
      set({ isLoading: false });
    }
  },
  handleRegister: async (data, navigate) => {
    try {
      const response = await fetch("https://honey-brew.onrender.com/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        set({ message: "Registration successful" });
        setTimeout(() => set({ message: "" }), 1500);
        setTimeout(() => navigate("/"), 2000);
      } else {
        const error = await response.json();
        set({
          message: error.error || "Registration failed. Please try again.",
        });
        setTimeout(() => set({ message: "" }), 1500);
      }
    } catch (error) {
      set({
        message: error.message || "An error occurred. Please try again.",
      });
      setTimeout(() => set({ message: "" }), 1500);
    }
  },
  handleLogout: (navigate) => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
    set({ isLoggedIn: false });
  },
}));

export default useAuthenticationStore;
