import axios from "axios";
import { defineStore } from "pinia";

export const useRoomStore = defineStore("room", {
  state: () => ({ rooms: null, loading: false }),
  getters: {},
  actions: {
    async getSimpleListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/admin/rooms?limit=1000&page=1");
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
        const response = await axios.get("/admin/rooms", {
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
        const response = await axios.post("/admin/rooms", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async getDetailAction(id) {
      try {
        const response = await axios.get("/admin/rooms/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateAction(data, id) {
      try {
        const response = await axios.post("/admin/rooms/" + id, data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteAction(id) {
      try {
        const response = await axios.delete("/admin/rooms/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteImageAction(id, imageID) {
      try {
        const response = await axios.delete(
          "/admin/rooms/" + id + "/images/" + imageID
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
