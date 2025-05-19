import axios from "axios";
import { defineStore } from "pinia";

export const useProductStore = defineStore("product", {
  state: () => ({ products: null, loading: false, tags: null }),
  getters: {},
  actions: {
    async getSimpleListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get(
          "/admin/product-categories?limit=1000&page=1"
        );
        this.products = response.data.result;
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
      this.products = response.data.result;
      this.loading = false;
      return response.data;
    },
    async getListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/admin/product-categories", {
          params: params,
        });
        this.products = response.data.result;
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
        const response = await axios.post("/admin/product-categories", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateAction(data, id) {
      try {
        const response = await axios.post(
          "/admin/product-categories/" + id,
          data
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteAction(id) {
      try {
        const response = await axios.delete("/admin/product-categories/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    // tags
    async getSimpleListTagAction(params) {
      try {
        this.loading = true;
        const response = await axios.get(
          "/admin/product-tags?limit=1000&page=1"
        );
        this.tags = response.data.result;
        this.loading = false;

        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async getChangeTagPage(url) {
      this.loading = true;
      const response = await axios.get(url);
      this.tags = response.data.result;
      this.loading = false;
      return response.data;
    },
    async getListTagAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/admin/product-tags", {
          params: params,
        });
        this.tags = response.data.result;
        this.loading = false;
        console.log(response);
        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async addNewTagAction(data) {
      try {
        const response = await axios.post("/admin/product-tags", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateTagAction(data, id) {
      try {
        const response = await axios.post("/admin/product-tags/" + id, data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteTagAction(id) {
      try {
        const response = await axios.delete("/admin/product-tags/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
