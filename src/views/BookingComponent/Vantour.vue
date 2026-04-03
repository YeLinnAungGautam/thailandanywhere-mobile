<script setup>
import { ref, onMounted, watch, computed, defineEmits } from "vue";
import {
  MagnifyingGlassIcon,
  BarsArrowDownIcon,
} from "@heroicons/vue/24/outline";
import { MapPinIcon } from "@heroicons/vue/24/solid";
import { useVantourStore } from "../../stores/vantour";
import { storeToRefs } from "pinia";
import debounce from "lodash/debounce";
import { InformationCircleIcon } from "@heroicons/vue/24/solid";
import Modal from "../../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { useRouter } from "vue-router";
import van from "../../../public/1.png";
import saloon from "../../../public/2.png";
import deluxe from "../../../public/3.png";
import attractionImage from "../../../public/attractions.png";
import { useCityStore } from "../../stores/city";
import { useDestinationStore } from "../../stores/destination";
import AddonListOnBooking from "../Addon/AddonListOnBooking.vue";

const bottomOfWindow = ref(false);
const vantourStore = useVantourStore();
const cityStore = useCityStore();
const { cities } = storeToRefs(cityStore);
const { vantours, loading } = storeToRefs(vantourStore);
const destinationStore = useDestinationStore();
const { dests } = storeToRefs(destinationStore);
const destsList = ref([]);
const search = ref("");
const type = ref("van_tour");
const addItemModal = ref(false);
const addInfoModal = ref(false);
const detailModal = ref(false);
const details = ref(null);
const details_images = ref([]);
const router = useRouter();
const addOnList = ref([]);
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
    for (let i = 0; i < details.value.destinations.length; i++) {
      details_images.value.push(details.value.destinations[i].feature_img);
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
  product_type: 1,
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
  pickup_location: "",
  pickup_time: "",
  is_driver_collect: "",
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
  console.log("====================================");
  console.log(item, formitem.value, "this is item");
  console.log("====================================");
  formitem.value.comment =
    item?.destinations.length > 0
      ? item.destinations.map((d) => d.name).join(", ")
      : "";
  formitem.value.product_id = item.id;
  formitem.value.product_name = item.name;
  formitem.value.product_image = item?.cover_image;
  if (item?.cars.length > 0) {
    formitem.value.car_list = item?.cars;
  }
  addItemModal.value = true;
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
  formitem.value.comment = `Car Type : ${item.name} ; Destination : ${formitem.value.comment}`;
  console.log(formitem.value, "this is formItem");
};
const goInfoModal = () => {
  if (formitem.value.car_id != "") {
    console.log("====================================");
    console.log(formitem.value.car_id, formitem.value.item_name);
    console.log("====================================");
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
    await vantourStore.getChangePage(url, watchSystem.value);
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
    product_type: 1,
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
    pickup_location: "",
    pickup_time: "",
    is_driver_collect: "",
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
    formitem.value.discount;
  formitem.value.total_cost_price =
    formitem.value.quantity * formitem.value.cost_price;
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

const search_city = ref("");
const search_type = ref("van");
const search_dest = ref("");
const city_id = ref("");
const filterModal = ref(false);
const search_destination = ref("");

const destination = () => {
  let result = "";
  if (search_dest.value !== "") {
    result = Object.values(search_dest.value).join(",");
  }
  search_destination.value = result;
};

watch(search_type, async (newValue) => {
  if (newValue) {
    search.value = "";
    search_dest.value = "";
  }
});

watch(search_dest, async (newValue) => {
  destination();
  console.log(search_destination.value, "this is destination");
});

const cityIdSelect = (id) => {
  city_id.value = id;
  filterModal.value = !filterModal.value;
};
const filterAction = async () => {
  await searchFilterCity();
  filterModal.value = !filterModal.value;
};
const searchFilterCity = async () => {
  await cityStore.getListAction({ search: search_city.value });
};

watch(
  [search_city],
  debounce(async (newValue) => {
    await searchFilterCity();
  }, 500),
);

watch(bottomOfWindow, (newVal) => {
  console.log("bottomOfWindow changed:", newVal);
  if (bottomOfWindow.value == true) {
    let changePageCalled = false;
    if (newVal && !changePageCalled) {
      console.log("This is the bottom of the window");
      if (
        vantours?.value?.meta?.current_page < vantours?.value?.meta?.last_page
      ) {
        changePageCalled = true;
        changePage(
          vantours?.value?.meta?.links[vantours?.value?.meta?.current_page + 1]
            .url,
        );
      }
    }
  }
});

const watchSystem = computed(() => {
  let result = {};
  if (search.value != null) result.search = search.value;
  result.limit = 20;
  if (type.value != null) result.type = type.value;
  if (city_id.value != "null" && city_id.value != "")
    result.city_id = city_id.value;
  if (search_type.value == "des")
    result.destination_ids = search_destination.value;
  return result;
});

watch(vantours, async (newValue) => {
  if (newValue) {
    destsList.value = [...destsList.value, ...newValue?.data];
  }
});

watch(
  [search, type, city_id, search_destination],
  debounce(async (newValue) => {
    destsList.value = [];
    await vantourStore.getListAction(watchSystem.value);
  }, 500),
);

const getCarImage = (type) => {
  const carImages = { car1: van, car2: saloon, car3: deluxe };
  switch (type) {
    case "SUV":
      return carImages["car2"];
    case "Saloon":
      return carImages["car1"];
    case "VIP Van":
      return carImages["car2"];
    default:
      return carImages["car2"];
  }
};

const backAction = () => {
  addInfoModal.value = false;
  addItemModal.value = true;
};

onMounted(async () => {
  window.addEventListener("scroll", handleScroll);
  await vantourStore.getListAction(watchSystem.value);
  await destinationStore.getSimpleListAction();
  formitem.value.product_type = 1;
});
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h1 class="text-sm font-medium">Product Vantours</h1>
      <div class="flex justify-end items-center gap-x-2 mr-2">
        <div
          class="border border-gray-200 bg-white flex items-center gap-x-1 rounded-full p-1"
        >
          <p
            class="text-xs px-2 py-0.5 rounded-full cursor-pointer"
            @click="type = 'van_tour'"
            :class="
              type == 'van_tour'
                ? 'bg-[#ff613c] text-white'
                : 'bg-white text-black'
            "
          >
            van tour
          </p>
          <p
            class="text-xs px-2 py-0.5 rounded-full cursor-pointer"
            @click="type = 'car_rental'"
            :class="
              type == 'car_rental'
                ? 'bg-[#ff613c] text-white'
                : 'bg-white text-black'
            "
          >
            car rental
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
          v-if="search_type == 'van'"
          v-model="search"
          class="bg-white w-full px-8 py-2.5 rounded-lg focus:outline-none text-xs"
          placeholder="Search van tour !"
        />
        <div
          v-if="search_type == 'des'"
          class="bg-white w-full px-4 py-1 rounded-lg focus:outline-none text-xs"
        >
          <v-select
            v-model="search_dest"
            class="style-chooser-custom px-8 text-[12px]"
            :options="dests?.data ?? []"
            label="name"
            :clearable="false"
            :multiple="true"
            :reduce="(d) => d.id"
            placeholder=""
          ></v-select>
        </div>
        <MagnifyingGlassIcon
          class="w-4 h-4 absolute text-[#ff613c] top-2.5 left-2"
        />
        <div
          class="flex justify-end items-center absolute top-1 right-1 gap-x-2"
        >
          <div
            class="border border-gray-200 bg-white flex items-center gap-x-1 rounded-lg p-1"
          >
            <p
              class="text-xs px-2 py-0.5 rounded-full cursor-pointer"
              @click="search_type = 'van'"
              :class="
                search_type == 'van'
                  ? 'bg-[#ff613c] text-white'
                  : 'bg-white text-black'
              "
            >
              van
            </p>
            <p
              class="text-xs px-2 py-0.5 rounded-full cursor-pointer"
              @click="search_type = 'des'"
              :class="
                search_type == 'des'
                  ? 'bg-[#ff613c] text-white'
                  : 'bg-white text-black'
              "
            >
              des
            </p>
          </div>
        </div>
      </div>
      <div class="bg-[#ff613c] p-2 rounded-full">
        <BarsArrowDownIcon class="w-4 h-4 text-white" @click="filterAction" />
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
        <div class="flex justify-start items-start gap-x-2 pb-8">
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
            <p class="text-xs font-medium">{{ i?.name }}</p>
            <p class="text-[10px]">{{ i?.type }}</p>
            <div class="flex justify-start gap-x-2 items-center py-1">
              <p class="flex items-center gap-x-1 text-[8px] line-clamp-1">
                <MapPinIcon class="w-3 h-3 text-[#ff613c]" />
                {{ i?.cities[0]?.name }}
              </p>
              <p class="text-[8px] flex items-center gap-x-1">
                {{ i?.destinations?.length }}
                <img :src="attractionImage" alt="" class="w-2.5 h-2.5" />
              </p>
            </div>
          </div>
        </div>
        <div
          class="flex justify-between items-center absolute bottom-2 w-[93%]"
        >
          <p class="font-medium">{{ i?.lowest_car_price }} ฿</p>
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

    <!-- ===== BOTTOM SHEET: Choose Car Type ===== -->
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
                Choose Car Type
              </h3>
              <p class="text-xs text-gray-400 mt-0.5">
                Please choose the car type.
              </p>
              <!-- <div
                class="relative w-full border-2 border-gray-200 rounded-xl mt-2"
              >
                <input
                  type="text"
                  v-model="search"
                  class="bg-white w-full px-8 py-2.5 rounded-xl focus:outline-none text-xs"
                  placeholder="Search Car Type"
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
                    :src="getCarImage(i.name)"
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
                        {{ i.max_person }} Pax
                      </p>
                    </div>
                    <div class="text-right shrink-0 ml-2">
                      <span class="text-xl font-bold text-gray-800">{{
                        i?.price
                      }}</span>
                      <span class="text-[10px] text-gray-400 block"
                        >฿ / car</span
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
              <div class="grid grid-cols-2 gap-3">
                <div class="space-y-1.5">
                  <label class="text-xs font-medium text-gray-500"
                    >Pick up time <span class="text-red-500">*</span></label
                  >
                  <input
                    type="time"
                    v-model="formitem.pickup_time"
                    class="border-2 border-gray-200 w-full px-3 py-2.5 rounded-xl text-sm font-poppins focus:outline-none focus:border-[#ff613c]"
                  />
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-medium text-gray-500"
                    >Pick up date <span class="text-red-500">*</span></label
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
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-gray-500"
                  >Pick up location <span class="text-red-500">*</span></label
                >
                <input
                  type="text"
                  v-model="formitem.pickup_location"
                  class="border-2 border-gray-200 w-full px-3 py-2.5 rounded-xl text-base focus:outline-none focus:border-[#ff613c]"
                />
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-gray-500"
                  >Qty <span class="text-red-500">*</span></label
                >
                <input
                  type="number"
                  v-model="formitem.quantity"
                  class="border-2 border-gray-200 w-full px-3 py-2.5 rounded-xl text-base focus:outline-none focus:border-[#ff613c]"
                />
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
                    formitem.discount
                  }}
                  ฿
                </span>
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-gray-500"
                  >Route Plan <span class="text-red-500">*</span></label
                >
                <textarea
                  v-model="formitem.route_plan"
                  rows="2"
                  class="border-2 border-gray-200 w-full px-3 py-2.5 rounded-xl text-base focus:outline-none focus:border-[#ff613c] resize-none"
                ></textarea>
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

    <!-- ===== BOTTOM SHEET: Filter Cities ===== -->
    <Teleport to="body">
      <Transition name="sheet">
        <div
          v-if="filterModal"
          class="fixed inset-0 z-50 flex flex-col justify-end"
          @click.self="filterModal = false"
        >
          <div
            class="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            @click="filterModal = false"
          />
          <div
            class="relative bg-white rounded-t-3xl w-full max-h-[80dvh] flex flex-col shadow-2xl"
          >
            <div class="flex justify-center pt-3 pb-1 shrink-0">
              <div class="w-10 h-1 rounded-full bg-gray-300" />
            </div>
            <div class="px-5 pb-3 pt-2 border-b border-gray-100 shrink-0">
              <h3 class="text-base font-semibold text-gray-900">
                Filter Cities
              </h3>
              <p class="text-xs text-gray-400 mt-0.5">
                Tap a city to filter results.
              </p>
              <div
                class="relative w-full border-2 border-gray-200 rounded-xl mt-2"
              >
                <input
                  type="text"
                  v-model="search_city"
                  class="bg-white w-full px-8 py-2.5 rounded-xl focus:outline-none text-xs"
                  placeholder="Search cities..."
                />
                <MagnifyingGlassIcon
                  class="w-4 h-4 absolute text-[#ff613c] top-2.5 left-2"
                />
              </div>
            </div>
            <div class="flex-1 overflow-y-auto px-4 py-3 space-y-2">
              <div
                class="rounded-2xl border-2 cursor-pointer transition-colors active:scale-[0.98]"
                @click="cityIdSelect('null')"
                :class="
                  city_id == 'null'
                    ? 'bg-[#ff613c] border-[#ff613c]'
                    : 'border-gray-100'
                "
              >
                <p
                  class="py-3 px-4 text-sm font-medium"
                  :class="city_id == 'null' ? 'text-white' : 'text-gray-700'"
                >
                  All City
                </p>
              </div>
              <div
                v-for="c in cities?.data ?? []"
                :key="c"
                class="rounded-2xl border-2 cursor-pointer transition-colors active:scale-[0.98]"
                @click="cityIdSelect(c.id)"
                :class="
                  city_id == c.id
                    ? 'bg-[#ff613c] border-[#ff613c]'
                    : 'border-gray-100'
                "
              >
                <p
                  class="py-3 px-4 text-sm font-medium"
                  :class="city_id == c.id ? 'text-white' : 'text-gray-700'"
                >
                  {{ c.name }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ===== BOTTOM SHEET: Van Tour Detail ===== -->
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
                Van Tour Information
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
                  {{ details?.destinations?.length }} destinations
                </p>
              </div>
              <div class="flex gap-3 overflow-x-scroll no-scrollbar pb-1">
                <div
                  v-for="i in details?.destinations"
                  :key="i"
                  class="min-w-[140px] space-y-1.5 shrink-0"
                >
                  <img
                    :src="
                      i?.feature_img
                        ? i?.feature_img
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
                  v-html="details?.long_description"
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
                @click="router.push(`/vantour/view/${details?.id}/edit`)"
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

<style>
.style-chooser-custom .vs__dropdown-toggle {
  border: none !important;
  padding: 0px 0px 0px 0px !important;
  border-radius: 8px;
}
.style-chooser-custom .vs__selected {
  font-size: 12px !important;
  display: flex;
  align-items: center;
  border: none !important;
  color: var(--vs-selected-color);
  line-height: var(--vs-line-height);
  margin: 4px 2px 0;
  padding: 0 0.25em;
  z-index: 0;
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
