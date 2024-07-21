<script setup>
import ReservationExpenseVue from "./ReservationExpense.vue";
import { useAuthStore } from "../../stores/auth";
import { onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useReservationStore } from "../../stores/reservation";
import "@vuepic/vue-datepicker/dist/main.css";
import TripChild from "./TripChild.vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const reservationStore = useReservationStore();

const { user } = storeToRefs(authStore);
// const { reservations } = storeToRefs(reservationStore);

const dateFilterRange = ref("");
const changeDate = ref("");
const agent_id = ref("");
const date = ref("");
const dateRange = ref("");
const result_data = ref(null);
const result_data_length = ref(0);
const missing_data = ref(null);
const group_data = ref([]);
const show_list = ref(false);
const toggleMissing = ref(false);
const add_child_data = ref(null);
const all_group_data = ref(null);
const loading = ref(false);
const title = ref("");

const show_list_function = (data) => {
  show_list.value = true;
  console.log("====================================");
  console.log(data);
  console.log("====================================");
  add_child_data.value = data.data;
  title.value = data.product_type;
};

const toggleMissing_function = (data) => {
  if (data == "all") {
    toggleMissing.value = false;
    show_list.value = false;
  } else if (data == "missing") {
    toggleMissing.value = true;
    show_list.value = false;
  }
};

const show_list_remove_function = () => {
  show_list.value = false;
  add_child_data.value = null;
  title.value = "";
};

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
    let startDate = formatDate(new Date());
    // let startDate = "2024-05-28";

    date.value = `${startDate}`;
  }
};

