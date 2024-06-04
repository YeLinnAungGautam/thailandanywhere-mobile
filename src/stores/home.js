import axios from "axios";
import { defineStore } from "pinia";

export const useHomeStore = defineStore("home", {
  state: () => ({
    loading: false,
    top_sell_list: null,
  }),
  getters: {},
  actions: {
    async getTimeFilterArray(params) {
      try {
        const response = await axios.get(`/general-reports/${params}`);
        // console.log(response, "one day filter");

        // bookings
        return response.data;
      } catch (error) {
        // console.log(error, "this is error");
        return error;
      }
    },
    async getSaleCount(params) {
      try {
        const response = await axios.get(
          `/sale-counts?daterange=${params.first},${params.second}`
        );
        // console.log(response, "one day filter");

        // bookings
        return response.data;
      } catch (error) {
        // console.log(error, "this is error");
        return error;
      }
    },
    async getTimeFilterAdminArray(params) {
      try {
        const response = await axios.get(
          `/general-reports/${params.date}?created_by=${params.created_by}`
        );
        // console.log(response, "one day filter");

        // bookings
        return response.data;
      } catch (error) {
        // console.log(error, "this is error");
        return error;
      }
    },
    async getHotelMostSell(params) {
      try {
        const response = await axios.get(`/reports/hotels`, { params });
        // console.log(response, "one day filter");

        // bookings
        return response.data;
      } catch (error) {
        // console.log(error, "this is error");
        return error;
      }
    },
    async getReportByChannel(params) {
      try {
        const response = await axios.get(
          `/report-by-channel?daterange=${params.first},${params.second}`
        );
        return response.data;
      } catch (error) {
        // console.log(error, "this is error");
        return error;
      }
    },
    async getReportByMethod(params) {
      try {
        const response = await axios.get(
          `/report-by-payment-method?daterange=${params.first},${params.second}`
        );
        return response.data;
      } catch (error) {
        // console.log(error, "this is error");
        return error;
      }
    },
    async getReportByStatus(params) {
      try {
        const response = await axios.get(
          `/report-by-payment-status?daterange=${params.first},${params.second}`
        );
        return response.data;
      } catch (error) {
        // console.log(error, "this is error");
        return error;
      }
    },
    async getReportByPaymentMethod(params) {
      try {
        const response = await axios.get(
          `/report-by-payment-and-product?daterange=${params.first},${params.second}`
        );
        return response.data;
      } catch (error) {
        // console.log(error, "this is error");
        return error;
      }
    },
    async getAgentSales(params) {
      try {
        const response = await axios.get(
          `/sales-by-agent?daterange=${params.first},${params.second}`
        );
        return response.data;
      } catch (error) {
        // console.log(error, "this is error");
        return error;
      }
    },
    async getUnpaidSales(params) {
      try {
        const response = await axios.get(
          `/unpaid-bookings?daterange=${params.first},${params.second}`
        );
        return response.data;
      } catch (error) {
        // console.log(error, "this is error");
        return error;
      }
    },
    async unpaidAgentSales(params) {
      try {
        const response = await axios.get(
          `/unpaid-bookings?daterange=${params.first},${params.second}&agent_id=${params.agent_id}`
        );
        return response.data;
      } catch (error) {
        // console.log(error, "this is error");
        return error;
      }
    },
    async topSellingProducts(params) {
      try {
        this.loading = true;
        const response = await axios.get(`/top-selling-products`, {
          params: params,
        });
        this.top_sell_list = response.data;
        this.loading = false;
        return response.data;
      } catch (error) {
        // console.log(error, "this is error");
        this.loading = false;
        return error;
      }
    },
  },
});
