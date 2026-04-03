<script setup>
import { ref, onMounted, watch, computed, defineEmits } from "vue";
import {
  MagnifyingGlassIcon,
  BarsArrowDownIcon,
  ChatBubbleOvalLeftEllipsisIcon,
} from "@heroicons/vue/24/outline";
import { useHotelStore } from "../../stores/hotel";
import { storeToRefs } from "pinia";
import debounce from "lodash/debounce";
import { InformationCircleIcon } from "@heroicons/vue/24/solid";
import Modal from "../../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { useRouter } from "vue-router";
import AddonListOnBooking from "../Addon/AddonListOnBooking.vue";
import { daysBetween } from "../help/DateBetween";

const bottomOfWindow = ref(false);
const hotelStore = useHotelStore();
const router = useRouter();
const { hotels, loading } = storeToRefs(hotelStore);
const destsList = ref([]);
const search = ref("");
const type = ref("direct_booking");
const addItemModal = ref(false);
const addInfoModal = ref(false);
const detailModal = ref(false);
const details = ref(null);
const details_images = ref([]);
const addOnList = ref([]);
const roomRates = ref({});

const changeAddOnList = (message) => {
  console.log(message, "this is message");
  addOnList.value = [];
};

const viewDetail = (data) => {
  console.log(data, "this is data");
  details_images.value = [];
  details.value = data;
  detailModal.value = true;
  if (details.value != null) {
    for (let i = 0; i < details.value.images.length; i++) {
      details_images.value.push(details.value.images[i].image);
    }
  }
  console.log(details_images.value, "this is images");
};

const closeDetail = () => {
  detailModal.value = false;
  details.value = null;
  details_images.value = [];
};

const emit = defineEmits(["formitem"]);

const formitem = ref({
  reservation_id: null,
  product_type: 6,
  product_id: "",
  product_name: "",
  product_image: "",
  item_name: "",
  car_id: "",
  car_list: [],
  room_id: "",
  room: null,
  service_date: "",
  quantity: "1",
  discount: 0,
  days: "",
  duration: "",
  selling_price: "",
  comment: "",
  reservation_status: "",
  payment_method: "",
  payment_status: "",
  amount: "",
  exchange_rate: "",
  cost_price: "",
  special_request: "",
  total_amount: "",
  total_cost_price: "",
  pickup_location: "",
  pickup_time: "",
  is_driver_collect: false,
  dropoff_location: "",
  route_plan: "",
  checkin_date: "",
  room_number: "",
  checkout_date: "",
  customer_attachment: "",
  addons: [],
  passports: [],
});

const allowment = ref(false);

const openAddItemModal = (item) => {
  closeDetail();
  formitem.value.product_id = item.id;
  formitem.value.product_name = item.name;
  formitem.value.product_image = item?.images[0]?.image
    ? item?.images[0]?.image
    : "";
  if (item?.rooms.length > 0) {
    formitem.value.car_list = item?.rooms;
  }
  addItemModal.value = true;
  allowment.value = item.allowment;
  console.log(allowment.value, item, "this is allowment test");
};
const closeItemModal = () => {
  addItemModal.value = false;
  formitem.value.car_id = "";
  formitem.value.car_list = [];
  formitem.value.product_id = "";
  formitem.value.product_name = "";
  formitem.value.product_image = "";
  formitem.value.item_name = "";
  formitem.value.selling_price = "";
};
const selectAction = (item) => {
  formitem.value.car_id = item.id;
  formitem.value.item_name = item.name;
  formitem.value.selling_price = item.room_price;
  formitem.value.cost_price = item.cost ? item.cost : 0;
  console.log(formitem.value, "this is formItem");
  formitem.value.extra_price = item.extra_price;
};
const goInfoModal = () => {
  if (formitem.value.car_id != "") {
    addItemModal.value = false;
    addInfoModal.value = true;
    if (allowment.value && formitem.value.passports.length === 0) {
      formitem.value.passports.push({ name: "", passport: "" });
    }
  }
};

const handleScroll = (event) => {
  const target = event.target;
  const isAtBottom =
    Math.floor(target.scrollTop + target.clientHeight) >=
    target.scrollHeight - 100;
  bottomOfWindow.value = isAtBottom;
};

const changePage = async (url) => {
  console.log(url);
  if (url != null) {
    await hotelStore.getChangePage(url, watchSystem.value);
  }
};

const todayVali = ref(false);
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const isAfterToday = (date) => {
  const today = new Date();
  let selectDate = new Date(date);
  return formatDate(selectDate) >= formatDate(today);
};
const todayCheck = () => {
  console.log(formitem.value.service_date);
  todayVali.value = isAfterToday(formitem.value.service_date);
  console.log(todayVali.value, "this is value");
};

