import axios from "axios";
import { defineStore } from "pinia";

export const useInternalTransferStore = defineStore("internalTransfer", {
  state: () => ({ loading: false }),
  getters: {},
  actions: {
    async addNewAction(data) {
      try {
        const response = await axios.post("/admin/internal-transfers", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateAction(data, id) {
      try {
        const response = await axios.post(
          "/admin/internal-transfers/" + id,
          data,
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteAction(id) {
      try {
        const response = await axios.delete("/admin/internal-transfers/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
