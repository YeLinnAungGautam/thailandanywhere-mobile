<script setup>
import { ref, onMounted, watch, computed, defineEmits } from "vue";
import {
  MagnifyingGlassIcon,
  BarsArrowDownIcon,
} from "@heroicons/vue/24/outline";
import { useEntranceStore } from "../../stores/entrance";
import { storeToRefs } from "pinia";
import debounce from "lodash/debounce";
import { InformationCircleIcon } from "@heroicons/vue/24/solid";
import Modal from "../../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { useRouter } from "vue-router";
import AddonListOnBooking from "../Addon/AddonListOnBooking.vue";

const bottomOfWindow = ref(false);
const addOnList = ref([]);
const entranceStore = useEntranceStore();
const { entrances, loading } = storeToRefs(entranceStore);
const destsList = ref([]);
const search = ref("");
const router = useRouter();
const addItemModal = ref(false);
const addInfoModal = ref(false);
const detailModal = ref(false);
const details = ref(null);
const details_images = ref([]);

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
    details_images.value.push(details.value.cover_image);
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

const emit = defineEmits(["formData"]);

const formitem = ref({
  reservation_id: null,
  product_type: 4,
  product_id: "",
  product_name: "",
  product_image: "",
  item_name: "",
  car_id: "",
  car_list: [],
  child_info: [],
  individual_pricing: {
    adult: {
      quantity: 0,
      selling_price: 0,
      cost_price: 0,
      total_cost_price: 0,
      amount: 0,
    },
    child: {
      quantity: 0,
      selling_price: 0,
      cost_price: 0,
      total_cost_price: 0,
      amount: 0,
    },
  },
  room_id: "",
  room: null,
  service_date: "",
  quantity: 0,
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
});