const bookingStep = ref(1);

const canGoNext = computed(() => {
  return (
    formitem.value.service_date !== "" &&
    formitem.value.checkout_date !== "" &&
    formitem.value.days > 0 &&
    todayVali.value &&
    !isOutOfStock.value
  );
});

const clearAction = () => {
  bookingStep.value = 1;
  formitem.value = {
    reservation_id: null,
    product_type: 6,
    product_id: "",
    car_id: "",
    car_list: [],
    room_id: "",
    room: null,
    service_date: "",
    quantity: "1",
    discount: 0,
    days: "",
    duration: "",
    selling_price: "",
    comment: "",
    reservation_status: "",
    payment_method: "",
    payment_status: "",
    amount: "",
    exchange_rate: "",
    cost_price: "",
    special_request: "",
    total_amount: "",
    total_cost_price: "",
    pickup_location: "",
    pickup_time: "",
    is_driver_collect: false,
    dropoff_location: "",
    route_plan: "",
    checkin_date: "",
    room_number: "",
    checkout_date: "",
    customer_attachment: "",
    addons: [],
    passports: [],
  };
  todayVali.value = false;
  addInfoModal.value = false;
  allowment.value = false;
};

const addPassport = () => {
  formitem.value.passports.push({
    name: "",
    passport: "",
  });
};

const removePassport = (index) => {
  formitem.value.passports.splice(index, 1);
};

const getFunction = () => {
  formitem.value.total_amount =
    formitem.value.quantity * formitem.value.selling_price -
    formitem.value.discount;
  formitem.value.total_cost_price =
    formitem.value.quantity * formitem.value.cost_price;
  if (addOnList.value != null) {
    let data = {
      addon_id: "",
      quantity: "",
    };
    for (let i = 0; i < addOnList.value.length; i++) {
      if (addOnList.value[i].select == true) {
        data = {
          addon_id: addOnList.value[i].id,
          quantity: addOnList.value[i].quantity,
        };
        formitem.value.addons.push(data);
        data = {
          addon_id: "",
          quantity: "",
        };
      }
    }
  }
  emit("formData", formitem.value);
  clearAction();
};

const calculateRateRoom = () => {
  if (formitem.value.checkin_date && formitem.value.checkout_date) {
    formitem.value.days = daysBetween(
      formitem.value.checkin_date,
      formitem.value.checkout_date,
    );
  }
};

watch(bottomOfWindow, (newVal) => {
  console.log("bottomOfWindow changed:", newVal);
  if (bottomOfWindow.value == true) {
    let changePageCalled = false;
    if (newVal && !changePageCalled) {
      console.log("This is the bottom of the window");
      if (hotels?.value?.meta?.current_page < hotels?.value?.meta?.last_page) {
        changePageCalled = true;
        changePage(
          hotels?.value?.meta?.links[hotels?.value?.meta?.current_page + 1].url,
        );
      }
    }
  }
});

const backAction = () => {
  addInfoModal.value = false;
  addItemModal.value = true;
};

const hasDuplicatePassportNames = computed(() => {
  if (!allowment.value) return false;
  const names = formitem.value.passports
    .map((p) => p.name.trim().toLowerCase())
    .filter((n) => n !== "");
  return new Set(names).size !== names.length;
});

const priceArray = ref([]);

const getRoomPeriod = async () => {
  if (
    formitem.value.car_id != "" &&
    formitem.value.checkin_date != "" &&
    formitem.value.checkout_date != ""
  ) {
    let data = {
      checkin_date: formitem.value.checkin_date,
      checkout_date: formitem.value.checkout_date,
    };
    const res = await hotelStore.getRoomPrice(data, formitem.value.car_id);
    console.log("====================================");
    console.log(res, "this is room price");
    console.log("====================================");
    priceArray.value = res.data.daily_pricing;
    formitem.value.selling_price = res.data.total_sale_price;
    formitem.value.cost_price = res.data.total_cost_price;
    roomRates.value = res.data.room_rates || {};
  }
};

const selectedRoom = computed(
  () =>
    formitem.value.car_list.find((r) => r.id === formitem.value.car_id) ?? null,
);

const minAvailableStock = computed(() => {
  if (selectedRoom.value?.is_extra == 1) return null;
  if (!roomRates.value || Object.keys(roomRates.value).length === 0)
    return null;
  const values = Object.values(roomRates.value);
  if (values.length === 0) return null;
  return Math.min(...values.map((r) => r.available_rooms));
});

