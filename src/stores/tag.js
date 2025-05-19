import axios from "axios";
import { defineStore } from "pinia";

export const useTagStore = defineStore("tag", {
  state: () => ({ loading: false, tags: null }),
  getters: {},
  actions: {
    async getSimpleListAction() {
      try {
        this.loading = true;
        const response = await axios.get("/admin/tags-list");
        this.tags = response.data.result;
        this.loading = false;
        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
  },
});