const getWithDate = async (date) => {
  loading.value = true;
  router.push({
    name: "analytics",
    params: {
      page: 2,
    },
    query: {
      search_date: date,
    },
  });
  group_data.value = [];
  // console.log(dateFormat(first), "this is date", dateFormat(second));
  let data = {
    service_date: `${date}`,
  };

  if (authStore.isSuperAdmin || authStore.isReservation) {
    data.user_id = "";
  } else {
    data.user_id = authStore.user.id;
  }

  const res = await reservationStore.getSimpleListAction(data);

  console.log(res.result.data, "this is response of expense for trip");

  result_data_length.value = res.result.data.length;
  result_data.value = res.result.data;

  // Grouping the filtered result by product_type and including product_type name
  const groupedDataAll = result_data.value.reduce((acc, item) => {
    // If the product_type key doesn't exist in the accumulator, create it
    if (!acc[item.product_type]) {
      acc[item.product_type] = {
        product_type: item.product_type,
        data: [],
      };
    }
    // Push the current item into the appropriate group
    acc[item.product_type].data.push(item);
    return acc;
  }, {});

  all_group_data.value = Object.keys(groupedDataAll).map(
    (key) => groupedDataAll[key]
  );

  // Converting the grouped object into an array of objects
  // group_data.value = Object.keys(groupedDataA).map((key) => groupedDataA[key]);

  console.log(group_data.value, "this is grouped data by product_type");

  // Filter the data to exclude items with cost_price null and paid_slip array length 0
  const filteredData = res.result.data.filter(
    (item) => item.cost_price == null || item.paid_slip.length > 0
  );

  missing_data.value = filteredData.length;

  // Grouping the filtered result by product_type and including product_type name
  const groupedDataA = filteredData.reduce((acc, item) => {
    // If the product_type key doesn't exist in the accumulator, create it
    if (!acc[item.product_type]) {
      acc[item.product_type] = {
        product_type: item.product_type,
        data: [],
      };
    }
    // Push the current item into the appropriate group
    acc[item.product_type].data.push(item);
    return acc;
  }, {});

  // Converting the grouped object into an array of objects
  group_data.value = Object.keys(groupedDataA).map((key) => groupedDataA[key]);

  console.log(group_data.value, "this is grouped data by product_type");
  show_list_remove_function();
  loading.value = false;
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

onMounted(async () => {
  await authStore.getMe();

  if (!route.query.search_date) {
    console.log("====================================");
    console.log(route.query.search_date);
    console.log("====================================");
    changeServiceDate("today");
  } else {
    console.log(route.query.search_date);
    getWithDate(route.query.search_date);
  }
  console.log(user.value, "this is user ");
});

watch(date, (newValue) => {
  console.log(date.value);
  if (date.value != null) {
    getWithDate(date.value);
  }
});
</script>

<template>
  <div class="px-4 space-y-4">
    <div class="bg-main rounded-3xl pt-3 pb-4 pr-3 pl-6 space-y-6">
      <div class="flex justify-between items-center">
        <p class="text-white text-xs">Ongoing Bookings Today</p>

        <div class="text-black px-6 py-2 bg-white rounded-full text-xs">
          <input
            type="date"
            name=""
            id=""
            class="border-0 focus:outline-none"
            v-model="date"
          />
        </div>
      </div>
      <div class="space-y-2">
        <p class="text-white text-5xl font-semibold flex justify-start gap-3">
          {{ result_data_length
          }}<svg
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
              d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
            />
          </svg>
        </p>
        <p class="text-white text-xl font-semibold">Total Trips Today</p>
      </div>
      <div class="space-y-2">
        <p class="text-white text-5xl font-semibold flex justify-start gap-3">
          {{ missing_data
          }}<svg
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
              d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
            />
          </svg>
        </p>
        <p class="text-white text-xl font-semibold">Total Missing Data</p>
      </div>
    </div>
    <div class="">
      <div class="pt-5 space-y-4 pb-5">
        <div
          class="text-main text-lg flex justify-between items-center font-semibold pb-3"
        >
          <p class="text-base font-semibold">
            Bookings {{ route.query.search_date }}
          </p>
          <div class="flex justify-end items-center gap-2" v-if="!show_list">
            <p
              class="text-sm font-medium bg-black/10 px-4 py-1 rounded-2xl"
              @click="toggleMissing_function('all')"
              :class="!toggleMissing ? 'bg-main text-white ' : 'bg-black/10'"
            >
              all
            </p>
            <p
              class="text-sm font-medium bg-black/10 px-4 py-1 rounded-2xl"
              @click="toggleMissing_function('missing')"
              :class="toggleMissing ? 'bg-main text-white ' : 'bg-black/10'"
            >
              missing
            </p>
          </div>
          <div class="flex justify-end items-center gap-2" v-if="show_list">
            <p
              class="text-sm font-medium bg-black/10 px-4 py-1 rounded-2xl"
              v-if="show_list && title"
            >
              {{ title?.split("\\")[2] }}
            </p>
            <p
              class="text-sm font-medium bg-black/10 px-4 py-1 rounded-2xl"
              v-if="show_list"
              @click="show_list_remove_function"
            >
              back
            </p>
          </div>
        </div>
        <div v-if="loading">
          <p class="text-sm font-medium text-center">Loading please wait ...</p>
        </div>
        <div class=" " v-if="!loading">
          <div class="space-y-2" v-if="!show_list">
            <div v-if="toggleMissing" class="space-y-2">
              <div
                class="text-main text-base px-6 flex justify-between items-center border-main border py-4 mx-2 rounded-3xl"
                v-for="z in group_data"
                :key="z"
                @click="show_list_function(z)"
              >
                <p class="text-sm font-semibold">
                  {{ z.product_type.split("\\")[2] }}
                </p>
                <div class="flex justify-end items-center gap-2">
                  <p class="font-semibold text-lg">{{ z.data.length }}</p>
                  <p>
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
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </p>
                </div>
              </div>
            </div>
            <div v-if="!toggleMissing" class="space-y-2">
              <div
                class="text-main text-base px-6 flex justify-between items-center border-main border py-4 mx-2 rounded-3xl"
                v-for="z in all_group_data"
                :key="z"
                @click="show_list_function(z)"
              >
                <p class="text-sm font-semibold">
                  {{ z.product_type.split("\\")[2] }}
                </p>
                <div class="flex justify-end items-center gap-2">
                  <p class="font-semibold text-lg">{{ z.data.length }}</p>
                  <p>
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
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div v-if="show_list">
            <TripChild :data="add_child_data" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
