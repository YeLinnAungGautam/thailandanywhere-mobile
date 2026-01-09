import axios from "axios";
import { defineStore } from "pinia";

export const useAmendStore = defineStore("amend", {
  state: () => ({ amends: null, loading: false }),
  getters: {},
  actions: {
    async getChangePage(url) {
      this.loading = true;
      const response = await axios.get(url);
      this.amends = response.data.result;
      this.loading = false;
      return response.data;
    },
    async getListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/booking-item-amendments", {
          params: params,
        });
        this.amends = response.data.result;
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
        const response = await axios.post("/booking-item-amendments", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async getDetailAction(id) {
      try {
        const response = await axios.get("/booking-item-amendments/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateAction(data, id) {
      try {
        const response = await axios.post(
          "/booking-item-amendments/" + id,
          data
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteAction(id) {
      try {
        const response = await axios.delete("/booking-item-amendments/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async rejectAction(id, data) {
      try {
        const response = await axios.post(
          "/booking-item-amendments/" + id + "/reject",
          data
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
