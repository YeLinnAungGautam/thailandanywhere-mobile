<script setup>
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
import NavbarVue from "../components/Navbar.vue";
import { useBookingStore } from "../stores/booking";
import Pagination from "../components/Pagination.vue";
import SaleListItem from "../components/SaleListItem.vue";
import NoDataPage from "../components/NoDataPage.vue";
import { useRouter } from "vue-router";
import debounce from "lodash/debounce";

const bookingStore = useBookingStore();
const router = useRouter();

const { bookings, loading } = storeToRefs(bookingStore);

const chooseType = ref([]);
const showSearchModal = ref(false);

const changePage = async (url) => {
  console.log(url);
  await bookingStore.getChangePage(url, watchSystem.value);
};

const createPage = () => {
  router.push({ name: "sales-create" });
};

const watchSystem = computed(() => {
  const result = {};
  if (bookingStatus.value != "" && bookingStatus.value != undefined) {
    result.booking_status = bookingStatus.value;
  }
  if (searchP.value != "" && searchP.value != undefined) {
    result.status = searchP.value;
  }
  if (limit.value != "" && limit.value != undefined) {
    result.limit = limit.value;
  }
  if (search.value != "" && search.value != undefined) {
    result.crm_id = search.value;
  }
  if (customerName.value != "" && customerName.value != undefined) {
    result.customer_name = customerName.value;
  }
  if (balanceDueDate.value != "" && balanceDueDate.value != undefined) {
    result.balance_due_date = balanceDueDate.value;
  }
  if (saleDate.value != "" && saleDate.value != undefined) {
    result.sale_date = saleDate.value;
  }
  if (searchA.value != "" && searchA.value != undefined) {
    result.filter = searchA.value;
  }

  console.log(result);
  return result;
});

const bookingStatus = ref("");
const searchP = ref("");
const limit = ref(10);
const search = ref("");
const customerName = ref("");
const balanceDueDate = ref("");
const saleDate = ref("");
const searchA = ref("");

const searchPayment = [
  { id: 1, name: "all", value: "All" },
  { id: 2, name: "not_paid", value: "Not Paid" },
  { id: 3, name: "partially_paid", value: "Partially Paid" },
  { id: 4, name: "fully_paid", value: "Fully Paid" },
];
const bookingStatusArr = [
  { id: 1, name: "awaiting" },
  { id: 2, name: "confirmed" },
  { id: 3, name: "declined" },
];
const searchArray = [
  { id: 1, name: "all" },
  { id: 2, name: "current" },
  { id: 3, name: "past" },
];

const clear = () => {
  searchP.value = "";
  bookingStatus.value = "";
  limit.value = 10;
  search.value = "";
  customerName.value = "";
  balanceDueDate.value = "";
  saleDate.value = "";
  searchA.value = "";
};
const searchStatus = computed(() => {
  if (
    searchP.value != "" ||
    bookingStatus.value != "" ||
    limit.value != 10 ||
    search.value != "" ||
    customerName.value != "" ||
    balanceDueDate.value != "" ||
    saleDate.value != "" ||
    searchA.value != ""
  ) {
    return true;
  } else {
    return false;
  }
});

const changeReload = async (data) => {
  await bookingStore.getListAction(watchSystem.value);
};

onMounted(async () => {
  await bookingStore.getListAction(watchSystem.value);
  console.log(bookings.value);
});

// watch(
//   search,
//   debounce(async (newValue) => {
//     await airlineStore.getListAction({ search: search.value });
//   }, 500)
// );

watch(searchP, async (newValue) => {
  await bookingStore.getListAction(watchSystem.value);
});
watch(bookingStatus, async (newValue) => {
  await bookingStore.getListAction(watchSystem.value);
});
// watch(search, async (newValue) => {
//   await bookingStore.getListAction(watchSystem.value);
// });
const SearchCrmId = async () => {
  await bookingStore.getListAction(watchSystem.value);
};
const SearchCustomerName = async () => {
  await bookingStore.getListAction(watchSystem.value);
};
watch(searchA, async (newValue) => {
  await bookingStore.getListAction(watchSystem.value);
});
// watch(customerName, async (newValue) => {
//   await bookingStore.getListAction(watchSystem.value);
// });
watch(balanceDueDate, async (newValue) => {
  await bookingStore.getListAction(watchSystem.value);
});
watch(saleDate, async (newValue) => {
  await bookingStore.getListAction(watchSystem.value);
});
watch(limit, async (newValue) => {
  await bookingStore.getListAction(watchSystem.value);
});
</script>

