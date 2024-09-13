<script setup>
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
import NavbarVue from "../components/Navbar.vue";
import { useReservationStore } from "../stores/reservation";
import Pagination from "../components/Pagination.vue";
import SaleListItem from "../components/SaleListItem.vue";
import NoDataPage from "../components/NoDataPage.vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import ReservationListItem from "../components/reservationPart/ReservationListItem.vue";
import { useAdminStore } from "../stores/admin";
import { useHotelStore } from "../stores/hotel";
import { useEntranceStore } from "../stores/entrance";
import debounce from "lodash/debounce";

const reservationStore = useReservationStore();
const router = useRouter();
const authStore = useAuthStore();
const adminStore = useAdminStore();
const hotelStore = useHotelStore();
const entranceStore = useEntranceStore();

const { reservations, loading } = storeToRefs(reservationStore);
const { user } = storeToRefs(authStore);
const { admin } = storeToRefs(adminStore);
const { hotel } = storeToRefs(hotelStore);
const { entrance } = storeToRefs(entranceStore);

const chooseType = ref([]);
const showSearchModal = ref(false);

const product_type = [
  { id: "1", name: "Inclusive", type: "App\\Models\\Inclusive" },
  { id: "2", name: "Entrance Ticket", type: "App\\Models\\EntranceTicket" },
  { id: "3", name: "Private Van Tour", type: "App\\Models\\PrivateVanTour" },
  { id: "4", name: "Group Tour", type: "App\\Models\\GroupTour" },
  { id: "5", name: "Airport Pickup", type: "App\\Models\\AirportPickup" },

  { id: "6", name: "ALL", type: "" },
];
const searchId = ref("");
const searchReservation = ref("");
const searchResArray = [
  { id: 1, name: "awaiting" },
  { id: 2, name: "confirmed" },
  { id: 3, name: "declined" },
];
const searchArray = [
  { id: 1, name: "all" },
  { id: 2, name: "current" },
  { id: 3, name: "past" },
];
const bookingStatusArr = [
  { id: 1, name: "awaiting" },
  { id: 2, name: "confirmed" },
  { id: 3, name: "declined" },
];
const expenseStatusArr = [
  { id: "1", name: "fully_paid" },
  { id: "2", name: "not_paid" },
  { id: "3", name: "partially_paid" },
];
const customerPaymentStatusArr = [
  { id: "1", name: "fully_paid" },
  { id: "2", name: "not_paid" },
  { id: "3", name: "partially_paid" },
];
const searchTime = ref("");
const search = ref("");
const searchA = ref("");

const userFilter = ref(null);
const limit = ref(10);
const oldCrmId = ref("");
const bookingStatus = ref("");
const expenseStatus = ref("");
const customerPaymentStatus = ref("");
const hotel_name = ref("");
const attraction_name = ref("");

const showFilter = ref(false);
const clearFilter = () => {
  search.value = "";
  oldCrmId.value = "";
  bookingStatus.value = "";
  expenseStatus.value = "";
  customerPaymentStatus.value = "";
  searchId.value = "";
  hotel_name.value = "";
  limit.value = 10;
  searchA.value = "";
  userFilter.value = "";
  attraction_name.value = "";
  // user_id.value =
  //   authStore.isSuperAdmin || authStore.isReservation ? "" : authStore.user.id;
  searchReservation.value = "";
  searchTime.value = "";
};

const changePage = async (url) => {
  console.log(url);
  await reservationStore.getChangePage(url, watchSystem.value);
};

const createPage = () => {
  router.push({ name: "sales-create" });
};

const searchStatus = computed(() => {
  if (
    search.value != "" ||
    oldCrmId.value != "" ||
    bookingStatus.value != "" ||
    expenseStatus.value != "" ||
    customerPaymentStatus.value != "" ||
    searchId.value != "" ||
    hotel_name.value != "" ||
    limit.value != 10 ||
    searchA.value != "" ||
    userFilter.value != "" ||
    attraction_name.value != "" ||
    searchReservation.value != "" ||
    searchTime.value != ""
  ) {
    return true;
  } else {
    return false;
  }
});

