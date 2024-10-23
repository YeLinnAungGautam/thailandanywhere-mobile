<script setup>
import ReceiptSelectVue from "./ReceiptSelect.vue";
import { useAuthStore } from "../../stores/auth";
import { useHomeStore } from "../../stores/home";
import { onMounted, ref, watch, computed } from "vue";
import { storeToRefs } from "pinia";

const homeStore = useHomeStore();
const authStore = useAuthStore();

const { user } = storeToRefs(authStore);

const dateFilterRange = ref("");
const changeDate = ref("");
const agent_id = ref("");
const dateRange = ref("");
const filter = ref("All");

const filterAction = (data) => {
  filter.value = data;
};

const date_filter_range = ref("");

const formatDate = (datePut) => {
  const date = new Date(datePut);

  // Get the year, month, and day
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month starts from 0
  const day = String(date.getDate()).padStart(2, "0");

  // Form the formatted date string
  let formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};

const daterange_filter = ref("");

const changeServiceDate = (data) => {
  console.log(data);
  changeDate.value = data;
  if (data == "today") {
    date_filter_range.value = "";
    let startDate = formatDate(new Date());
    // let startDate = "2024-05-28";
    let endDate = formatDate(new Date());
    console.log(`${startDate},${endDate}`);
    dateFilterRange.value = `${startDate},${endDate}`;
    let date_start = formatDate(
      new Date(new Date().getTime() - 90 * 24 * 60 * 60 * 1000)
    );
    let end_start = formatDate(
      new Date(new Date().getTime() + 90 * 24 * 60 * 60 * 1000)
    );
    daterange_filter.value = `${date_start},${end_start}`;
    dateRange.value = "";
  } else if (data == "7day") {
    date_filter_range.value = "";
    let startDate = formatDate(new Date());
    let endDate = formatDate(
      new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
    );
    console.log(`${startDate},${endDate}`);
    let date_start = formatDate(
      new Date(new Date().getTime() - 90 * 24 * 60 * 60 * 1000)
    );
    let end_start = formatDate(
      new Date(new Date().getTime() + 90 * 24 * 60 * 60 * 1000)
    );
    daterange_filter.value = `${date_start},${end_start}`;
    dateFilterRange.value = `${startDate},${endDate}`;
    dateRange.value = "";
  }
};

const result_data = ref(null);
const total_unpaid_amount = ref(0);
const total_booking_count = ref(0);

const unpaidAmount = computed(() => {
  if (filter.value == "All") {
    return total_unpaid_amount.value;
  } else if (filter.value == "Cash") {
    let amount = 0;
    if (user.value.role != "admin") {
      for (let i = 0; i < result_data.value.length; i++) {
        for (let a = 0; a < result_data.value[i]?.booking_infos.length; a++) {
          if (result_data.value[i].booking_infos[a].payment_method == "Cash") {
            amount += result_data.value[i].booking_infos[a].balance_due * 1;
          }
        }
      }
      return amount;
    } else {
      for (let i = 0; i < result_data.value.length; i++) {
        if (user.value.name == result_data.value[i].agent_name) {
          for (let a = 0; a < result_data.value[i]?.booking_infos.length; a++) {
            if (
              result_data.value[i].booking_infos[a].payment_method == "Cash"
            ) {
              amount += result_data.value[i].booking_infos[a].balance_due * 1;
            }
          }
        }
      }
      return amount;
    }
  } else if (filter.value == "Bank Transfer") {
    let amount = 0;
    if (user.value.role != "admin") {
      for (let i = 0; i < result_data.value.length; i++) {
        for (let a = 0; a < result_data.value[i].booking_infos.length; a++) {
          if (
            result_data.value[i].booking_infos[a].payment_method ==
            "Bank Transfer"
          ) {
            amount += result_data.value[i].booking_infos[a].balance_due * 1;
          }
        }
      }
      return amount;
    } else {
      for (let i = 0; i < result_data.value.length; i++) {
        if (user.value.name == result_data.value[i].agent_name) {
          for (let a = 0; a < result_data.value[i].booking_infos.length; a++) {
            if (
              result_data.value[i].booking_infos[a].payment_method ==
              "Bank Transfer"
            ) {
              amount += result_data.value[i].booking_infos[a].balance_due * 1;
            }
          }
        }
      }
      return amount;
    }
  }
});

