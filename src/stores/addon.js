import axios from "axios";
import { defineStore } from "pinia";

export const useAddonStore = defineStore("addon", {
  state: () => ({ addons: null, loading: false }),
  getters: {},
  actions: {
    async getChangePage(url, params) {
      this.loading = true;
      const response = await axios.get(url, { params: params });
      this.addons = response.data.result;
      this.loading = false;
      return response.data;
    },
    async getListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/product-addons", {
          params: params,
        });
        this.addons = response.data.result;
        this.loading = false;
        // console.log(response);
        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async addNewAction(data) {
      try {
        const response = await axios.post("/product-addons", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateAction(data, id) {
      try {
        const response = await axios.post("/product-addons/" + id, data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteAction(id) {
      try {
        const response = await axios.delete("/product-addons/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
