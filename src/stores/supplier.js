import axios from "axios";
import { defineStore } from "pinia";

export const useSupplierStore = defineStore("supplier", {
    state: () => ({ suppliers: null, loading: false }),
    getters: {},
    actions: {
        async getSimpleListAction(params) {
            try {
                this.loading = true;
                const response = await axios.get("/suppliers?limit=2000&page=1");
                this.suppliers = response.data.result;
                this.loading = false;

                return response.data;
            } catch (error) {
                this.loading = false;
                throw error;
            }
        },
        async getChangePage(url) {
            this.loading = true;
            const response = await axios.get(url);
            this.suppliers = response.data.result;
            this.loading = false;
            return response.data;
        },
        async getListAction(params) {
            try {
                this.loading = true;
                const response = await axios.get("/suppliers", {
                    params: params,
                });
                this.suppliers = response.data.result;
                this.loading = false;
                console.log(response);
                return response.data;
            } catch (error) {
                this.loading = false;
                throw error;
            }
        },
        async addNewAction(data) {
            try {
                const response = await axios.post("/suppliers", data);
                return response.data;
            } catch (error) {
                throw error;
            }
        },
        async updateAction(data, id) {
            try {
                const response = await axios.post("/suppliers/" + id, data);
                return response.data;
            } catch (error) {
                throw error;
            }
        },
        async deleteAction(id) {
            try {
                const response = await axios.delete("/suppliers/" + id);
                return response.data;
            } catch (error) {
                throw error;
            }
        },
    },
});