const openAddItemModal = (item) => {
  closeDetail();
  formitem.value.product_id = item.id;
  formitem.value.product_name = item.name;
  formitem.value.product_image = item.cover_image;
  if (item?.variations.length > 0) {
    formitem.value.car_list = item?.variations;
  }
  addItemModal.value = true;
  console.log("====================================");
  console.log(formitem.value.car_list, "this is item");
  console.log("====================================");
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
  formitem.value.selling_price = item.price;
  formitem.value.child_info = item.child_info
    ? JSON.parse(item.child_info)
    : [];
  formitem.value.cost_price = item.cost_price ? item.cost_price : 0;
  formitem.value.comment = `Variation : ${formitem.value.item_name}`;
  console.log(formitem.value, "this is formItem", item);
};
const goInfoModal = () => {
  if (formitem.value.car_id != "") {
    addItemModal.value = false;
    addInfoModal.value = true;
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
    await entranceStore.getChangePage(url, watchSystem.value);
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

const clearAction = () => {
  formitem.value = {
    reservation_id: null,
    product_type: 4,
    product_id: "",
    product_image: "",
    product_name: "",
    car_id: "",
    car_list: [],
    child_info: [],
    room_id: "",
    room: null,
    service_date: "",
    individual_pricing: {
      adult: {
        quantity: 0,
        selling_price: 0,
        cost_price: 0,
        total_cost_price: 0,
        amount: 0,
      },
      child: {
        quantity: 0,
        selling_price: 0,
        cost_price: 0,
        total_cost_price: 0,
        amount: 0,
      },
    },
    quantity: 0,
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
  };
  todayVali.value = false;
  addInfoModal.value = false;
};

const getFunction = () => {
  formitem.value.total_amount =
    formitem.value.selling_price * formitem.value.quantity -
    formitem.value.discount +
    (formitem.value.individual_pricing?.child?.amount || 0);
  formitem.value.total_cost_price =
    formitem.value.quantity * formitem.value.cost_price +
    (formitem.value.individual_pricing?.child?.total_cost_price || 0);
  if (addOnList.value != null) {
    let data = { addon_id: "", quantity: "" };
    for (let i = 0; i < addOnList.value.length; i++) {
      if (addOnList.value[i].select == true) {
        data = {
          addon_id: addOnList.value[i].id,
          quantity: addOnList.value[i].quantity,
        };
        formitem.value.addons.push(data);
        data = { addon_id: "", quantity: "" };
      }
    }
  }
  emit("formData", formitem.value);
  clearAction();
};

const backAction = () => {
  addInfoModal.value = false;
  addItemModal.value = true;
};

watch(bottomOfWindow, (newVal) => {
  console.log("bottomOfWindow changed:", newVal);
  if (bottomOfWindow.value == true) {
    let changePageCalled = false;
    if (newVal && !changePageCalled) {
      console.log("This is the bottom of the window");
      if (
        entrances?.value?.meta?.current_page < entrances?.value?.meta?.last_page
      ) {
        changePageCalled = true;
        changePage(
          entrances?.value?.meta?.links[
            entrances?.value?.meta?.current_page + 1
          ].url,
        );
      }
    }
  }
});

const watchSystem = computed(() => {
  let result = {};
  if (search.value != null) result.search = search.value;
  result.limit = 20;
  return result;
});

watch(entrances, async (newValue) => {
  if (newValue) {
    destsList.value = [...destsList.value, ...newValue?.data];
  }
});

watch(
  () => formitem.value.quantity,
  (newValue) => {
    const costPrice = parseFloat(formitem.value.cost_price) || 0;
    const sellingPrice = parseFloat(formitem.value.selling_price) || 0;
    formitem.value.individual_pricing.adult = {
      quantity: newValue * 1,
      selling_price: sellingPrice,
      cost_price: costPrice,
      total_cost_price: newValue * 1 * costPrice,
      amount: newValue * 1 * sellingPrice,
    };
    console.log("====================================");
    console.log("Updated Adult Pricing:", formitem.value.individual_pricing);
    console.log("====================================");
  },
  { immediate: true },
);

watch(
  () => formitem.value.individual_pricing?.child?.quantity,
  (newValue) => {
    const costPrice =
      formitem.value.child_info.length > 0
        ? parseFloat(formitem.value.child_info[0]?.child_cost_price)
        : 0;
    const sellingPrice =
      formitem.value.child_info.length > 0
        ? parseFloat(formitem.value.child_info[0]?.child_price)
        : 0;
    formitem.value.individual_pricing.child = {
      quantity: newValue * 1,
      selling_price: sellingPrice,
      cost_price: costPrice,
      total_cost_price: newValue * 1 * costPrice,
      amount: newValue * 1 * sellingPrice,
    };
    console.log("====================================");
    console.log("Updated Child Pricing:", formitem.value.individual_pricing);
    console.log("====================================");
  },
  { immediate: true },
);

watch(
  () => [
    formitem.value.quantity,
    formitem.value.individual_pricing?.child?.quantity,
  ],
  ([newData, secData]) => {
    if (newData || secData) {
      formitem.value.comment = `Variation : ${formitem.value.item_name}. Adult : ${formitem.value.quantity}, Child : ${formitem.value.individual_pricing?.child?.quantity}`;
    }
  },
);

watch(
  [search],
  debounce(async (newValue) => {
    destsList.value = [];
    await entranceStore.getListAction(watchSystem.value);
  }, 500),
);

onMounted(async () => {
  window.addEventListener("scroll", handleScroll);
  await entranceStore.getListAction(watchSystem.value);
  formitem.value.product_type = 4;
});
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h1 class="text-sm font-medium">Product Attractions</h1>
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
        <div class="flex justify-start items-start gap-x-2">
          <img
            :src="
              i?.cover_image != null
                ? i?.cover_image
                : 'https://placehold.co/400'
            "
            class="w-16 h-16 rounded-lg"
            alt=""
          />
          <div>
            <p class="text-xs font-medium line-clamp-3">{{ i?.name }}</p>
          </div>
        </div>
        <div class="flex justify-between items-center">
          <p class="font-medium">{{ i?.lowest_variation_price }} ฿</p>
          <button
            @click="openAddItemModal(i)"
            class="bg-main text-white px-2 py-2 rounded-full text-[10px]"
          >
            + Add item
          </button>
        </div>
      </div>
      <div v-if="loading" class="text-xs p-6 text-center col-span-2">
        <p>loading , please wait ...</p>
      </div>
    </div>

    <!-- ===== BOTTOM SHEET: Choose Variation ===== -->
    <Teleport to="body">
      <Transition name="sheet">
        <div
          v-if="addItemModal"
          class="fixed inset-0 z-50 flex flex-col justify-end"
          @click.self="addItemModal = false"
        >
          <div
            class="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            @click="addItemModal = false"
          />
          <div
            class="relative bg-white rounded-t-3xl w-full max-h-[92dvh] flex flex-col shadow-2xl"
          >
            <div class="flex justify-center pt-3 pb-1 shrink-0">
              <div class="w-10 h-1 rounded-full bg-gray-300" />
            </div>
            <div class="px-5 pb-3 pt-2 border-b border-gray-100 shrink-0">
              <h3 class="text-base font-semibold text-gray-900">
                Choose Variation
              </h3>
              <p class="text-xs text-gray-400 mt-0.5">
                Please choose variation type.
              </p>
              <!-- <div
                class="relative w-full border-2 border-gray-200 rounded-xl mt-2"
              >
                <input
                  type="text"
                  v-model="search"
                  class="bg-white w-full px-8 py-2.5 rounded-xl focus:outline-none text-xs"
                  placeholder="Search variation..."
                />
                <MagnifyingGlassIcon
                  class="w-4 h-4 absolute text-[#ff613c] top-2.5 left-2"
                />
              </div> -->
            </div>
            <div class="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
              <div
                v-for="i in formitem.car_list.length > 0
                  ? formitem.car_list
                  : []"
                :key="i"
                @click="selectAction(i)"
                class="rounded-2xl border-2 p-3 transition-all duration-150 active:scale-[0.98]"
                :class="
                  formitem.car_id == i.id
                    ? 'border-[#ff613c] bg-orange-50'
                    : 'border-gray-100 bg-white'
                "
              >
                <div class="flex gap-3 items-start">
                  <img
                    :src="
                      i?.image_links[0]?.image
                        ? i?.image_links[0]?.image
                        : 'https://placehold.co/400'
                    "
                    class="w-[72px] h-[72px] rounded-xl object-cover shrink-0"
                    alt=""
                  />
                  <div class="flex-1 flex justify-between items-start">
                    <div class="space-y-1 flex-1">
                      <p
                        class="text-sm font-semibold text-gray-800 leading-tight"
                      >
                        {{ i.name }}
                      </p>
                      <div class="flex gap-1 flex-wrap">
                        <span
                          v-if="
                            i?.meta_data != null &&
                            JSON.parse(i?.meta_data)[0].is_main == 1
                          "
                          class="text-[9px] text-white px-2 py-0.5 rounded-full bg-green-500"
                        >
                          {{
                            JSON.parse(i?.meta_data)[0].is_show == 1
                              ? "main"
                              : "-"
                          }}
                        </span>
                        <span
                          v-if="
                            i?.meta_data != null &&
                            JSON.parse(i?.meta_data)[0].is_show == 1
                          "
                          class="text-[9px] text-white px-2 py-0.5 rounded-full bg-green-500"
                          >show</span
                        >
                      </div>
                      <div>
                        <p
                          class="text-[10px] text-gray-600"
                          v-for="a in i?.including_services != null &&
                          i?.including_services != ''
                            ? JSON.parse(i?.including_services)
                            : []"
                          :key="a"
                        >
                          <span
                            class="h-1.5 w-1.5 mr-1 bg-gray-400 inline-block rounded-full"
                          ></span
                          >{{ a }}
                        </p>
                      </div>
                    </div>
                    <div class="text-right shrink-0 ml-2">
                      <span class="text-xl font-bold text-gray-800">{{
                        i?.price
                      }}</span>
                      <span class="text-[10px] text-gray-400 block"
                        >฿ / ticket</span
                      >
                    </div>
                  </div>
                </div>
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
            <div
              class="px-4 py-4 border-t border-gray-100 shrink-0 flex gap-3 bg-white"
            >
              <button
                @click="closeItemModal"
                class="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-sm text-gray-600 font-medium"
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

    <!-- ===== BOTTOM SHEET: Booking Info ===== -->
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
            <div class="flex justify-center pt-3 pb-1 shrink-0">
              <div class="w-10 h-1 rounded-full bg-gray-300" />
            </div>
            <div class="px-5 pb-3 pt-2 border-b border-gray-100 shrink-0">
              <h3 class="text-base font-semibold text-gray-900">
                Booking Information
              </h3>
              <p class="text-xs text-gray-400 mt-0.5">
                Please provide booking information.
              </p>
            </div>
            <div class="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-gray-500"
                  >Service date <span class="text-red-500">*</span></label
                >
                <input
                  type="date"
                  v-model="formitem.service_date"
                  @change="todayCheck"
                  class="border-2 w-full px-3 py-2.5 rounded-xl text-sm font-poppins focus:outline-none"
                  :class="
                    todayVali || !formitem.service_date
                      ? 'border-gray-200 focus:border-[#ff613c]'
                      : 'border-red-400 text-red-500'
                  "
                />
                <p
                  v-if="!todayVali && formitem.service_date"
                  class="text-[10px] text-red-500"
                >
                  ! please change date
                </p>
              </div>

              <!-- Adult + Child Qty -->
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-gray-500"
                  >Ticket Qty <span class="text-red-500">*</span></label
                >
                <div class="grid grid-cols-1 gap-3">
                  <!-- Adult -->
                  <div
                    class="space-y-1.5 bg-gray-50 rounded-2xl p-3 border-2 border-gray-100"
                  >
                    <label class="text-[10px] font-medium text-gray-500 block"
                      >Adult · {{ formitem.selling_price }} ฿</label
                    >
                    <div class="flex items-center gap-2">
                      <button
                        @click="
                          formitem.quantity > 0 ? formitem.quantity-- : null
                        "
                        class="w-8 h-8 rounded-xl border-2 border-gray-200 flex items-center justify-center text-gray-600 font-bold shrink-0"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        v-model="formitem.quantity"
                        id="adult_pricing"
                        class="flex-1 text-center text-sm font-semibold border-2 border-gray-200 rounded-xl py-1.5 focus:outline-none focus:border-[#ff613c]"
                      />
                      <button
                        @click="formitem.quantity++"
                        class="w-8 h-8 rounded-xl border-2 border-orange-200 flex items-center justify-center text-[#ff613c] font-bold shrink-0"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <!-- Child -->
                  <div
                    v-for="i in formitem.child_info"
                    :key="i"
                    class="space-y-1.5 bg-gray-50 rounded-2xl p-3 border-2 border-gray-100 relative"
                  >
                    <label class="text-[10px] font-medium text-gray-500 block"
                      >Child · {{ i.child_price }} ฿</label
                    >
                    <span
                      :title="i?.info"
                      class="absolute top-2 right-2 cursor-pointer text-[10px] bg-[#FF613c] text-white rounded-full w-4 h-4 flex items-center justify-center custom-tooltip"
                      >?</span
                    >
                    <div class="flex items-center gap-2">
                      <button
                        @click="
                          formitem.individual_pricing.child.quantity > 0
                            ? formitem.individual_pricing.child.quantity--
                            : null
                        "
                        class="w-8 h-8 rounded-xl border-2 border-gray-200 flex items-center justify-center text-gray-600 font-bold shrink-0"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        v-model="formitem.individual_pricing.child.quantity"
                        id="child_pricing"
                        class="flex-1 text-center text-sm font-semibold border-2 border-gray-200 rounded-xl py-1.5 focus:outline-none focus:border-[#ff613c]"
                      />
                      <button
                        @click="formitem.individual_pricing.child.quantity++"
                        class="w-8 h-8 rounded-xl border-2 border-orange-200 flex items-center justify-center text-[#ff613c] font-bold shrink-0"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <!-- Child N/A -->
                  <div
                    v-if="formitem.child_info.length == 0"
                    class="space-y-1.5 bg-gray-50 rounded-2xl p-3 border-2 border-gray-100 relative opacity-50"
                  >
                    <label class="text-[10px] font-medium text-gray-500 block"
                      >Child N/A</label
                    >
                    <span
                      title="empty"
                      class="absolute top-2 right-2 text-[10px] bg-[#FF613c] text-white rounded-full w-4 h-4 flex items-center justify-center"
                      >?</span
                    >
                    <input
                      type="number"
                      disabled
                      class="w-full text-center text-sm border-2 border-gray-200 rounded-xl py-1.5"
                    />
                  </div>
                </div>
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-medium text-gray-500"
                  >Discount</label
                >
                <input
                  type="number"
                  v-model="formitem.discount"
                  class="border-2 border-gray-200 w-full px-3 py-2.5 rounded-xl text-base focus:outline-none focus:border-[#ff613c]"
                />
              </div>

              <div
                class="bg-orange-50 border-2 border-orange-100 rounded-2xl px-4 h-[42px] flex items-center"
              >
                <span class="text-xs text-gray-500 mr-2">Total:</span>
                <span class="text-base font-bold text-[#ff613c]">
                  {{
                    formitem.selling_price * formitem.quantity -
                    formitem.discount +
                    (formitem.individual_pricing.child?.amount || 0)
                  }}
                  ฿
                </span>
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-medium text-gray-500"
                  >Special Request <span class="text-red-500">*</span></label
                >
                <textarea
                  v-model="formitem.special_request"
                  rows="2"
                  class="border-2 border-gray-200 w-full px-3 py-2.5 rounded-xl text-base focus:outline-none focus:border-[#ff613c] resize-none"
                ></textarea>
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-gray-500"
                  >Description <span class="text-red-500">*</span></label
                >
                <textarea
                  v-model="formitem.comment"
                  rows="2"
                  class="border-2 border-gray-200 w-full px-3 py-2.5 rounded-xl text-base focus:outline-none focus:border-[#ff613c] resize-none"
                ></textarea>
              </div>
            </div>
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
                v-if="formitem.product_id && todayVali"
                @click="getFunction"
                class="flex-1 py-3 rounded-2xl text-sm text-white font-semibold bg-[#ff613c]"
              >
                Add Item ✓
              </button>
              <button
                v-if="!formitem.product_id || !todayVali"
                @click="getFunction"
                class="flex-1 py-3 rounded-2xl text-sm text-white font-semibold"
                :class="todayVali ? 'bg-[#ff613c]' : 'bg-gray-300'"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ===== BOTTOM SHEET: Attraction Detail ===== -->
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
            <div class="flex justify-center pt-3 pb-1 shrink-0">
              <div class="w-10 h-1 rounded-full bg-gray-300" />
            </div>
            <div class="px-5 pb-3 pt-2 border-b border-gray-100 shrink-0">
              <h3 class="text-base font-semibold text-gray-900">
                Attraction Information
              </h3>
              <p class="text-xs text-gray-400 mt-0.5">
                Please notify data issues if you see any incorrect data.
              </p>
            </div>
            <div class="flex-1 overflow-y-auto px-4 py-4 space-y-4">
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
              <div class="space-y-1">
                <p class="text-lg font-bold text-[#ff613c]">
                  {{ details?.name }}
                </p>
                <p class="text-xs text-gray-400">
                  {{ details?.variations?.length }} variations
                </p>
              </div>
              <div class="flex gap-3 overflow-x-scroll no-scrollbar pb-1">
                <div
                  v-for="i in details?.variations"
                  :key="i"
                  class="min-w-[140px] space-y-1.5 shrink-0"
                >
                  <img
                    :src="
                      i?.image_links?.length
                        ? i?.image_links[0].image
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
              <div class="space-y-2">
                <p
                  class="text-sm font-semibold border-l-4 border-[#ff613c] pl-3"
                >
                  Package Summary
                </p>
                <p
                  v-html="details?.description"
                  class="text-sm text-gray-600 leading-relaxed"
                ></p>
              </div>
            </div>
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
                @click="router.push(`/products/6?edit=${details?.id}`)"
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
.custom-tooltip {
  position: relative;
}
.custom-tooltip:hover::after {
  content: attr(title);
  position: absolute;
  top: 100%;
  left: -100%;
  transform: translateX(-50%);
  background-color: #333;
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 10;
  margin-top: 5px;
}

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

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
