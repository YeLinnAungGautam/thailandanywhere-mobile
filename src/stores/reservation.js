import axios from "axios";
import { defineStore } from "pinia";

export const useReservationStore = defineStore("reservation", {
  state: () => ({
    reservations: null,
    loading: false,
    reservationCalendar: null,
    loadingCalendar: false,
  }),
  getters: {},
  actions: {
    async getSimpleListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get(
          "/admin/reservations?limit=1000&page=1",
          {
            params: params,
          }
        );
        this.reservations = response.data.result;
        this.loading = false;

        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async getSimpleCopyListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/admin/reservations", {
          params: params,
        });
        this.loading = false;

        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async getChangePage(url, params) {
      console.log(params, "this is pagi params");
      this.loading = true;
      const urlSearchParams = new URLSearchParams(new URL(url).search);
      const pageValue = urlSearchParams.get("page");
      const response = await axios.get(
        "/admin/reservations?page=" + pageValue,
        {
          params: params,
        }
      );
      this.reservations = response.data.result;
      console.log(response.data.result, "pagi");
      this.loading = false;
      return response.data;
    },
    async getChangeCalPage(url, params) {
      console.log(params, "this is pagi params");
      this.loading = true;
      const urlSearchParams = new URLSearchParams(new URL(url).search);
      const pageValue = urlSearchParams.get("page");
      const response = await axios.get(
        "/admin/reservations?page=" + pageValue,
        {
          params: params,
        }
      );
      this.reservationCalendar = response.data;
      console.log(response.data.result, "pagi");
      this.loading = false;
      return response.data;
    },
    async getListAction(params) {
      try {
        this.loading = true;
        this.loadingCalendar = true;
        const response = await axios.get(
          `/admin/reservations?user_id=${params.user_id}`,
          {
            params,
          }
        );
        this.reservations = response.data.result;

        this.loading = false;
        this.loadingCalendar = false;
        console.log(response);
        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async getListCountAction(params) {
      try {
        this.loading = true;
        this.loadingCalendar = true;
        const response = await axios.get(`/admin/reservations`, {
          params,
        });
        this.reservations = response.data.result;

        this.loading = false;
        this.loadingCalendar = false;
        console.log(response);
        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async getListCalendarAction(params) {
      try {
        this.loading = true;
        const response = await axios.get(`/admin/reservations`, {
          params,
        });

        this.loading = false;
        this.reservationCalendar = response.data;
        console.log(response.data);
        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async addNewAction(data) {
      try {
        const response = await axios.post("/admin/reservations", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async getDetailAction(id) {
      try {
        const response = await axios.get("/admin/reservations/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateAction(data, id) {
      try {
        const response = await axios.post("/admin/reservations/" + id, data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateInfoAction(data, id) {
      try {
        const response = await axios.post(
          "/admin/reservations/info/" + id,
          data
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteAction(id) {
      try {
        const response = await axios.delete("/admin/reservations/" + id);
        console.log(response.data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteCustomerPassportAction(id) {
      try {
        const response = await axios.delete("/admin/customer-passport/" + id);
        console.log(response.data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteResImage(id) {
      try {
        const response = await axios.delete("/admin/reservation-receipt/" + id);
        console.log(response.data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deletePaidImage(id) {
      try {
        const response = await axios.delete(
          "/admin/confirmation-receipt/" + id
        );
        console.log(response.data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async copyReservationDetail(id) {
      try {
        const response = await axios.get("/admin/reservations/" + id + "/copy");
        console.log(response.data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async emailSendReservation(id, data) {
      try {
        const response = await axios.post(
          "/admin/reservations/" + id + "/send-notify-email",
          data
        );
        console.log(response);
        return response;
      } catch (error) {
        throw error;
      }
    },
  },
});
