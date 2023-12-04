import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({ token: null, user: null }),
  getters: {
    isCashier: (state) => {
      return state.user.role === "cashier";
    },
    isAdmin: (state) => {
      return state.user.role === "admin";
    },
    isSuperAdmin: (state) => {
      return state.user.role === "super_admin";
    },
    isReservation: (state) => {
      return state.user.role === "reservation";
    },
  },
  actions: {
    async login(data) {
      try {
        const response = await axios.post("/login", data);
        this.token = response.data.result.token;
        this.user = response.data.result.user;
        console.log(this.user, "this is user");
        axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
        localStorage.setItem("tokenApp", this.token);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async getMe() {
      try {
        const response = await axios.get("/me");
        this.user = response.data.result.user;
        this.token = localStorage.getItem("tokenApp");
        return response;
      } catch (error) {
        this.user = null;
        this.token = null;
        localStorage.removeItem("tokenApp");
        throw error;
      }
    },
    async logout() {
      try {
        const response = await axios.post("/logout");
        localStorage.removeItem("tokenApp");
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
