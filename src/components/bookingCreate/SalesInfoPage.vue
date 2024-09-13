<script setup>
import { storeToRefs } from "pinia";
import { ref, defineProps, defineEmits, onMounted, watch } from "vue";
import { Switch } from "@headlessui/vue";
import { useAuthStore } from "../../stores/auth";
import { useAdminStore } from "../../stores/admin";

const props = defineProps({
  data: Object,
});

const authStore = useAuthStore();
const adminStore = useAdminStore();

const { admin } = storeToRefs(adminStore);

const enabled = ref(false);
const emit = defineEmits();

const showInfo = () => {
  emit("change", "changes");
};

const change = (id) => {
  checkValue.value = id;
  emit("checked", checkValue.value);
};

const soldFrom = [
  { id: "1", name: "Facebook" },
  { id: "2", name: "Twitter" },
  { id: "3", name: "Instagram" },
  { id: "4", name: "Twitter" },
  { id: "5", name: "Viber" },
  { id: "6", name: "Phone" },
  { id: "7", name: "Office" },
];
const payment_mm = [
  { id: "1", name: "KPAY" },
  { id: "2", name: "AYAPAY" },
  { id: "3", name: "CBPAY" },
  { id: "4", name: "KBZ BANKING" },
  { id: "5", name: "CB BANKING" },
  { id: "6", name: "MAB BANKING" },
  { id: "7", name: "YOMA BANK" },
];
const payment_thb = [
  { id: "1", name: "Kasikorn" },
  { id: "2", name: "Bangkok Bank" },
  { id: "3", name: "Bank of Ayudhaya" },
  { id: "4", name: "SCB Bank" },
  { id: "5", name: "Others..." },
];

const payment_usd = [
  { id: "1", name: "KPAY" },
  { id: "2", name: "AYAPAY" },
  { id: "3", name: "CBPAY" },
  { id: "4", name: "KBZ BANKING" },
  { id: "5", name: "CB BANKING" },
  { id: "6", name: "MAB BANKING" },
  { id: "7", name: "YOMA BANK" },
  { id: "8", name: "Kasikorn" },
  { id: "9", name: "Bangkok Bank" },
  { id: "10", name: "Bank of Ayudhaya" },
  { id: "11", name: "SCB Bank" },
  { id: "12", name: "Others..." },
];

const payment_status = [
  { id: "1", name: "fully_paid" },
  { id: "2", name: "not_paid" },
  { id: "3", name: "partially_paid" },
];
const payment_currency = [
  { id: "1", name: "MMK" },
  { id: "2", name: "USD" },
  { id: "3", name: "THB" },
];
const reservation_status = [
  { id: "1", name: "reserved" },
  { id: "2", name: "awaiting_payment" },
  { id: "3", name: "declined" },
];

const formItemType = [
  { id: "1", name: "Van Tour", data: "AppModelsPrivateVanTour" },
  { id: "2", name: "Group Tour", data: "AppModelsGroupTour" },
  { id: "3", name: "Airport Pickup", data: " AppModelsAirportPickup" },
  { id: "4", name: "Entrance Ticket", data: "AppModelsEntranceTicket" },
  { id: "5", name: "Inclusive", data: "AppModelsInclusive" },
  { id: "6", name: "Hotel Room", data: "AppModelsRoom" },
  { id: "7", name: "AirLine", data: "AppModelsAirline" },
];

const paymentArray = [
  // Bank Transfer, International Remittance, Cash, etc
  { id: "1", name: "Bank Transfer" },
  { id: "2", name: "International Remittance" },
  { id: "3", name: "Cash" },
  { id: "4", name: "Other ..." },
];

const payment = ref([]);
const paymentValid = ref(true);
const choosePaymentBank = () => {
  if (formData.value.payment_currency == "MMK") {
    payment.value = payment_mm;
    paymentValid.value = true;
  } else if (formData.value.payment_currency == "THB") {
    payment.value = payment_thb;
    paymentValid.value = false;
  } else {
    payment.value = payment_usd;
    paymentValid.value = true;
  }
};

const formData = ref({
  id: "",
  sold_from: "",
  payment_method: "",
  bank_name: "",
  payment_status: "",
  booking_date: "",
  payment_currency: "",
  money_exchange_rate: "",
  due_date: "",
  balance_due_date: "",
  past_user_id: "",
  is_past_info: "",
  past_crm_id: "",
});

const getFunction = () => {
  console.log(formData.value);
  if (enabled.value) {
    formData.value.is_past_info = 1;
  } else {
    formData.value.is_past_info = 0;
  }
  emit("formData", formData.value);
};

onMounted(async () => {
  console.log(props.data, "this is prop data");
  if (props.data) {
    formData.value.id = props.data.id;
    formData.value.balance_due_date = props.data.balance_due_date;
    formData.value.booking_date = props.data.booking_date;
    formData.value.money_exchange_rate = props.data.money_exchange_rate;
    formData.value.payment_currency = props.data.payment_currency;
    formData.value.payment_method = props.data.payment_method;
    formData.value.sold_from = props.data.sold_from;
    formData.value.bank_name = props.data.bank_name;
    if (props.data.is_past_info == 1) {
      enabled.value = true;
      formData.value.past_crm_id = props.data.past_crm_id;
      formData.value.past_user_id = props.data.past_user_id;
    }
  }
  // await adminStore.getSimpleListAction();
});
</script>

