import axios from "axios";
import { defineStore } from "pinia";

export const useAvailableStore = defineStore("available", {
  state: () => ({ availables: null, loading: false }),
  getters: {},
  actions: {
    async getChangePage(url) {
      this.loading = true;
      const response = await axios.get(url);
      this.availables = response.data;
      this.loading = false;
      return response.data;
    },
    async getListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/admin/product-available-schedules", {
          params: params,
        });
        this.availables = response.data;
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
        const response = await axios.post("/admin/product-available-schedules", data);
        console.log(response);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateAction(data, id) {
      try {
        const response = await axios.post(
          "/admin/product-available-schedules/" + id,
          data
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteAction(id) {
      try {
        const response = await axios.delete(
          "/admin/product-available-schedules/" + id
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
