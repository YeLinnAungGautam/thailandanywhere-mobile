import axios from "axios";
import { defineStore } from "pinia";

export const useCustomizeStore = defineStore("custom", {
    state: () => ({ custom: null, loading: false }),
    getters: {},
    actions: {
        async getListAction() {
            try {
                this.loading = true;
                const res = localStorage.getItem("customize");
                if (res == undefined) {
                    this.custom = {
                        yes: 160000,
                        getting_close: 120000,
                        keep_going: 90000,
                        avg_yes: 160000,
                        avg_getting_close: 130000,
                        avg_keep_going: 90000,
                    };
                } else {
                    this.custom = res;
                }
                this.loading = false;

                return this.custom;
            } catch (error) {
                this.loading = false;
                throw error;
            }
        },
        async addNewAction(data) {
            try {
                localStorage.setItem("customize", data);
                return "updated";
            } catch (error) {
                throw error;
            }
        },
    },
});