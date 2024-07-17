import "./style.css";
import axios from "axios";
axios.defaults.baseURL =
    import.meta.env.VITE_API_URL;
import { createApp } from "vue";
import { createPinia } from "pinia";
import "vue-select/dist/vue-select.css";
import vSelect from "vue-select";

import App from "./App.vue";
import router from "./router";

import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const token = localStorage.getItem("tokenApp");
if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

const app = createApp(App);

app.use(createPinia());
app.component("v-select", vSelect);
app.component("VueDatePicker", VueDatePicker);
app.use(router);

app.mount("#app");