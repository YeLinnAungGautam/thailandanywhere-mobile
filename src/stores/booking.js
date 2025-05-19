import axios from "axios";
import { defineStore } from "pinia";

export const useBookingStore = defineStore("booking", {
  state: () => ({ bookings: null, loading: false }),
  getters: {},
  actions: {
    async getSimpleListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/admin/bookings?limit=1000&page=1");
        this.bookings = response.data.result;
        this.loading = false;

        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async getChangePage(url, params) {
      console.log(params, "this is params pagi");
      this.loading = true;
      const urlSearchParams = new URLSearchParams(new URL(url).search);
      const pageValue = urlSearchParams.get("page");
      const response = await axios.get(`/admin/bookings?page=${pageValue}`, {
        params: params,
      });
      this.bookings = response.data.result;
      console.log(response.data.result, "pagi");
      this.loading = false;
      return response.data;
    },
    async getListAction(params) {
      console.log(params, "this is params");

      try {
        this.loading = true;

        const response = await axios.get(`/admin/bookings`, {
          params: params,
        });
        this.bookings = response.data.result;

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
        const response = await axios.post("/admin/bookings", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async getDetailAction(id) {
      try {
        const response = await axios.get("/admin/bookings/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateAction(data, id) {
      try {
        const response = await axios.post("/admin/bookings/" + id, data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteAction(id) {
      try {
        const response = await axios.delete("/admin/bookings/" + id);
        console.log(response.data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteBookingImage(id) {
      try {
        const response = await axios.delete("/booking-receipt/" + id);
        console.log(response.data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