const isOutOfStock = computed(() => {
  if (minAvailableStock.value === null) return false;
  return Number(formitem.value.quantity) > minAvailableStock.value;
});

const watchSystem = computed(() => {
  let result = {};
  if (search.value != null) {
    result.search = search.value;
  }
  result.limit = 20;
  if (type.value != null) {
    if (type.value != "allowment") {
      result.type = type.value;
    } else {
      result.allowment = 1;
    }
  }
  return result;
});

const goToAllowment = (h) => {
  console.log(h, "this is hotel");
  window.open(`/allowment/checker?id=${h.id}`, "_blank");
};

watch(hotels, async (newValue) => {
  if (newValue) {
    destsList.value = [...destsList.value, ...newValue?.data];
    console.log(destsList.value, "this is add new");
  }
});

watch(
  () => [formitem.value.service_date, formitem.value.checkout_date],
  async ([newData, secData]) => {
    if (formitem.value.product_type == "6") {
      formitem.value.checkin_date = formitem.value.service_date;
    }
    calculateRateRoom();
    await getRoomPeriod();
  },
);

watch(
  [search, type],
  debounce(async (newValue) => {
    destsList.value = [];
    await hotelStore.getListAction(watchSystem.value);
  }, 500),
);

watch(
  () => [
    formitem.value.checkin_date,
    formitem.value.checkout_date,
    formitem.value.car_id,
  ],
  ([newData, secData, thirdData]) => {
    if (newData && secData && thirdData) {
      formitem.value.comment = `Room : ${formitem.value.item_name}; Checkin : ${formitem.value.checkin_date} Checkout : ${formitem.value.checkout_date}`;
    }
  },
);

