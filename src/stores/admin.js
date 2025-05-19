import axios from "axios";
import { defineStore } from "pinia";

export const useAdminStore = defineStore("admin", {
  state: () => ({ admin: null, loading: false }),
  getters: {},
  actions: {
    async getSimpleListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/admin/admins?limit=1000&page=1");
        this.admin = response.data.result;
        this.loading = false;

        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async getChangePage(url) {
      this.loading = true;
      const urlSearchParams = new URLSearchParams(new URL(url).search);
      const pageValue = urlSearchParams.get("page");
      const response = await axios.get(
        "/admin/admins?limit=10&page=" + pageValue
      );
      this.admin = response.data.result;
      this.loading = false;
      return response.data;
    },
    async getListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/admin/admins", {
          params: params,
        });
        this.admin = response.data.result;

        this.loading = false;
        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async addNewAction(data) {
      try {
        const response = await axios.post("/admin/admins", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async rankAction(data) {
      try {
        const response = await axios.get("/current-sale-rank");
        console.log(response);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async getDetailAction(id) {
      try {
        const response = await axios.get("/admin/admins/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateAction(data, id) {
      try {
        const response = await axios.post("/admin/admins/" + id, data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteAction(id) {
      try {
        const response = await axios.delete("/admin/admins/" + id);
        console.log(response.data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