const watchSystem = computed(() => {
  const result = {};

  if (limit.value != "" && limit.value != undefined) {
    result.limit = limit.value;
  }

  if (authStore.isSuperAdmin || authStore.isReservation) {
    result.user_id = "";
  } else {
    result.user_id = authStore.user.id;
  }
  if (search.value != "" && search.value != undefined) {
    result.product_type = search.value;
  }
  if (searchId.value != "" && searchId.value != undefined) {
    result.crm_id = searchId.value;
  }
  if (oldCrmId.value != "" && oldCrmId.value != undefined) {
    result.old_crm_id = oldCrmId.value;
  }
  if (bookingStatus.value != "" && bookingStatus.value != undefined) {
    result.booking_status = bookingStatus.value;
  }
  if (expenseStatus.value != "" && expenseStatus.value != undefined) {
    result.expense_status = expenseStatus.value;
  }
  if (hotel_name.value != "" && hotel_name.value != undefined) {
    result.hotel_name = hotel_name.value;
  }
  if (attraction_name.value != "" && attraction_name.value != undefined) {
    result.attraction_name = attraction_name.value;
  }
  if (
    customerPaymentStatus.value != "" &&
    customerPaymentStatus.value != undefined
  ) {
    result.customer_payment_status = customerPaymentStatus.value;
  }
  if (searchA.value != "" && searchA.value != undefined) {
    result.filter = searchA.value;
  }
  if (searchReservation.value != "" && searchReservation.value != undefined) {
    result.reservation_status = searchReservation.value;
  }
  if (searchTime.value != "" && searchTime.value != undefined) {
    result.service_date = searchTime.value;
  }
  if (userFilter.value != undefined) {
    result.user_id = userFilter.value;
  }

  console.log(result);
  return result;
});

// watch(search, async (newValue) => {
//   await reservationStore.getListAction(watchSystem.value);
// });
watch(
  search,
  debounce(async (newValue) => {
    await reservationStore.getListAction(watchSystem.value);
  }, 500)
);
watch(hotel_name, async (newValue) => {
  await reservationStore.getListAction(watchSystem.value);
});
watch(attraction_name, async (newValue) => {
  await reservationStore.getListAction(watchSystem.value);
});

watch(
  oldCrmId,
  debounce(async (newValue) => {
    await reservationStore.getListAction(watchSystem.value);
  }, 500)
);
watch(bookingStatus, async (newValue) => {
  await reservationStore.getListAction(watchSystem.value);
});
watch(expenseStatus, async (newValue) => {
  await reservationStore.getListAction(watchSystem.value);
});
watch(customerPaymentStatus, async (newValue) => {
  await reservationStore.getListAction(watchSystem.value);
});
watch(limit, async (newValue) => {
  await reservationStore.getListAction(watchSystem.value);
});
// watch(searchId, async (newValue) => {
//   await reservationStore.getListAction(watchSystem.value);
// });
watch(
  searchId,
  debounce(async (newValue) => {
    await reservationStore.getListAction(watchSystem.value);
  }, 500)
);
watch(searchA, async (newValue) => {
  await reservationStore.getListAction(watchSystem.value);
});
watch(userFilter, async (newValue) => {
  await reservationStore.getListAction(watchSystem.value);
});
watch(searchReservation, async (newValue) => {
  await reservationStore.getListAction(watchSystem.value);
});
watch(searchTime, async (newValue) => {
  await reservationStore.getListAction(watchSystem.value);
});

const SearchCrmId = async () => {
  await reservationStore.getListAction(watchSystem.value);
};
const SearchCustomerName = async () => {
  await reservationStore.getListAction(watchSystem.value);
};

const searchValue = (val) => {
  search.value = val;
};

onMounted(async () => {
  await authStore.getMe();
  let data = {
    user_id: authStore.isSuperAdmin ? "" : user.value.id,
  };
  await reservationStore.getListAction(data);
  // await adminStore.getSimpleListAction();
  // await hotelStore.getSimpleListAction();
  // await entranceStore.getSimpleListAction();
  console.log(reservations.value, "this is reservations");
});
</script>

