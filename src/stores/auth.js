import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
    state: () => ({ token: null, user: null }),
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
                console.log(response, "this is response from getMe");
                return response;
            } catch (error) {
                this.user = null;
                this.token = null;
                localStorage.removeItem("tokenApp");
                throw error;
            }
        },
        async getTarget() {
            try {
                const response = await axios.get("/admin-metas/sale-targets");

                console.log(response, "this is response from getMe");
                return response;
            } catch (error) {
                throw error;
            }
        },

        async targetAction(params) {
            try {
                const response = await axios.post("/admin-metas/sale-targets", params);

                console.log(response, "this is response from getMe");
                return response;
            } catch (error) {
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