<template>
  <div class="bg-white h-auto">
    <NavbarVue />
    <div class="pb-2 pt-5 px-4 space-y-4">
      <div class="relative">
        <div
          class="bg-main text-white p-2 rounded-full absolute top-[-5px] right-0"
          @click="createPage"
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
              d="M12 6v12m6-6H6"
            />
          </svg>
        </div>
        <p class="text-main text-2xl font-semibold w-full text-start">Sales</p>
      </div>
      <div class="rounded-3xl flex justify-between items-center">
        <div class="flex py-1.5 gap-3">
          <div>
            <input
              v-model="search"
              @keyup.enter="SearchCrmId"
              type="text"
              class="bg-transparent rounded-full border border-main max-w-[120px] px-2 text-main py-1 text-sm"
              placeholder="bookings id.."
            />
          </div>
          <div>
            <input
              v-model="customerName"
              @keyup.enter="SearchCustomerName"
              type="text"
              class="bg-transparent rounded-full border border-main max-w-[120px] px-2 text-main py-1 text-sm"
              placeholder="Customer Name"
            />
          </div>
        </div>
        <div class="mr-2 flex justify-end items-center gap-2 flex-wrap">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            @click="showSearchModal = true"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6 text-main"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <img
            @click="clear"
            v-if="searchStatus"
            src="../../public/clear-svgrepo-com (1).svg"
            class="w-6 h-6"
            alt=""
          />
          <!-- <p class="text-main">Search</p> -->
        </div>
        <!-- @option:selected="chooseName()" -->
      </div>
    </div>

    <div
      class="relative flex justify-center items-center py-[50%]"
      v-if="loading"
    >
      <div
        class="absolute animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-main"
      ></div>
      <img src="../../public/logo.jpg" class="rounded-full h-16 w-16" />
    </div>
    <div class="pt-2" v-if="!loading">
      <div class="" v-for="(book, index) in bookings?.data" :key="index">
        <SaleListItem
          :id="book.id"
          :customer_name="book.customer?.name"
          :crm_id="book.crm_id"
          :past_crm_id="book.past_crm_id ? book.past_crm_id : '-'"
          :sub_total="book.sub_total"
          :booking_date="book.booking_date"
          :payment_status="book.payment_status"
          :reservation_status="book.reservation_status"
          :items="book.items"
          @change="changeReload"
        />
      </div>
    </div>
    <div
      class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-5 pt-2"
      v-if="!loading && bookings?.data.length == 0"
    >
      <div class="space-y-2 col-span-1 md:col-span-2">
        <NoDataPage />
      </div>
    </div>
    <div class="px-4">
      <Pagination v-if="!loading" :data="bookings" @change-page="changePage" />
    </div>

    <div
      v-show="showSearchModal"
      class="fixed inset-0 flex items-start h-full justify-center z-50"
    >
      <div
        class="bg-white border-b border-black rounded-b-2xl px-8 pt-8 pb-2 transform animate__animated animate__fadeInDown w-full space-y-2"
        enter-active-class="animate__animated animate__fadeInDown"
        leave-active-class="animate__animated animate__fadeOutUp"
      >
        <div class="flex justify-between items-center">
          <p class="text-lg font-semibold text-main">Search Sales List</p>
          <p
            @click="showSearchModal = false"
            class="bg-main rounded-full px-2 py-1 text-sm text-white"
          >
            Close
          </p>
        </div>
        <div class="flex py-1.5 flex-wrap gap-3">
          <v-select
            class="style-chooser bg-transparent rounded-full border border-main min-w-[100px]"
            :options="searchPayment"
            v-model="searchP"
            label="name"
            :clearable="false"
            :reduce="(d) => d.name"
            placeholder="status"
          ></v-select>
          <v-select
            class="style-chooser bg-transparent rounded-full border border-main min-w-[120px]"
            :options="bookingStatusArr"
            v-model="bookingStatus"
            label="name"
            :clearable="false"
            :reduce="(d) => d.name"
            placeholder="Booking"
          ></v-select>
          <v-select
            v-model="searchA"
            class="style-chooser bg-transparent rounded-full border border-main min-w-[120px]"
            :options="searchArray"
            label="name"
            :clearable="false"
            :reduce="(d) => d.name"
            placeholder="old pass ..."
          ></v-select>
          <div
            class="flex items-center w-full justify-between gap-2 flex-nowrap"
          >
            <p class="text-sm text-main">Service Date</p>
            <input
              v-model="balanceDueDate"
              type="date"
              class="style-chooser bg-transparent bg-white rounded-full border border-main min-w-[120px] px-2 py-1 text-main text-sm"
              placeholder="Search Date"
              title="service_date"
            />
          </div>
          <div
            class="flex items-center w-full justify-between gap-2 flex-nowrap"
          >
            <p class="text-sm text-main">Sale Date</p>
            <input
              v-model="saleDate"
              type="date"
              class="style-chooser bg-transparent bg-white rounded-full border border-main min-w-[120px] px-2 py-1 text-main text-sm"
              placeholder="Search Date"
              title="sale_date"
            />
          </div>

          <div
            class="w-full flex justify-between border-t border-main pt-4 items-center"
          >
            <p class="inline-block mr-2 font-medium text-main">
              Show Limit by One Page
            </p>
            <select
              v-model="limit"
              class="w-16 h-auto border-main bg-white p-2 border rounded-md focus:outline-none focus:ring-0"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="40">40</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