<template>
  <div class="bg-white h-auto">
    <NavbarVue />
    <div class="pb-2 pt-5 px-4 space-y-4">
      <div class="relative">
        <p class="text-main text-2xl font-semibold w-full text-start">
          Reservations List
        </p>
      </div>
      <div class="">
        <div class="flex space-x-2 pb-2 overflow-x-scroll">
          <p
            class="text-xs bg-main rounded-2xl min-w-[100px] py-1.5 px-2 text-center text-white"
            @click="searchValue('')"
            :class="search == '' ? 'bg-[#ff613c] text-white' : ''"
          >
            All
          </p>
          <p
            class="text-xs bg-main rounded-2xl min-w-[100px] py-1.5 px-2 text-center text-white"
            @click="searchValue('App\\Models\\PrivateVanTour')"
            :class="
              search == 'App\\Models\\PrivateVanTour'
                ? 'bg-[#ff613c] text-white'
                : ''
            "
          >
            Van tour
          </p>
          <p
            class="text-xs bg-main rounded-2xl min-w-[100px] py-1.5 px-2 text-center text-white"
            @click="searchValue('App\\Models\\GroupTour')"
            :class="
              search == 'App\\Models\\GroupTour'
                ? 'bg-[#ff613c] text-white'
                : ''
            "
          >
            Group Tour
          </p>
          <p
            class="text-xs bg-main rounded-2xl min-w-[100px] py-1.5 px-2 text-center text-white"
            @click="searchValue('App\\Models\\EntranceTicket')"
            :class="
              search == 'App\\Models\\EntranceTicket'
                ? 'bg-[#ff613c] text-white'
                : ''
            "
          >
            Entrance
          </p>
          <p
            class="text-xs bg-main rounded-2xl min-w-[100px] py-1.5 px-2 text-center text-white"
            @click="searchValue('App\\Models\\AirportPickup')"
            :class="
              search == 'App\\Models\\AirportPickup'
                ? 'bg-[#ff613c] text-white'
                : ''
            "
          >
            Airport
          </p>

          <p
            class="text-xs bg-main rounded-2xl min-w-[100px] py-1.5 px-2 text-center text-white"
            @click="searchValue('App\\Models\\Hotel')"
            :class="
              search == 'App\\Models\\Hotel' ? 'bg-[#ff613c] text-white' : ''
            "
          >
            Hotel
          </p>
          <p
            class="text-xs bg-main rounded-2xl min-w-[100px] py-1.5 px-2 text-center text-white"
            @click="searchValue('App\\Models\\Airline')"
            :class="
              search == 'App\\Models\\Airline' ? 'bg-[#ff613c] text-white' : ''
            "
          >
            Airline
          </p>
        </div>
      </div>
      <div class="rounded-3xl flex justify-between items-center">
        <div class="flex pb-1.5 gap-3">
          <div>
            <input
              v-model="searchId"
              type="text"
              class="bg-transparent rounded-full border border-main max-w-[120px] px-2 text-main py-1 text-sm"
              placeholder="crm id.."
            />
          </div>
          <div>
            <input
              v-model="oldCrmId"
              type="text"
              class="bg-transparent rounded-full border border-main max-w-[120px] px-2 text-main py-1 text-sm"
              placeholder="past crm id"
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
            @click="clearFilter"
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
      <div class="" v-for="(reser, index) in reservations?.data" :key="index">
        <ReservationListItem :id="reser.id" :reservation="reser" />
      </div>
    </div>
    <div
      class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-5 pt-2"
      v-if="!loading && reservations?.data.length == 0"
    >
      <div class="space-y-2 col-span-1 md:col-span-2">
        <NoDataPage />
      </div>
    </div>
    <div class="px-4">
      <Pagination
        v-if="!loading"
        :data="reservations"
        @change-page="changePage"
      />
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
          <p class="text-lg font-semibold text-main">
            Search Reservations List
          </p>
          <p
            @click="showSearchModal = false"
            class="bg-main rounded-full px-2 py-1 text-sm text-white"
          >
            Close
          </p>
        </div>
        <div class="flex justify-start items-center py-1.5 flex-wrap gap-3">
          <div
            class=""
            v-if="authStore.isSuperAdmin || authStore.isReservation"
          >
            <select
              name=""
              id=""
              v-model="userFilter"
              v-if="admin"
              class="bg-transparent rounded-full border border-main max-w-[120px] px-2 text-main py-1.5 text-sm"
            >
              <option
                :value="null"
                disabled
                class="bg-black text-white text-xs"
              >
                Filter By User
              </option>
              <option value="" class="text-xs">All User</option>
              <option
                :value="key.id"
                v-for="(key, index) in admin?.data"
                :key="index"
                class="text-xs"
              >
                {{ key.name }}
              </option>
            </select>
          </div>
          <div class="">
            <v-select
              v-model="searchA"
              class="style-chooser bg-transparent rounded-full border border-main min-w-[120px] text-main text-sm"
              :options="searchArray"
              label="name"
              :clearable="false"
              :reduce="(d) => d.name"
              placeholder="current & past ..."
            ></v-select>
          </div>
          <div class="">
            <v-select
              v-model="searchReservation"
              class="style-chooser bg-transparent rounded-full border border-main min-w-[120px] text-main text-sm"
              :options="searchResArray"
              label="name"
              :clearable="false"
              :reduce="(d) => d.name"
              placeholder="reservation ..."
            ></v-select>
          </div>
          <div class="">
            <v-select
              v-model="bookingStatus"
              class="style-chooser bg-transparent rounded-full border border-main min-w-[120px] text-main text-sm"
              :options="bookingStatusArr"
              label="name"
              :clearable="false"
              :reduce="(d) => d.name"
              placeholder="booking status ..."
            ></v-select>
          </div>
          <div class="">
            <v-select
              v-model="expenseStatus"
              class="style-chooser bg-transparent rounded-full border border-main min-w-[120px] text-main text-sm"
              :options="expenseStatusArr"
              label="name"
              :clearable="false"
              :reduce="(d) => d.name"
              placeholder="expense status ..."
            ></v-select>
          </div>
          <div class="">
            <v-select
              v-model="customerPaymentStatus"
              class="style-chooser bg-transparent rounded-full border border-main min-w-[120px] text-main text-sm"
              :options="customerPaymentStatusArr"
              label="name"
              :clearable="false"
              :reduce="(d) => d.name"
              placeholder="customer payment status ..."
            ></v-select>
          </div>
          <div>
            <input
              v-model="searchTime"
              type="date"
              class="px-2 py-1.5 bg-transparent rounded-full border border-main w-[120px] text-main text-sm"
              placeholder="Search Date"
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
