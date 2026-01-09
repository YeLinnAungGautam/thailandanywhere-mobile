<template>
  <div class="py-4">
    <div class="flex justify-between items-center">
      <h1
        class="sticky top-0 bg-white z-10 py-1 text-xs font-medium text-[#ff613c]"
      >
        Payment Detail
      </h1>
    </div>
    <div class="grid grid-cols-2 gap-2">
      <div class="space-y-2">
        <label for="name" class="text-gray-800 text-[10px]">CRM ID</label>
        <div
          class="w-full text-xs px-4 text-gray-900 border-main border rounded-lg shadow-sm bg-gray-200 focus:outline-none focus:border-gray-200 py-1.5"
        >
          {{ formData?.crm_id ? formData?.crm_id : "-" }}
        </div>
      </div>
      <div class="space-y-2">
        <label for="name" class="text-gray-800 text-[10px]"
          >Sales Date <span class="text-red-800">*</span></label
        >
        <input
          type="date"
          v-model="formData.booking_date"
          :disabled="formData.id || disabled"
          id="name"
          class="w-full text-xs px-4 py-1 text-gray-900 border-main border rounded-lg shadow-sm bg-white focus:outline-none focus:border-gray-200"
        />
      </div>
      <div class="space-y-2">
        <label for="name" class="text-gray-800 text-[10px]"
          >Payment Method <span class="text-red-800">*</span></label
        >
        <v-select
          v-model="formData.payment_method"
          class="style-chooser text-xs"
          :options="paymentArray"
          label="name"
          :clearable="false"
          :reduce="(d) => d.name"
          placeholder=""
        ></v-select>
      </div>
      <div class="space-y-2">
        <label for="name" class="text-gray-800 text-[10px]"
          >Payment Currency <span class="text-red-800">*</span></label
        >
        <v-select
          :style="{ fontSize: '11px !important' }"
          v-model="formData.payment_currency"
          class="style-chooser text-xs"
          :options="payment_currency"
          @option:selected="choosePaymentBank"
          label="name"
          :clearable="false"
          :reduce="(d) => d.name"
          placeholder=""
        ></v-select>
      </div>
      <div class="space-y-2">
        <label for="name" class="text-gray-800 text-[10px]"
          >Bank name <span class="text-red-800">*</span></label
        >
        <v-select
          v-model="formData.bank_name"
          class="style-chooser text-xs"
          :options="payment"
          label="name"
          :clearable="false"
          :reduce="(d) => d.name"
          placeholder=""
        ></v-select>
      </div>
      <div class="space-y-2">
        <label for="name" class="text-gray-800 text-[10px]"
          >Exchange Rate <span class="text-red-800">*</span></label
        >
        <input
          v-model="formData.money_exchange_rate"
          :disabled="!paymentValid || disabled"
          type="number"
          id="title"
          class="text-xs px-4 py-1.5 w-full text-gray-900 border-main border rounded-lg shadow-sm focus:outline-none focus:border-gray-200"
          :class="!paymentValid ? 'bg-gray-200' : 'bg-white'"
        />
      </div>

      <!-- <div class="space-y-2">
        <label for="name" class="text-gray-800 text-[10px]">Sold From</label>
        <v-select
          :style="{ fontSize: '11px !important' }"
          v-model="formData.sold_from"
          class="style-chooser text-xs"
          :options="soldFrom"
          label="name"
          :clearable="false"
          :reduce="(d) => d.name"
          placeholder=""
        ></v-select>
      </div> -->
      <div class="space-y-2">
        <label for="name" class="text-gray-800 text-[10px]"
          >Is Inclusive ?</label
        >
        <div>
          <Switch
            v-model="enabled"
            :class="enabled ? ' bg-[#ff613c]/50' : 'bg-gray-200'"
            class="relative inline-flex h-[22px] w-[50px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
          >
            <span class="sr-only">Use setting</span>
            <span
              aria-hidden="true"
              :class="enabled ? 'translate-x-7' : 'translate-x-0'"
              class="pointer-events-none inline-block h-[18px] w-[18px] transform rounded-full bg-[#ff613c] shadow-lg ring-0 transition duration-200 ease-in-out"
            />
          </Switch>
        </div>
      </div>
      <div class="space-y-2">
        <label for="name" class="text-gray-800 text-[10px]"
          >Balance Due Date <span class="text-red-800">*</span></label
        >
        <input
          type="date"
          v-model="formData.balance_due_date"
          :disabled="formData.id || disabled"
          id="name"
          class="w-full text-xs px-4 py-1 text-gray-900 border-main border rounded-lg shadow-sm bg-white focus:outline-none focus:border-gray-200"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, onMounted, ref, watch, computed } from "vue";
import { Switch } from "@headlessui/vue";

const enabled = ref(false);

import { defineEmits } from "vue";

const emit = defineEmits();

const changeGetInclusiveForm = () => {
  formData.value.is_inclusive = enabled.value ? 1 : 0;

  emit("formData", formData.value);
};

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

const payment_currency = [
  { id: "1", name: "MMK" },
  { id: "2", name: "USD" },
  { id: "3", name: "THB" },
];

const paymentArray = [
  // Bank Transfer, International Remittance, Cash, etc
  { id: "1", name: "Bank Transfer" },
  { id: "2", name: "International Remittance" },
  { id: "3", name: "Cash" },
  { id: "4", name: "Other ..." },
];

const payment = ref([]);
const paymentValid = computed(() => {
  if (formData.value.payment_currency == "MMK") {
    payment.value = payment_mm;
    return true;
  } else if (formData.value.payment_currency == "THB") {
    payment.value = payment_thb;
    return false;
  } else {
    payment.value = payment_usd;
    return true;
  }
});
const choosePaymentBank = () => {
  if (formData.value.payment_currency == "MMK") {
    payment.value = payment_mm;
  } else if (formData.value.payment_currency == "THB") {
    payment.value = payment_thb;
  } else {
    payment.value = payment_usd;
  }
};

const formData = ref({
  id: "",
  crm_id: "",
  balance_due_date: "",
  booking_date: "",
  money_exchange_rate: "",
  payment_currency: "",
  payment_method: "",
  // sold_from: "",
  bank_name: "",
  is_inclusive: "",
});

const props = defineProps({
  data: Object,
});

watch(
  () => [
    formData.value.balance_due_date,
    formData.value.booking_date,
    formData.value.money_exchange_rate,
    formData.value.payment_currency,
    formData.value.payment_method,
    // formData.value.sold_from,
    formData.value.bank_name,
    enabled.value,
  ],
  (newVal) => {
    changeGetInclusiveForm();
  }
);

onMounted(() => {
  if (props.data) {
    formData.value.id = props.data.id;
    formData.value.crm_id = props.data?.crm_id ? props.data?.crm_id : "";
    formData.value.balance_due_date = props.data.balance_due_date;
    formData.value.booking_date = props.data.booking_date;
    formData.value.money_exchange_rate = props.data.money_exchange_rate;
    formData.value.payment_currency = props.data.payment_currency;
    formData.value.payment_method = props.data.payment_method;
    // formData.value.sold_from = props.data.sold_from;
    formData.value.bank_name = props.data.bank_name;
    // formData.value.is_inclusive = props.data.is_inclusive;
    if (props?.data?.is_inclusive == 1) {
      enabled.value = true;
    } else {
      enabled.value = false;
    }
  }
});
</script>
