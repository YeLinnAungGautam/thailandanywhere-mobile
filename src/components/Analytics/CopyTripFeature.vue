<template>
  <div class="mt-4">
    <!-- <div class="flex justify-between items-center gap-2">
      <v-select
        v-model="supplier_id"
        class="style-chooser w-full min-h-10 text-sm px-4 text-gray-900 border-main border rounded shadow-sm bg-white focus:outline-none focus:border-gray-300"
        :options="suppliers?.data ?? []"
        label="name"
        :clearable="false"
        :reduce="(d) => d.id"
        placeholder="choose supplier"
      ></v-select>
      <div></div>
      <p
        class="text-white bg-main px-3 py-2 whitespace-nowrap text-xs rounded-md"
        :class="dataArray == null ? 'opacity-50' : 'opacity-100'"
        @click="copyTrip"
      >
        copy trips
      </p>
    </div> -->
    <div v-if="!showPreView" class="space-y-3">
      <div
        class="py-4 shadow border border-main px-4 rounded-lg"
        v-for="s in suppliers?.data ?? []"
        :key="s.id"
        @click="showPreViewOpen(s.id)"
      >
        <CopyTripChild :data="s" :date="date" />
      </div>
    </div>
    <div class="pb-8" v-if="showPreView">
      <div class="flex justify-between items-center border-b py-4 border-main">
        <p class="text-sm font-semibold">copy preview</p>
        <div class="flex justify-end items-center gap-2">
          <p
            class="text-white bg-main px-3 py-2 whitespace-nowrap text-xs rounded-md"
            :class="dataArray == null ? 'opacity-50' : 'opacity-100'"
            @click="copyTrip"
          >
            copy trips
          </p>
          <p
            @click="showPreViewClose"
            class="text-white bg-main px-3 py-2 whitespace-nowrap text-xs rounded-md"
          >
            back
          </p>
        </div>
      </div>
      <div class="space-y-2 pt-3 text-xs">
        <p>📆 S. Date: {{ dataArray?.data[0]?.service_date }}</p>
        <p>
          👨‍💼 Supplier Name:
          {{ dataArray?.data[0]?.reservation_car_info?.supplier_name }}
        </p>
        <p>🚙 Total Trip: {{ dataArray?.data?.length }}</p>
        <div
          class="space-y-2 py-2"
          v-for="(d, index) in dataArray?.data"
          :key="d.id"
        >
          <p>{{ getEmoji(index) }}. CRMID: {{ d.crm_id }}</p>
          <p>➖Trip Name: {{ d.product?.name }}</p>
          <p>➖Variation: {{ d.car?.name }}</p>
          <p>
            ➖P. Metod:
            {{ d.is_driver_collect == 1 ? "collect" : d.payment_status }}
          </p>
          <p>➖Amount: {{ d.amount }}thb</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, onMounted, ref, watch } from "vue";
import { useReservationStore } from "../../stores/reservation";
import { useSupplierStore } from "../../stores/supplier";
import { storeToRefs } from "pinia";
import { useToastStore } from "../../stores/toast";
import copy from "copy-to-clipboard";
// import { ChevronRightIcon } from "@heroicons/vue/24/outline";
import CopyTripChild from "./CopyTripChild.vue";

const reservationStore = useReservationStore();
const supplierStore = useSupplierStore();
const toastStore = useToastStore();
const { suppliers } = storeToRefs(supplierStore);

const props = defineProps({
  date: String,
});

const emojis = [
  "1️⃣",
  "2️⃣",
  "3️⃣",
  "4️⃣",
  "5️⃣",
  "6️⃣",
  "7️⃣",
  "8️⃣",
  "9️⃣",
  "🔟",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
];
const getEmoji = (index) => {
  return emojis[index] || "➖"; // Return the emoji or default to "➖"
};

const supplier_id = ref(""); // Assume supplier_id is passed as prop
const showPreView = ref(false);
const dataArray = ref(null);

const getData = async () => {
  dataArray.value = null;
  const res = await reservationStore.getSimpleCopyListAction({
    service_date: props.date,
    supplier_id: supplier_id.value,
    limit: 50,
  });
  console.log("====================================");
  console.log(res.result);
  dataArray.value = res.result;
  console.log("====================================");
};

const showPreViewOpen = (id) => {
  showPreView.value = true;
  supplier_id.value = id;
};

const showPreViewClose = () => {
  showPreView.value = false;
  supplier_id.value = "";
  dataArray.value = null;
};

watch(
  () => supplier_id.value,
  async (newData) => {
    await getData();
  }
);

watch(
  () => props.date,
  async (newData) => {
    await getData();
  }
);

const copyTrip = async () => {
  if (dataArray.value != null) {
    let formattedOutput;

    formattedOutput = `
📆S. Date: ${dataArray.value.data[0]?.service_date}
👨‍💼Supplier Name: ${dataArray.value.data[0]?.reservation_car_info?.supplier_name}
🚙Total Trip: ${dataArray.value.data.length}
    `;

    dataArray.value.data.forEach((trip, index) => {
      formattedOutput += `
${index + 1}️⃣ CRMID: ${trip.crm_id}
➖Trip Name: ${trip.product?.name}
➖Variation: ${trip.car?.name}
➖P. Method: ${trip.is_driver_collect == 1 ? "Collect" : trip.payment_status}
➖Amount: ${trip.amount}thb
`;
    });

    copy(formattedOutput);

    toastStore.showToast({
      icon: "success",
      title: "copy trips is success",
    });
  } else {
    toastStore.showToast({
      icon: "warning",
      title: "copy trips is fail",
    });
  }
};

onMounted(async () => {
  await supplierStore.getSimpleListAction({ limit: 50 });
  console.log("====================================");
  console.log(suppliers.value);
  console.log("====================================");
});
</script>
