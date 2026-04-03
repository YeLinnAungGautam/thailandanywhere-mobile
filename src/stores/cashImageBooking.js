import axios from "axios";
import { defineStore } from "pinia";

export const useCashImageBookingStore = defineStore("cashImageBooking", {
  state: () => ({
    cashImageBookings: null,
    loading: false,
  }),
  getters: {},
  actions: {
    async updateAction(data, id) {
      try {
        const response = await axios.post(
          "/admin/cash-image-bookings/update-and-attach/" + id,
          data,
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    // New methods for the updated functionality
    async createAndAttachAction(data) {
      try {
        const response = await axios.post(
          "/admin/cash-image-bookings/create-and-attach",
          data,
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