const unpaidCount = computed(() => {
  if (filter.value == "All") {
    return total_booking_count.value;
  } else if (filter.value == "Cash") {
    let count = 0;
    if (user.value.role != "admin") {
      for (let i = 0; i < result_data.value.length; i++) {
        for (let a = 0; a < result_data.value[i]?.booking_infos.length; a++) {
          if (result_data.value[i].booking_infos[a].payment_method == "Cash") {
            count += 1;
          }
        }
      }
      return count;
    } else {
      for (let i = 0; i < result_data.value.length; i++) {
        if (user.value.name == result_data.value[i].agent_name) {
          for (let a = 0; a < result_data.value[i]?.booking_infos.length; a++) {
            if (
              result_data.value[i].booking_infos[a].payment_method == "Cash"
            ) {
              count += 1;
            }
          }
        }
      }
      return count;
    }
  } else if (filter.value == "Bank Transfer") {
    let count = 0;
    if (user.value.role != "admin") {
      for (let i = 0; i < result_data.value.length; i++) {
        for (let a = 0; a < result_data.value[i].booking_infos.length; a++) {
          if (
            result_data.value[i].booking_infos[a].payment_method ==
            "Bank Transfer"
          ) {
            count += 1;
          }
        }
      }
      return count;
    } else {
      for (let i = 0; i < result_data.value.length; i++) {
        if (user.value.name == result_data.value[i].agent_name) {
          for (let a = 0; a < result_data.value[i].booking_infos.length; a++) {
            if (
              result_data.value[i].booking_infos[a].payment_method ==
              "Bank Transfer"
            ) {
              count += 1;
            }
          }
        }
      }
      return count;
    }
  }
});

const getWithDate = async (date) => {
  console.log(date, "this is date data for function");
  let first;
  let second;
  if (Array.isArray(date) && date.length >= 2) {
    first = dateFormat(date[0]);
    second = dateFormat(date[1]);
  } else if (typeof date == "string" && date.includes(",")) {
    first = date.split(",")[0];
    second = date.split(",")[1];
  }
  // console.log(dateFormat(first), "this is date", dateFormat(second));
  let data = {
    service_daterange: `${first},${second}`,
    daterange: daterange_filter.value,
  };
  console.log(data, "this is data from car booking");
  const res = await homeStore.unpaidAgentSales(data);
  console.log(res.result, "this is response of unpaid");
  result_data.value = res.result;

  total_unpaid_amount.value = 0;
  total_booking_count.value = 0;
  if (user.value.role != "admin") {
    for (let i = 0; i < result_data.value.length; i++) {
      total_unpaid_amount.value += result_data.value[i].total_balance;
      total_booking_count.value += result_data.value[i].total_booking;
    }
  } else {
    for (let i = 0; i < result_data.value.length; i++) {
      if (user.value.name == result_data.value[i].agent_name) {
        total_unpaid_amount.value += result_data.value[i].total_balance;
        total_booking_count.value += result_data.value[i].total_booking;
      }
    }
  }
};

