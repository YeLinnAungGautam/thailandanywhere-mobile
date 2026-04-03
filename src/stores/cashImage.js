import axios from "axios";
import { defineStore } from "pinia";

export const useCashImageStore = defineStore("cashImage", {
  state: () => ({
    cashImages: null,
    cashAccounts: null,
    loading: false,
    loadingCash: false,
  }),
  getters: {},
  actions: {
    async getSimpleListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/admin/cash-images");
        this.cashImages = response.data.result;
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
      this.cashImages = response.data.result;
      this.loading = false;
      return response.data;
    },
    async getListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/admin/cash-images", {
          params: params,
        });

        this.loading = false;
        this.cashImages = response.data.result;
        console.log(response);
        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async getSummary(params) {
      try {
        this.loadingCash = true;
        const response = await axios.get("/summary-report", { params: params });
        this.cashAccounts = response.data.result;
        console.log(response, "this is response for summary");
        return response.data;
      } catch (error) {
        this.loadingCash = false;
      } finally {
        this.loadingCash = false;
      }
    },
    async getChangeSummaryPage(url, params) {
      this.loadingCash = true;
      const response = await axios.get(url, {
        params: params,
      });
      this.cashAccounts = response.data.result;
      this.loadingCash = false;
      return response.data;
    },
    async addNewAction(data) {
      try {
        const response = await axios.post("/admin/cash-images", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async getDetailAction(id) {
      try {
        const response = await axios.get("/admin/cash-images/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateAction(data, id) {
      try {
        const response = await axios.post("/admin/cash-images/" + id, data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteAction(id) {
      try {
        const response = await axios.delete("/admin/cash-images/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async getVatSummary(params) {
      try {
        this.loading = true;
        const response = await axios.get("/summary-report-vat", {
          params: params,
        });
        console.log(response);

        // this.cashImages = response.data.result;/
        this.loading = false;
        console.log(response);
        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async exportCsv(params) {
      try {
        this.loading = true;
        const response = await axios.get("/summary/export-csv", {
          params: params,
        });
        this.loading = false;
        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async exportParchaseCsv(params) {
      try {
        const response = await axios.get("/parchase/export-csv", {
          params: params,
        });
        // this.loading = false;
        return response.data;
      } catch (error) {
        // this.loading = false;
        throw error;
      }
    },

    async exportInvoiceCsv(params) {
      try {
        // this.loading = true;
        const response = await axios.get("/invoice/export-csv", {
          params: params,
        });
        this.loading = false;
        return response.data;
      } catch (error) {
        // this.loading = false;
        throw error;
      }
    },

    async exportParchaseTaxCsv(params) {
      try {
        // this.loading = true;
        const response = await axios.get("/parchase_tax/export-csv", {
          params: params,
        });
        this.loading = false;
        return response.data;
      } catch (error) {
        // this.loading = false;
        throw error;
      }
    },

    async printImage(params) {
      try {
        this.loading = true;
        const response = await axios.get("/print/cash-image", {
          params: params,
        });

        console.log(response);

        this.loading = false;
        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },

    async getRemainTaxReceipt(params) {
      try {
        const response = await axios.get("/remain-tax-receipt", {
          params: params,
        });

        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async cashImageVerify(data, id) {
      try {
        const response = await axios.post(`cashImage/${id}/data_verify`, data);

        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async cashImageBankVerify(data, id) {
      try {
        const response = await axios.post(`cashImage/${id}/bank_verify`, data);

        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async cashImageDuplicate(params) {
      try {
        const response = await axios.get(`/duplicate-cash-image`, {
          params: params,
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async mergeCashImages(keepId, deleteIds) {
      try {
        const response = await axios.post(`/merge-cash-image`, {
          keep_id: keepId,
          delete_ids: deleteIds,
        });
        return response.data;
      } catch (error) {
        console.error("Merge Cash Images Error:", error);
        throw error;
      }
    },
    async internalTransferCheck(params) {
      try {
        const response = await axios.get(`/list/admin/cash-images/internal`, {
          params: params,
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async editInternalTransfer(data) {
      try {
        const response = await axios.post(
          "/list/admin/cash-images/internal-edit",
          data,
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async cashImageProfitReport(params) {
      try {
        const response = await axios.get(`/cashImage-profit`, {
          params: params,
        });

        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
