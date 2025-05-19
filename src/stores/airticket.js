import axios from "axios";
import { defineStore } from "pinia";

export const useAirTicketStore = defineStore("airticket", {
  state: () => ({ airtickets: null, airticket: null, loading: false }),
  getters: {},
  actions: {
    async getSimpleListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get(
          "/admin/airline-tickets?limit=1000&page=1"
        );
        this.airticket = response.data.result;
        this.loading = false;

        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async getChangePage(url, params) {
      this.loading = true;
      const response = await axios.get(url, {
        params: params,
      });
      this.airtickets = response.data.result;
      this.loading = false;
      return response.data;
    },
    async getListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/admin/airline-tickets", {
          params: params,
        });
        this.airtickets = response.data.result;
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
        const response = await axios.post("/admin/airline-tickets", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async addNewAction(data) {
      try {
        const response = await axios.post("/admin/airline-tickets", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async getDetailAction(id) {
      try {
        const response = await axios.get("/admin/airline-tickets/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateAction(data, id) {
      try {
        const response = await axios.post("/admin/airline-tickets/" + id, data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteAction(id) {
      try {
        const response = await axios.delete("/admin/airline-tickets/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