<template>
  <div>
    <div class="relative">
      <div
        class="flex justify-start items-center gap-2 py-4 px-4 text-main"
        @click="showInfo"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        Back
      </div>
      <div class="px-4 w-full space-y-2">
        <p class="text-sm text-red text-end">noted # need to fill all data</p>
        <div class="space-y-2">
          <label for="name" class="text-sm text-gray-800">Sale Date</label>
          <input
            type="date"
            v-model="formData.booking_date"
            :disabled="formData.id || disabled"
            id="name"
            class="min-w-[95%] block h-10 text-sm px-4 py-2 text-gray-900 border-main border rounded shadow-sm bg-white focus:outline-none focus:border-gray-300"
          />
        </div>

        <div class="space-y-2">
          <label for="name" class="text-sm text-gray-800"
            >Balance Due Date</label
          >
          <input
            type="date"
            v-model="formData.balance_due_date"
            :disabled="formData.id || disabled"
            id="name"
            class="min-w-[95%] block h-10 text-sm px-4 py-2 text-gray-900 border-main border rounded shadow-sm bg-white focus:outline-none focus:border-gray-300"
          />
        </div>
        <div class="space-y-2">
          <label for="name" class="text-sm text-gray-800">Sold From</label>
          <v-select
            v-model="formData.sold_from"
            class="style-chooser w-full min-h-10 text-sm px-4 text-gray-900 border-main border rounded shadow-sm bg-white focus:outline-none focus:border-gray-300"
            :options="soldFrom"
            label="name"
            :clearable="false"
            :reduce="(d) => d.name"
            placeholder="select sold from"
          ></v-select>
        </div>
        <div class="space-y-2">
          <label for="name" class="text-sm text-gray-800"
            >Payment Currency</label
          >
          <v-select
            v-model="formData.payment_currency"
            class="style-chooser w-full min-h-10 text-sm px-4 text-gray-900 border-main border rounded shadow-sm bg-white focus:outline-none focus:border-gray-300"
            :options="payment_currency"
            @option:selected="choosePaymentBank"
            label="name"
            :clearable="false"
            :reduce="(d) => d.name"
            placeholder="choose payment currency"
          ></v-select>
        </div>
        <div>
          <p class="mb-2 text-sm" v-if="paymentValid">Money Exchange Rate</p>

          <input
            v-model="formData.money_exchange_rate"
            v-if="paymentValid"
            :disabled="formData.id || disabled"
            type="number"
            id="title"
            class="w-full h-10 text-sm px-4 py-2 text-gray-900 border-main border rounded shadow-sm bg-white focus:outline-none focus:border-gray-300"
          />
          <p
            v-if="errors?.money_exchange_rate"
            class="mt-1 text-sm text-red-600"
          >
            {{ errors.money_exchange_rate[0] }}
          </p>
        </div>
        <div class="space-y-2">
          <label for="name" class="text-sm text-gray-800">Bank Name</label>
          <v-select
            v-model="formData.bank_name"
            class="style-chooser w-full min-h-10 text-sm px-4 text-gray-900 border-main border rounded shadow-sm bg-white focus:outline-none focus:border-gray-300"
            :options="payment"
            label="name"
            :clearable="false"
            :reduce="(d) => d.name"
            placeholder="choose bank name"
          ></v-select>
        </div>
        <div class="space-y-2">
          <label for="name" class="text-sm text-gray-800">Payment Method</label>
          <v-select
            v-model="formData.payment_method"
            class="style-chooser w-full min-h-10 text-sm px-4 text-gray-900 border-main border rounded shadow-sm bg-white focus:outline-none focus:border-gray-300"
            :options="paymentArray"
            label="name"
            :clearable="false"
            :reduce="(d) => d.name"
            placeholder="choose payment method"
          ></v-select>
        </div>
        <div class="space-y-2" v-if="authStore.isCashier">
          <label for="name" class="text-sm text-gray-800">Is Past Info</label>
          <div>
            <Switch
              v-model="enabled"
              :class="enabled ? ' bg-main' : 'bg-black'"
              class="relative inline-flex h-[28px] w-[64px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
            >
              <span class="sr-only">Use setting</span>
              <span
                aria-hidden="true"
                :class="enabled ? 'translate-x-9' : 'translate-x-0'"
                class="pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
              />
            </Switch>
          </div>
        </div>
        <div class="spy-2" v-if="enabled">
          <p class="mb-2 text-sm">Past CRM ID</p>

          <input
            v-model="formData.past_crm_id"
            type="text"
            id="title"
            class="w-full h-10 text-sm px-4 py-2 text-gray-900 border-main border rounded shadow-sm bg-white focus:outline-none focus:border-gray-300"
          />
        </div>
        <div class="spy-2" v-if="enabled">
          <p class="mb-2 text-sm">Past User ID</p>

          <v-select
            v-model="formData.past_user_id"
            class="style-chooser w-full min-h-10 text-sm px-4 text-gray-900 border-main border rounded shadow-sm bg-white focus:outline-none focus:border-gray-300"
            :options="admin?.data"
            label="name"
            :clearable="false"
            :reduce="(d) => d.id"
            placeholder="choose customer"
          ></v-select>
        </div>

        <div class="flex justify-end items-center pt-4">
          <div
            class="space-x-4 flex justify-center items-center gap-2 px-4 py-2 rounded border-main bg-main text-white border"
            @click="getFunction"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p class="">Add</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
