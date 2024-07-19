<script setup>
import ReservationExpenseVue from "./ReservationExpense.vue";
import { useAuthStore } from "../../stores/auth";
import { onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useReservationStore } from "../../stores/reservation";
import "@vuepic/vue-datepicker/dist/main.css";

const authStore = useAuthStore();
const reservationStore = useReservationStore();

const { user } = storeToRefs(authStore);
// const { reservations } = storeToRefs(reservationStore);

const dateFilterRange = ref("");
const changeDate = ref("");
const agent_id = ref("");
const dateRange = ref("");

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
const date_filter_range = ref("");

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
  } else if (data == "tomorrow") {
    date_filter_range.value = "";
    let tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    let startDate = formatDate(tomorrowDate);
    let endDate = formatDate(tomorrowDate);
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
  } else if (data == "1day") {
    let startDate = formatDate(
      new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000)
    );
    let endDate = formatDate(new Date());
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
  } else if (data == "2day") {
    let startDate = formatDate(
      new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000)
    );
    let endDate = formatDate(new Date());
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
const total_expense_amount = ref(0);
const total_booking_count = ref(0);
const expense_null_list = ref(null);
const loading = ref(false);

const getWithDate = async (date) => {
  loading.value = true;
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
    sale_daterange: `${first},${second}`,
  };

  if (authStore.isSuperAdmin || authStore.isReservation) {
    data.user_id = "";
  } else {
    data.user_id = authStore.user.id;
  }

  const res = await reservationStore.getSimpleListAction(data);
  // console.log(data, "this is data from car booking");
  // const res = await homeStore.unpaidAgentSales(data);
  console.log(res.result.data, "this is response of expense");

  total_expense_amount.value = 0;
  let totalExpenseAmount = res.result.data.reduce((total, item) => {
    return total + item.cost_price * 1;
  }, 0);
  console.log(totalExpenseAmount);
  total_expense_amount.value = totalExpenseAmount;

  expense_null_list.value = null;
  total_booking_count.value = 0;
  let expensesWithNullAmount = res.result.data.filter(
    (item) => item.cost_price == null
  );
  expense_null_list.value = expensesWithNullAmount;
  total_booking_count.value = expensesWithNullAmount.length;

  loading.value = false;
};

watch(dateFilterRange, (newValue) => {
  if (dateFilterRange.value != null) {
    getWithDate(dateFilterRange.value);
  }
});

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

const getRange = async (date) => {
  changeServiceDate("");
  let first = date[0];
  let second = date[1];
  console.log(dateFormat(first), "this is date", dateFormat(second));
  let data = {
    first: dateFormat(first),
    second: dateFormat(second),
  };
  dateFilterRange.value = `${data.first},${data.second}`;
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
        <p class="text-white text-xs">Expense</p>

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
            @click="changeServiceDate('tomorrow')"
            class="flex gap-2 justify-start items-center cursor-pointer"
            :class="changeDate == 'tomorrow' ? ' text-white' : 'text-black/50'"
          >
            <span
              class="w-2 h-2 rounded-full bg-white"
              v-if="changeDate == 'tomorrow'"
            ></span
            >Tomorrow
          </p>
          <VueDatePicker
            v-model="date_filter_range"
            :format="'yyyy-MM-dd'"
            :range="{ autoRange: 3 }"
          />
        </div>
      </div>
      <div class="space-y-2" v-if="!loading">
        <p class="text-white text-5xl font-semibold">
          {{ total_expense_amount }}
        </p>
        <p class="text-white text-xl font-semibold">THB in Expense</p>
      </div>
      <div class="space-y-2" v-if="!loading">
        <p class="text-white text-5xl font-semibold">
          {{ total_booking_count }}
        </p>
        <p class="text-white text-xl font-semibold">Expense Missing</p>
      </div>
      <div class="space-y-2" v-if="loading">
        <p class="text-white text-sm font-semibold">loading please wait ...</p>
      </div>
    </div>
    <div v-if="!loading">
      <ReservationExpenseVue
        :data="expense_null_list"
        :date="dateFilterRange"
      />
    </div>
  </div>
</template>
