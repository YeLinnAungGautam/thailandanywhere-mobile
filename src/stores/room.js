import axios from "axios";
import { defineStore } from "pinia";

export const useRoomStore = defineStore("room", {
  state: () => ({ rooms: null, loading: false }),
  getters: {},
  actions: {
    async getSimpleListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/rooms?limit=1000&page=1");
        this.rooms = response.data.result;
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
      this.rooms = response.data.result;
      this.loading = false;
      return response.data;
    },
    async getListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/rooms", {
          params: params,
        });
        this.rooms = response.data.result;
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
        const response = await axios.post("/rooms", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async getDetailAction(id) {
      try {
        const response = await axios.get("/rooms/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateAction(data, id) {
      try {
        const response = await axios.post("/rooms/" + id, data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteAction(id) {
      try {
        const response = await axios.delete("/rooms/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
