import { defineStore } from "pinia";
import axios from "axios";
import { useChatStore } from "./chat";
import { useSocketStore } from "./socket";
import { useNotificationStore } from "./notification";

export const useAuthStore = defineStore("auth", {
  state: () => ({ token: null, user: null, loading: false, error: null }),
  getters: {
    isCashier: (state) => {
      return state.user.role === "cashier";
    },
    isAdmin: (state) => {
      if (state.user) {
        return state.user.role === "admin";
      } else {
        return false;
      }
    },
    isSuperAdmin: (state) => {
      if (state.user) {
        return state.user.role === "super_admin";
      } else {
        return false;
      }
    },
    isReservation: (state) => {
      if (state.user) {
        return state.user.role === "reservation";
      } else {
        return false;
      }
    },
    isAgent: (state) => {
      if (state.user) {
        return state.user.role === "agent";
      } else {
        return false;
      }
    },
    isAuthenticated: (state) => {
      return state.token !== null && state.user !== null;
    },
  },
  actions: {
    // Login action
    async login(data) {
      this.loading = true;
      this.error = null;

      try {
        console.log("🔐 Logging in...");
        const response = await axios.post("/admin/login", data);

        // Extract token and user
        this.token = response.data.result.token;
        this.user = response.data.result.user;

        console.log("✅ Login successful:", this.user.name);

        // Set axios header
        axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;

        // Save to localStorage
        localStorage.setItem("tokenApp", this.token);
        localStorage.setItem("user", JSON.stringify(this.user));

        window.dispatchEvent(
          new CustomEvent("auth:login", {
            detail: { token: this.token },
          }),
        );

        return response.data;
      } catch (error) {
        console.error("❌ Login failed:", error);
        this.error = error.response?.data?.message || "Login failed";
        this.token = null;
        this.user = null;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async getMe() {
      try {
        if (this.user == null || this.token == null) {
          const response = await axios.get("/admin/me");
          this.user = response.data.result.user;
          this.token = localStorage.getItem("tokenApp");
          console.log(response, "this is response from getMe");
          return response;
        } else {
          return "get already";
        }
      } catch (error) {
        this.user = null;
        this.token = null;
        localStorage.removeItem("tokenApp");
        throw error;
      }
    },
    async getTarget() {
      try {
        const response = await axios.get("/admin/admin-metas/sale-targets");

        console.log(response, "this is response from getMe");
        return response;
      } catch (error) {
        throw error;
      }
    },

    async targetAction(params) {
      try {
        const response = await axios.post(
          "/admin/admin-metas/sale-targets",
          params,
        );

        console.log(response, "this is response from getMe");
        return response;
      } catch (error) {
        throw error;
      }
    },

    async logout() {
      try {
        const response = await axios.post("/admin/logout");

        // ✅ ADD THIS - Reset all stores before clearing auth
        const chatStore = useChatStore();
        const socketStore = useSocketStore();
        const notificationStore = useNotificationStore();

        // Disconnect socket
        socketStore.disconnect();

        // Reset stores
        chatStore.reset();
        notificationStore.reset();

        localStorage.removeItem("tokenApp");
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    // Load from localStorage
    loadFromStorage() {
      try {
        console.log("📦 Loading auth from storage...");

        const savedToken = localStorage.getItem("tokenApp");
        const savedUser = localStorage.getItem("user");

        if (savedToken && savedUser) {
          this.token = savedToken;
          this.user = JSON.parse(savedUser);

          // Restore axios header
          axios.defaults.headers.common["Authorization"] =
            `Bearer ${savedToken}`;

          console.log("✅ Auth restored from storage:", this.user.name);
        } else {
          console.log("ℹ️ No auth data in storage");
        }
      } catch (err) {
        console.error("❌ Failed to load auth from storage:", err);
        this.clearAuth();
      }
    },

    // Clear authentication
    clearAuth() {
      console.log("🧹 Clearing auth...");

      this.token = null;
      this.user = null;
      this.error = null;

      // Remove from localStorage
      localStorage.removeItem("tokenApp");
      localStorage.removeItem("user");

      // Remove from axios header
      delete axios.defaults.headers.common["Authorization"];
    },
  },
});