onMounted(async () => {
  window.addEventListener("scroll", handleScroll);
  await hotelStore.getListAction(watchSystem.value);
  formitem.value.product_type = 6;
});
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h1 class="text-sm font-medium">Product hotels</h1>
      <div class="flex justify-end items-center gap-x-2 mr-2">
        <div
          class="border border-gray-200 bg-white flex justify-start items-center gap-x-1 rounded-full p-1"
        >
          <p
            class="text-xs px-2 py-0.5 rounded-xl cursor-pointer"
            @click="type = 'allowment'"
            :class="
              type == 'allowment'
                ? 'bg-[#ff613c] text-white'
                : 'bg-white text-black'
            "
          >
            Instand
          </p>
          <p
            class="text-xs px-2 py-0.5 rounded-xl cursor-pointer"
            @click="type = 'direct_booking'"
            :class="
              type == 'direct_booking'
                ? 'bg-[#ff613c] text-white'
                : 'bg-white text-black'
            "
          >
            Direct
          </p>
          <p
            class="text-xs bg-[#ff613c] px-2 py-0.5 rounded-xl cursor-pointer"
            @click="type = 'other_booking'"
            :class="
              type == 'other_booking'
                ? 'bg-[#ff613c] text-white'
                : 'bg-white text-black'
            "
          >
            Other
          </p>
        </div>
      </div>
    </div>

    <!-- Search -->
    <div
      class="flex justify-start items-center gap-x-2 flex-nowrap relative mr-2"
    >
      <div class="relative w-full">
        <input
          type="text"
          v-model="search"
          class="bg-white w-full px-8 py-2.5 rounded-lg focus:outline-none text-xs"
          placeholder="Search for products here !"
        />
        <MagnifyingGlassIcon
          class="w-4 h-4 absolute text-[#ff613c] top-2.5 left-2"
        />
      </div>
      <div class="bg-[#ff613c] p-2 rounded-full">
        <BarsArrowDownIcon class="w-4 h-4 text-white" />
      </div>
      <div
        class="bg-[#ff613c] py-2 px-4 cursor-pointer text-xs text-white rounded-xl"
      >
        Search
      </div>
    </div>

    <!-- Product Grid -->
    <div
      class="max-h-[60vh] grid grid-cols-2 gap-3 overflow-y-scroll no-sidebar-container"
      @scroll="handleScroll"
    >
      <div
        class="bg-white px-2 pb-2 rounded-lg shadow-sm space-y-2 relative"
        v-for="i in destsList ?? []"
        :key="i"
      >
        <div class="right-1 top-1 rounded-full absolute" @click="viewDetail(i)">
          <InformationCircleIcon class="w-5 h-5 text-[#ff613c] bg-white" />
        </div>
        <div class="flex justify-start items-start gap-x-2 relative">
          <p class="absolute -top-2 -left-2 text-xs" v-if="i?.data_checked">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="green"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
              />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </p>
          <img
            :src="
              i?.images[0]?.image != null
                ? i?.images[0]?.image
                : 'https://placehold.co/400'
            "
            class="w-16 h-16 rounded-lg"
            alt=""
          />
          <div>
            <p class="text-xs font-medium">{{ i?.name }}</p>
            <p class="text-[10px]">{{ i?.type }}</p>
          </div>
        </div>
        <div class="flex justify-between items-center">
          <p class="font-medium">{{ i?.lowest_room_price }} ฿</p>
          <div class="flex justify-end items-center gap-x-2">
            <p
              v-if="i?.allowment"
              class="p-1 bg-blue-500 rounded-xl"
              @click="goToAllowment(i)"
            >
              <ChatBubbleOvalLeftEllipsisIcon class="w-4 h-4 text-white" />
            </p>
            <button
              @click="openAddItemModal(i)"
              class="bg-main text-white px-2 py-2 rounded-full text-[10px]"
            >
              + Add item
            </button>
          </div>
        </div>
      </div>
      <div v-if="loading" class="text-xs p-6 text-center col-span-2">
        <p>loading , please wait ...</p>
      </div>
    </div>

    <!-- ===== BOTTOM SHEET: Choose Room Type ===== -->
    <Teleport to="body">
      <Transition name="sheet">
        <div
          v-if="addItemModal"
          class="fixed inset-0 z-50 flex flex-col justify-end"
          @click.self="addItemModal = false"
        >
          <!-- Backdrop -->
          <div
            class="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            @click="addItemModal = false"
          />
          <!-- Sheet -->
          <div
            class="relative bg-white rounded-t-3xl w-full max-h-[92dvh] flex flex-col shadow-2xl"
          >
            <!-- Drag handle -->
            <div class="flex justify-center pt-3 pb-1 shrink-0">
              <div class="w-10 h-1 rounded-full bg-gray-300" />
            </div>
            <!-- Header -->
            <div class="px-5 pb-3 pt-2 border-b border-gray-100 shrink-0">
              <h3 class="text-base font-semibold text-gray-900">
                Choose Room Type
              </h3>
              <p class="text-xs text-gray-400 mt-0.5">
                Please choose the room type.
              </p>
            </div>
            <!-- Room list -->
            <div class="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
              <p class="text-xs text-gray-400 mt-0.5">
                Please choose the room type.
              </p>
              <div
                v-for="i in formitem.car_list.length > 0
                  ? formitem.car_list
                  : []"
                :key="i"
                @click="selectAction(i)"
                class="rounded-2xl border-2 p-3 transition-all duration-150 active:scale-[0.98]"
                :class="[
                  formitem.car_id == i.id
                    ? 'border-[#ff613c] bg-orange-50'
                    : 'border-gray-100 bg-white',
                  JSON.parse(i.meta)?.is_show_on === '1' ? '' : 'hidden',
                  i.is_extra == '0' ? '' : 'hidden',
                ]"
              >
                <div class="flex gap-3 items-start">
                  <img
                    :src="
                      i?.images[0]?.image
                        ? i?.images[0]?.image
                        : 'https://placehold.co/400'
                    "
                    class="w-[72px] h-[72px] rounded-xl object-cover shrink-0"
                    alt=""
                  />
                  <div class="flex-1 flex justify-between items-start">
                    <div class="space-y-1">
                      <p
                        class="text-sm font-semibold text-[#ff613c] leading-tight"
                      >
                        {{ i.name }}
                      </p>
                      <p class="text-xs text-gray-500">
                        {{ i.max_person }} Pax , {{ i.is_extra }}
                      </p>
                      <span
                        v-if="i?.has_breakfast == 1"
                        class="inline-block text-[10px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full"
                      >
                        🍳 Breakfast included
                      </span>
                    </div>
                    <div class="text-right shrink-0 ml-2">
                      <span class="text-xl font-bold text-gray-800">{{
                        i?.room_price
                      }}</span>
                      <span class="text-[10px] text-gray-400 block"
                        >฿ / night</span
                      >
                    </div>
                  </div>
                </div>
                <!-- Selected check -->
                <div
                  v-if="formitem.car_id == i.id"
                  class="flex items-center gap-1.5 mt-2 pt-2 border-t border-orange-100"
                >
                  <svg
                    class="w-4 h-4 text-[#ff613c]"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span class="text-xs text-[#ff613c] font-medium"
                    >Selected</span
                  >
                </div>
              </div>
              <p class="text-xs text-gray-400 mt-0.5">
                Please choose the room extra.
              </p>
              <div
                v-for="i in formitem.car_list.length > 0
                  ? formitem.car_list
                  : []"
                :key="i"
                @click="selectAction(i)"
                class="rounded-2xl border-2 p-3 transition-all duration-150 active:scale-[0.98]"
                :class="[
                  formitem.car_id == i.id
                    ? 'border-[#ff613c] bg-orange-50'
                    : 'border-gray-100 bg-white',
                  JSON.parse(i.meta)?.is_show_on === '1' ? '' : 'hidden',
                  i.is_extra == '1' ? '' : 'hidden',
                ]"
              >
                <div class="flex gap-3 items-start">
                  <img
                    :src="
                      i?.images[0]?.image
                        ? i?.images[0]?.image
                        : 'https://placehold.co/400'
                    "
                    class="w-[72px] h-[72px] rounded-xl object-cover shrink-0"
                    alt=""
                  />
                  <div class="flex-1 flex justify-between items-start">
                    <div class="space-y-1">
                      <p
                        class="text-sm font-semibold text-[#ff613c] leading-tight"
                      >
                        {{ i.name }}
                      </p>
                      <p class="text-xs text-gray-500">
                        {{ i.max_person }} Pax , {{ i.is_extra }}
                      </p>
                      <span
                        v-if="i?.has_breakfast == 1"
                        class="inline-block text-[10px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full"
                      >
                        🍳 Breakfast included
                      </span>
                    </div>
                    <div class="text-right shrink-0 ml-2">
                      <span class="text-xl font-bold text-gray-800">{{
                        i?.room_price
                      }}</span>
                      <span class="text-[10px] text-gray-400 block"
                        >฿ / night</span
                      >
                    </div>
                  </div>
                </div>
                <!-- Selected check -->
                <div
                  v-if="formitem.car_id == i.id"
                  class="flex items-center gap-1.5 mt-2 pt-2 border-t border-orange-100"
                >
                  <svg
                    class="w-4 h-4 text-[#ff613c]"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span class="text-xs text-[#ff613c] font-medium"
                    >Selected</span
                  >
                </div>
              </div>
            </div>
            <!-- Footer -->
            <div
              class="px-4 py-4 border-t border-gray-100 shrink-0 flex gap-3 bg-white"
            >
              <button
                @click="closeItemModal"
                class="flex-1 py-3 rounded-2xl border border-gray-200 text-sm text-gray-600 font-medium"
              >
                Cancel
              </button>
              <button
                @click="goInfoModal"
                class="flex-1 py-3 rounded-2xl text-sm text-white font-semibold transition-colors"
                :class="
                  formitem.car_id ? 'bg-[#ff613c]' : 'bg-gray-200 text-gray-400'
                "
              >
                Next: Details →
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ===== BOTTOM SHEET: Stay Details & Price (Full Screen) ===== -->
    <Teleport to="body">
      <Transition name="sheet">
        <div
          v-if="addInfoModal"
          class="fixed inset-0 z-50 flex flex-col justify-end"
          @click.self="addInfoModal = false"
        >
          <div
            class="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            @click="addInfoModal = false"
          />
          <div
            class="relative bg-white rounded-t-3xl w-full h-[96dvh] flex flex-col shadow-2xl"
          >
            <!-- Drag handle -->
            <div class="flex justify-center pt-3 pb-1 shrink-0">
              <div class="w-10 h-1 rounded-full bg-gray-300" />
            </div>

            <!-- STEP 1 -->
            <template v-if="bookingStep === 1">
              <!-- Header -->
              <div
                class="px-5 pb-3 pt-2 border-b border-gray-100 shrink-0 flex items-center justify-between"
              >
                <div>
                  <h3 class="text-base font-semibold text-gray-900">
                    Stay Details
                  </h3>
                  <p class="text-xs text-gray-400 mt-0.5">
                    Step 1 of 2 — Fill in dates and rooms
                  </p>
                </div>
                <!-- Step dots -->
                <div class="flex gap-1.5">
                  <div class="w-6 h-1.5 rounded-full bg-[#ff613c]" />
                  <div class="w-2 h-1.5 rounded-full bg-gray-200" />
                </div>
              </div>
              <!-- Content -->
              <div class="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                <!-- Date pickers -->
                <div class="grid grid-cols-2 gap-3">
                  <div class="space-y-1.5">
                    <label
                      class="text-xs font-medium text-gray-500 flex items-center gap-1"
                    >
                      Check-in <span class="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      v-model="formitem.service_date"
                      @change="todayCheck"
                      class="w-full px-3 py-2.5 rounded-xl text-sm font-poppins border-2 focus:outline-none focus:border-[#ff613c] transition-colors"
                      :class="
                        todayVali || !formitem.service_date
                          ? 'border-gray-200'
                          : 'border-red-400 text-red-500'
                      "
                    />
                    <p
                      v-if="!todayVali && formitem.service_date"
                      class="text-[10px] text-red-500"
                    >
                      Must be today or later
                    </p>
                  </div>
                  <div class="space-y-1.5">
                    <label
                      class="text-xs font-medium text-gray-500 flex items-center gap-1"
                    >
                      Check-out <span class="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      v-model="formitem.checkout_date"
                      class="w-full px-3 py-2.5 rounded-xl text-sm font-poppins border-2 border-gray-200 focus:outline-none focus:border-[#ff613c] transition-colors"
                    />
                  </div>
                </div>

                <!-- Nights pill -->
                <div
                  v-if="formitem.days > 0"
                  class="flex items-center gap-3 bg-orange-50 rounded-2xl px-4 py-3"
                >
                  <div
                    class="w-8 h-8 rounded-xl bg-[#ff613c] flex items-center justify-center shrink-0"
                  >
                    <svg
                      class="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        d="M12 3v1m0 16v1M4.22 4.22l.7.7m12.16 12.16.7.7M3 12h1m16 0h1M4.22 19.78l.7-.7M18.36 5.64l.7-.7"
                      />
                      <circle cx="12" cy="12" r="4" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-orange-700">
                      {{ formitem.days }} night{{
                        formitem.days !== 1 ? "s" : ""
                      }}
                    </p>
                    <p
                      v-if="minAvailableStock !== null"
                      class="text-xs text-green-600"
                    >
                      {{ minAvailableStock }} rooms available
                    </p>
                  </div>
                </div>

                <!-- Quantity + summary -->
                <div class="space-y-1.5">
                  <label class="text-xs font-medium text-gray-500"
                    >Total rooms <span class="text-red-500">*</span></label
                  >
                  <div class="flex items-center gap-3">
                    <button
                      @click="
                        formitem.quantity > 1 ? formitem.quantity-- : null
                      "
                      class="w-10 h-10 shrink-0 rounded-xl border-2 border-gray-200 flex items-center justify-center text-lg text-gray-600 font-medium"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      v-model="formitem.quantity"
                      class="flex-1 text-center text-base font-semibold border-2 rounded-xl py-2 focus:outline-none"
                      :class="
                        isOutOfStock
                          ? 'border-red-400 text-red-500'
                          : 'border-gray-200 focus:border-[#ff613c]'
                      "
                    />
                    <button
                      @click="!isOutOfStock ? formitem.quantity++ : null"
                      class="w-10 h-10 shrink-0 rounded-xl border-2 flex items-center justify-center text-lg font-medium transition-opacity"
                      :class="
                        isOutOfStock
                          ? 'border-gray-100 text-gray-300 opacity-40 cursor-not-allowed'
                          : 'border-orange-200 text-[#ff613c]'
                      "
                    >
                      +
                    </button>
                  </div>
                  <div
                    v-if="formitem.days > 0"
                    class="bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100"
                  >
                    <p class="text-xs text-gray-500">
                      {{ formitem.days || "—" }} nights ×
                      {{ formitem.quantity }} rooms
                    </p>
                  </div>
                </div>

                <!-- Out of stock warning -->
                <div
                  v-if="isOutOfStock"
                  class="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 flex items-center gap-2"
                >
                  <svg
                    class="w-4 h-4 text-red-500 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                    />
                  </svg>
                  <p class="text-xs text-red-600 font-medium">
                    Only {{ minAvailableStock }} rooms available for selected
                    dates
                  </p>
                </div>
              </div>
              <!-- Footer -->
              <div
                class="px-4 py-4 border-t border-gray-100 shrink-0 flex gap-3 bg-white"
              >
                <button
                  @click="clearAction"
                  class="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-sm text-gray-600 font-medium"
                >
                  Cancel
                </button>
                <button
                  @click="backAction"
                  class="px-4 py-3 rounded-2xl border-2 border-gray-200 text-sm text-gray-600 font-medium"
                >
                  ← Back
                </button>
                <button
                  @click="bookingStep = 2"
                  :disabled="!canGoNext"
                  class="flex-1 py-3 rounded-2xl text-sm text-white font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  :class="
                    canGoNext ? 'bg-[#ff613c]' : 'bg-gray-200 text-gray-400'
                  "
                >
                  Next
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </template>

            <!-- STEP 2 -->
            <template v-if="bookingStep === 2">
              <!-- Header -->
              <div
                class="px-5 pb-3 pt-2 border-b border-gray-100 shrink-0 flex items-center justify-between"
              >
                <div class="flex items-center gap-3">
                  <button
                    @click="bookingStep = 1"
                    class="w-8 h-8 flex items-center justify-center rounded-xl border-2 border-gray-200"
                  >
                    <svg
                      class="w-4 h-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div>
                    <h3 class="text-base font-semibold text-gray-900">
                      Price & Notes
                    </h3>
                    <p class="text-xs text-gray-400 mt-0.5">Step 2 of 2</p>
                  </div>
                </div>
                <div class="flex gap-1.5">
                  <div class="w-2 h-1.5 rounded-full bg-gray-200" />
                  <div class="w-6 h-1.5 rounded-full bg-[#ff613c]" />
                </div>
              </div>
              <!-- Content -->
              <div class="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                <!-- Recap pill -->
                <div
                  class="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3"
                >
                  <p
                    class="text-[10px] text-gray-400 uppercase tracking-wide mb-1"
                  >
                    Booking summary
                  </p>
                  <p class="text-xs font-semibold text-gray-700">
                    {{ formitem.service_date }} → {{ formitem.checkout_date }}
                    <span class="font-normal text-gray-400">
                      · {{ formitem.days }} nights ·
                      {{ formitem.quantity }} rooms</span
                    >
                  </p>
                </div>

                <!-- Daily breakdown -->
                <div v-if="priceArray.length">
                  <p class="text-xs font-medium text-gray-500 mb-2">
                    Daily rate breakdown
                  </p>
                  <div
                    class="rounded-2xl border border-gray-100 overflow-hidden"
                  >
                    <div
                      class="grid grid-cols-3 text-[10px] px-3 py-2 bg-gray-50 text-gray-400 uppercase tracking-wide"
                    >
                      <span>Date</span><span class="text-right">Sale ฿</span
                      ><span class="text-right">Cost ฿</span>
                    </div>
                    <div
                      v-for="(row, i) in priceArray"
                      :key="i"
                      class="grid grid-cols-3 text-xs px-3 py-2.5 border-t border-gray-50"
                      :class="i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'"
                    >
                      <span class="text-gray-500">{{ row.date }}</span>
                      <span class="text-right text-main font-semibold">{{
                        row.sale_price
                      }}</span>
                      <span class="text-right text-gray-400">{{
                        row.cost_price
                      }}</span>
                    </div>
                  </div>
                </div>

                <!-- Discount + total -->
                <div class="grid grid-cols-2 gap-3">
                  <div class="space-y-1.5">
                    <label class="text-xs font-medium text-gray-500"
                      >Discount (฿)</label
                    >
                    <input
                      type="number"
                      v-model="formitem.discount"
                      class="w-full px-3 py-2.5 rounded-xl text-xs border-2 border-gray-200 focus:outline-none focus:border-[#ff613c] transition-colors"
                    />
                  </div>
                  <div class="space-y-1.5">
                    <label class="text-xs font-medium text-gray-500"
                      >Total price</label
                    >
                    <div
                      class="rounded-xl px-3 h-[42px] flex items-center bg-orange-50 border-2 border-orange-100"
                    >
                      <span class="text-base font-bold text-[#ff613c]">
                        ฿
                        {{
                          (
                            formitem.selling_price * formitem.quantity -
                            formitem.discount
                          ).toLocaleString()
                        }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Special request -->
                <div class="space-y-1.5">
                  <label class="text-xs font-medium text-gray-500"
                    >Special request</label
                  >
                  <textarea
                    v-model="formitem.special_request"
                    rows="2"
                    class="w-full px-3 py-2.5 rounded-xl text-xs border-2 border-gray-200 focus:outline-none focus:border-[#ff613c] transition-colors resize-none"
                    placeholder="e.g. high floor, extra pillow…"
                  ></textarea>
                </div>

                <!-- Comment -->
                <div class="space-y-1.5">
                  <label class="text-xs font-medium text-gray-500"
                    >Description / comment</label
                  >
                  <textarea
                    v-model="formitem.comment"
                    rows="2"
                    class="w-full px-3 py-2.5 rounded-xl text-xs border-2 border-gray-200 focus:outline-none focus:border-[#ff613c] transition-colors resize-none"
                  ></textarea>
                </div>
              </div>
              <!-- Footer -->
              <div
                class="px-4 py-4 border-t border-gray-100 shrink-0 flex gap-3 bg-white"
              >
                <button
                  @click="clearAction"
                  class="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-sm text-gray-600 font-medium"
                >
                  Cancel
                </button>
                <button
                  @click="!isOutOfStock && getFunction()"
                  :disabled="isOutOfStock"
                  class="flex-1 py-3 rounded-2xl text-sm text-white font-semibold transition-colors"
                  :class="
                    isOutOfStock
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-[#ff613c]'
                  "
                >
                  {{
                    isOutOfStock
                      ? `Out of stock (max ${minAvailableStock})`
                      : "Add item ✓"
                  }}
                </button>
              </div>
            </template>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ===== BOTTOM SHEET: Hotel Detail ===== -->
    <Teleport to="body">
      <Transition name="sheet">
        <div
          v-if="detailModal"
          class="fixed inset-0 z-50 flex flex-col justify-end"
          @click.self="closeDetail"
        >
          <div
            class="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            @click="closeDetail"
          />
          <div
            class="relative bg-white rounded-t-3xl w-full h-[96dvh] flex flex-col shadow-2xl"
          >
            <!-- Drag handle -->
            <div class="flex justify-center pt-3 pb-1 shrink-0">
              <div class="w-10 h-1 rounded-full bg-gray-300" />
            </div>
            <!-- Header -->
            <div class="px-5 pb-3 pt-2 border-b border-gray-100 shrink-0">
              <h3 class="text-base font-semibold text-gray-900">
                Hotel Information
              </h3>
              <p class="text-xs text-gray-400 mt-0.5">
                Please notify data issues if you see any incorrect data.
              </p>
            </div>
            <!-- Content -->
            <div class="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              <!-- Images -->
              <div class="grid grid-cols-2 gap-2">
                <div class="col-span-1">
                  <img
                    :src="
                      details_images[0]
                        ? details_images[0]
                        : 'https://placehold.co/400'
                    "
                    alt="Large Image"
                    class="w-full h-[180px] object-cover rounded-2xl"
                  />
                </div>
                <div class="flex flex-col gap-2 h-[180px] overflow-y-scroll">
                  <img
                    v-for="(img, index) in details_images.slice(1)"
                    :key="index"
                    :src="img ? img : 'https://placehold.co/400'"
                    alt="Small Image"
                    class="w-full min-h-[85px] object-cover rounded-xl"
                  />
                </div>
              </div>

              <!-- Info -->
              <div class="space-y-1">
                <p class="text-lg font-bold text-[#ff613c]">
                  {{ details?.name }}
                </p>
                <p class="text-xs text-gray-400">
                  {{ details?.rooms?.length }} room types
                </p>
              </div>

              <!-- Room list -->
              <div class="flex gap-3 overflow-x-scroll no-scrollbar pb-1">
                <div
                  v-for="i in details?.rooms"
                  :key="i"
                  class="min-w-[140px] space-y-1.5 shrink-0"
                >
                  <img
                    :src="
                      i?.images[0]?.image
                        ? i?.images[0]?.image
                        : 'https://placehold.co/400'
                    "
                    alt=""
                    class="w-full h-[90px] object-cover rounded-xl"
                  />
                  <p class="text-xs font-medium line-clamp-2 leading-tight">
                    {{ i?.name }}
                  </p>
                </div>
              </div>

              <!-- Description -->
              <div class="space-y-2">
                <p
                  class="text-sm font-semibold border-l-4 border-[#ff613c] pl-3"
                >
                  Package Summary
                </p>
                <p
                  v-html="details?.full_description"
                  class="text-sm text-gray-600 leading-relaxed"
                ></p>
              </div>
            </div>
            <!-- Footer -->
            <div
              class="px-4 py-4 border-t border-gray-100 shrink-0 flex gap-2 bg-white"
            >
              <button
                @click="closeDetail"
                class="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-sm text-gray-600 font-medium"
              >
                Close
              </button>
              <button
                @click="router.push(`/product/hotel/edit/${details?.id}`)"
                class="flex-1 py-3 rounded-2xl bg-blue-500 text-white text-sm font-semibold"
              >
                Edit
              </button>
              <button
                @click="openAddItemModal(details)"
                class="flex-1 py-3 rounded-2xl bg-[#ff613c] text-white text-sm font-semibold"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* Bottom sheet slide-up transition */
.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.25s ease;
}
.sheet-enter-active .relative,
.sheet-leave-active .relative {
  transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}
.sheet-enter-from {
  opacity: 0;
}
.sheet-enter-from .relative {
  transform: translateY(100%);
}
.sheet-leave-to {
  opacity: 0;
}
.sheet-leave-to .relative {
  transform: translateY(100%);
}

/* Hide scrollbar for room type horizontal scroll */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
