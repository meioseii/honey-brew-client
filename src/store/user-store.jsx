import { create } from "zustand";

const useUserStore = create((set) => ({
  message: "",
  userProfileData: {},
  isLoading: false,
  fetchUserProfileData: async () => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://honey-brew.onrender.com/api/users/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user profile data.");
      }

      const user = await response.json();
      set({ userProfileData: user });
    } catch (error) {
      console.error("Error fetching user profile data: ", error);
    } finally {
      set({ isLoading: false });
    }
  },
  updateUserProfileData: async (data) => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://honey-brew.onrender.com/api/users",
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
        throw new Error("Failed to update user profile");
      }

      const updatedUserProfileData = await response.json();
      set({
        userProfileData: updatedUserProfileData,
        message: "Profile updated successfully",
      });
      setTimeout(() => set({ message: "" }), 1500);
    } catch (error) {
      console.error("Error updating user profile: ", error);
    }
  },
}));

export default useUserStore;