const dateFormat = (inputDateString) => {
  if (inputDateString != null) {
    const inputDate = new Date(inputDateString);

    // Get the year, month, and day components
    const year = inputDate.getFullYear();
    const month = String(inputDate.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-based
    const day = String(inputDate.getDate()).padStart(2, "0");

    // Format the date in "YYYY-MM-DD" format
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  } else {
    return null;
  }
};

watch(dateFilterRange, (newValue) => {
  if (dateFilterRange.value != null) {
    getWithDate(dateFilterRange.value);
  }
});

watch(dateRange, async (newValue) => {
  console.log(dateRange.value, "this is date");
  if (dateRange.value != "" && dateRange.value != null) {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    const startDate = dateRange?.value[0]?.toLocaleDateString("en-GB", options);
    const endDate = dateRange?.value[1]?.toLocaleDateString("en-GB", options);

    // Custom function to format date as dd-MM-yyyy
    const formatDateAsDDMMYYYY = (date) => {
      if (date) {
        const dd = String(date.getDate()).padStart(2, "0");
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const yyyy = date.getFullYear();
        return `${yyyy}-${mm}-${dd}`;
      }
    };

    // Format start and end dates
    const formattedStartDate = formatDateAsDDMMYYYY(dateRange.value[0]);
    const formattedEndDate = formatDateAsDDMMYYYY(dateRange.value[1]);

    dateFilterRange.value = `${formattedStartDate},${formattedEndDate}`;
    changeServiceDate("");
  } else {
    changeServiceDate("today");
  }
});

const getRange = async (date) => {
  console.log(date, "this is error");

  if (date != null) {
    changeServiceDate("");
    console.log(date);

    let first = date[0];
    let second = date[1];
    console.log(dateFormat(first), "this is date", dateFormat(second));
    let data = {
      first: dateFormat(first),
      second: dateFormat(second),
    };
    dateFilterRange.value = `${data.first},${data.second}`;
  } else {
    changeServiceDate("today");
  }
};

watch(date_filter_range, (newValue) => {
  if (date_filter_range.value != "") {
    getRange(newValue);
  }
});

watch(dateRange, async (newValue) => {
  console.log(dateRange.value, "this is date");
  if (dateRange.value != "" && dateRange.value != null) {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    const startDate = dateRange?.value[0]?.toLocaleDateString("en-GB", options);
    const endDate = dateRange?.value[1]?.toLocaleDateString("en-GB", options);

    // Custom function to format date as dd-MM-yyyy
    const formatDateAsDDMMYYYY = (date) => {
      if (date) {
        const dd = String(date.getDate()).padStart(2, "0");
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const yyyy = date.getFullYear();
        return `${yyyy}-${mm}-${dd}`;
      }
    };

    // Format start and end dates
    const formattedStartDate = formatDateAsDDMMYYYY(dateRange.value[0]);
    const formattedEndDate = formatDateAsDDMMYYYY(dateRange.value[1]);

    dateFilterRange.value = `${formattedStartDate},${formattedEndDate}`;
    changeServiceDate("");
  } else {
    changeServiceDate("today");
  }
});

onMounted(async () => {
  await authStore.getMe();
  changeServiceDate("today");
  console.log(user.value, "this is user ");
});
</script>

<template>
  <div class="px-4 space-y-4">
    <div class="bg-main rounded-3xl pt-3 pb-4 pr-3 pl-6 space-y-6">
      <div class="flex flex-col">
        <p class="text-white text-xs">Unpaid Receipts</p>

        <div class="flex w-full text-xs justify-start pt-3 items-center gap-4">
          <p
            @click="changeServiceDate('today')"
            class="flex gap-2 justify-start items-center cursor-pointer"
            :class="changeDate == 'today' ? ' text-white' : 'text-black/50'"
          >
            <span
              class="w-2 h-2 rounded-full bg-white"
              v-if="changeDate == 'today'"
            ></span
            >Today
          </p>

          <p
            @click="changeServiceDate('7day')"
            class="flex gap-2 justify-start items-center cursor-pointer whitespace-nowrap"
            :class="changeDate == '7day' ? ' text-white' : 'text-black/50'"
          >
            <span
              class="w-2 h-2 rounded-full bg-white"
              v-if="changeDate == '7day'"
            ></span
            >Next 7 Days
          </p>
          <VueDatePicker
            v-model="date_filter_range"
            :format="'yyyy-MM-dd'"
            placeholder="search range"
            range
          />
        </div>
      </div>
      <div class="space-y-2">
        <p class="text-white text-5xl font-semibold">-{{ unpaidAmount }}</p>
        <p class="text-white text-xl font-semibold">THB Unpaid</p>
      </div>
      <div class="space-y-2">
        <p class="text-white text-5xl font-semibold">
          {{ unpaidCount }}
        </p>
        <p class="text-white text-xl font-semibold">Bookings are Unpaid</p>
      </div>
    </div>
    <div>
      <ReceiptSelectVue :data="result_data" @filter="filterAction" />
    </div>
  </div>
</template>
