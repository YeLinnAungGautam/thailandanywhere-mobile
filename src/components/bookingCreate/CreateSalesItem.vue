<script setup>
import { storeToRefs } from "pinia";
import { ref, defineProps, defineEmits, onMounted, watch, computed } from "vue";
import { Switch } from "@headlessui/vue";
import { useAuthStore } from "../../stores/auth";
import { useVantourStore } from "../../stores/vantour";
import { useGrouptourStore } from "../../stores/grouptour";
import { useAirportStore } from "../../stores/airport";
import { useEntranceStore } from "../../stores/entrance";
import { useBookingStore } from "../../stores/booking";
// import { useInclusiveStore } from "../../stores/inclusion";
import { useRoomStore } from "../../stores/room";
import { useHotelStore } from "../../stores/hotel";
import { useAirLineStore } from "../../stores/airline";

const props = defineProps({
  data: Object,
  is_inclusive: "",
});

const authStore = useAuthStore();
const vantourStore = useVantourStore();
const grouptourStore = useGrouptourStore();
const airportStore = useAirportStore();
const entranceStore = useEntranceStore();
const bookingStore = useBookingStore();
const hotelStore = useHotelStore();
const roomStore = useRoomStore();
const airlineStore = useAirLineStore();

const { vantour } = storeToRefs(vantourStore);
const { grouptour } = storeToRefs(grouptourStore);
const { airport } = storeToRefs(airportStore);
const { entrance } = storeToRefs(entranceStore);
const { airline } = storeToRefs(airlineStore);
const { rooms } = storeToRefs(roomStore);
const { hotel } = storeToRefs(hotelStore);

const enabled = ref(false);
const emit = defineEmits();

const showInfo = () => {
  emit("change", "changes");
};

const change = (id) => {
  checkValue.value = id;
  emit("checked", checkValue.value);
};

const formItemType = [
  { id: "1", name: "Van Tour", data: "AppModelsPrivateVanTour" },
  { id: "2", name: "Group Tour", data: "AppModelsGroupTour" },
  { id: "3", name: "Airport Pickup", data: " AppModelsAirportPickup" },
  { id: "4", name: "Entrance Ticket", data: "AppModelsEntranceTicket" },
  { id: "5", name: "Inclusive", data: "AppModelsInclusive" },
  { id: "6", name: "Hotel Room", data: "AppModelsRoom" },
  { id: "7", name: "AirLine", data: "AppModelsAirline" },
];

const formitem = ref({
  reservation_id: null,
  product_type: "",
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
  dropoff_location: "",
  route_plan: "",
  checkin_date: "",
  room_number: "",
  checkout_date: "",
  customer_attachment: "",
});

const productList = ref([]);
const chooseType = async () => {
  if (formitem.value.product_type == "1") {
    await vantourStore.getSimpleListAction();
    productList.value = vantour.value.data;

    console.log(productList.value);
  } else if (formitem.value.product_type == "2") {
    await grouptourStore.getSimpleListAction();
    productList.value = grouptour.value.data;
    console.log(productList.value);
  } else if (formitem.value.product_type == "3") {
    await airportStore.getSimpleListAction();
    productList.value = airport.value.data;
    console.log(productList.value);
  } else if (formitem.value.product_type == "4") {
    await entranceStore.getSimpleListAction();
    productList.value = entrance.value.data;
    console.log(productList.value);
  } else if (formitem.value.product_type == "5") {
    await inclusiveStore.getSimpleListAction();
    productList.value = inclusives.value.data;
    console.log(productList.value);
  } else if (formitem.value.product_type == "6") {
    await hotelStore.getSimpleListAction();
    productList.value = hotel.value.data;
    console.log(productList.value);
  } else if (formitem.value.product_type == "7") {
    await airlineStore.getSimpleListAction();
    productList.value = airline.value.data;
    console.log(productList.value, "this is air");
  }
};
const carType = ref([]);
const roomType = ref([]);
const chooseCar = async (id) => {
  if (formitem.value.product_type == "1" && id) {
    const res = await vantourStore.getDetailAction(id);
    formitem.value.comment = res.result.long_description;
    console.log(res, "this is des");
    carType.value = res.result.cars;
  } else if (formitem.value.product_type == "2") {
    const res = await grouptourStore.getDetailAction(id);
    formitem.value.comment = res.result.description;
    formitem.value.selling_price = res.result.price;
    carType.value = res.result.cars;
    console.log(res);
  } else if (formitem.value.product_type == "3") {
    const res = await airportStore.getDetailAction(id);
    formitem.value.comment = res.result.description;
    carType.value = res.result.cars;
    console.log(res);
  } else if (formitem.value.product_type == "4") {
    const res = await entranceStore.getDetailAction(id);
    // formitem.value.comment = res.result.description;
    console.log(res, "choose");
    carType.value = res.result.variations;
    // console.log(res.result.variations[0].price);
  } else if (formitem.value.product_type == "5") {
    const res = await inclusiveStore.getDetailAction(id);
    console.log(res);
    formitem.value.comment = res.result.description;
    formitem.value.selling_price = res.result.price;
    // addArrayToList(res.result);
  } else if (formitem.value.product_type == "6") {
    const res = await hotelStore.getDetailAction(id);
    // formitem.value.comment = res.result.description;
    roomType.value = res.result.rooms;
  } else if (formitem.value.product_type == "7") {
    const res = await airlineStore.getDetailAction(id);
    console.log(res.result.tickets, "this is ");
    carType.value = res.result.tickets;
  }
};
const chooseCarPrice = async (type, productId, id) => {
  if (type == "1") {
    const res = await vantourStore.getDetailAction(productId);
    console.log(res);
    for (let i = 0; i < res.result.cars.length; i++) {
      formitem.value.car_list = res.result.cars;
      if (res.result.cars[i].id == id) {
        formitem.value.selling_price = res.result.cars[i].price;
        console.log(res.result.cars[i]);
      }
    }
  } else if (type == "2") {
    const res = await grouptourStore.getDetailAction(productId);
    formitem.value.car_list = res.result.cars;
    for (let i = 0; i < res.result.cars.length; i++) {
      if (res.result.cars[i].id == id) {
        formitem.value.selling_price = res.result.cars[i].price;
        console.log(res.result.cars[i].price);
      }
    }
    console.log(res);
  } else if (type == "3") {
    const res = await airportStore.getDetailAction(productId);
    formitem.value.car_list = res.result.cars;
    for (let i = 0; i < res.result.cars.length; i++) {
      if (res.result.cars[i].id == id) {
        formitem.value.selling_price = res.result.cars[i].price;
        console.log(res.result.cars[i].price);
      }
    }
    console.log(res);
  } else if (type == "4") {
    const res = await entranceStore.getDetailAction(productId);
    formitem.value.car_list = res.result.variations;

    for (let i = 0; i < res.result.variations.length; i++) {
      if (res.result.variations[i].id == id) {
        formitem.value.selling_price = res.result.variations[i].price;
        formitem.value.cost_price = res.result.variations[i].cost_price;
        formitem.value.comment = res.result.variations[i].description;
        console.log(formitem.value.cost_price, "this is cost price detail");
      }
    }
    console.log(res);
  } else if (type == "6") {
    const res = await hotelStore.getDetailAction(productId);
    formitem.value.room_list = res.result.rooms;
    const room = res.result.rooms.filter((r) => r.id === id)[0];
    formitem.value.room = room;
    formitem.value.selling_price = room.room_price;
    formitem.value.cost_price = room.cost;
    console.log(formitem.value.cost_price, "this is room cost");
    formitem.value.extra_price = room.extra_price;
    formitem.value.comment = room.description;
    console.log(room);
  } else if (type == "7") {
    const res = await airlineStore.getDetailAction(productId);
    formitem.value.car_list = res.result.tickets;
    console.log(formitem.value.car_list);
    for (let i = 0; i < res.result.tickets.length; i++) {
      if (res.result.tickets[i].id == id) {
        // formitem.value.selling_price = res.result.tickets[i].price;
        formitem.value.comment = res.result.tickets[i].description;
        console.log(res.result.tickets[i].description);
      }
    }
    console.log(res);
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
  // console.log(formatDate(today) == formatDate(selectDate), "this is date ");

  return formatDate(selectDate) >= formatDate(today);
};
const todayCheck = () => {
  if (enabled.value) {
    todayVali.value = true;
  } else {
    console.log(formitem.value.service_date);
    todayVali.value = isAfterToday(formitem.value.service_date);
    console.log(todayVali.value, "this is value");
  }
};

const hotelQ = (t, d, q) => {
  let data = 0;
  if (t == 6 || t == "App\\Models\\Hotel") {
    return (data = d * q);
  }
};

const calculateRateRoom = () => {
  if (formitem.value.checkin_date && formitem.value.checkout_date) {
    formitem.value.days = calculateDaysBetween(
      formitem.value.checkin_date,
      formitem.value.checkout_date
    );
  }
};
const calculateDaysBetween = (a, b) => {
  if (a && b) {
    const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    const startDateTimestamp = new Date(a).getTime();
    const endDateTimestamp = new Date(b).getTime();
    let result = Math.abs(
      Math.round((endDateTimestamp - startDateTimestamp) / oneDay)
    );
    // formitem.value.days = result;
    return result;
  }
};

const sub_qty_total = computed(() => {
  let totalsub = 0;
  if (formitem.value.days) {
    totalsub =
      formitem.value.quantity *
        formitem.value.selling_price *
        formitem.value.days -
      formitem.value.discount;
    formitem.value.total_amount = totalsub;
    return totalsub;
  } else {
    totalsub =
      formitem.value.quantity * formitem.value.selling_price -
      formitem.value.discount;
    formitem.value.total_amount = totalsub;
    return totalsub;
  }
});

const moreInfo = ref(true);
watch(
  () => formitem.value.service_date,
  (newData) => {
    if (formitem.value.product_type == "6") {
      formitem.value.checkin_date = newData;
    }
    calculateRateRoom();
  }
);

watch(props.is_inclusive, (newData) => {
  console.log(newData);
});

const getFunction = () => {
  console.log(formitem.value);
  emit("formData", formitem.value);
};
</script>

<template>
  <div>
    <div class="relative">
      <div
        class="flex justify-start items-center gap-2 py-4 px-4 text-main"
        @click="showInfo"
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
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        Back
      </div>
      <div class="px-4 w-full space-y-2">
        <p class="text-lg text-main font-medium text-center">
          Create Item Sale List
        </p>
        <p class="text-xs text-red text-start">
          #Note :Inclusive product create is still developing , Can't create
          now.
        </p>
        <div class="space-y-2">
          <label for="name" class="text-sm text-gray-800">Product Type</label>
          <v-select
            v-model="formitem.product_type"
            class="style-chooser w-full min-h-10 text-sm px-4 text-gray-900 border-main border rounded shadow-sm bg-white focus:outline-none focus:border-gray-300"
            :options="formItemType"
            label="name"
            :clearable="false"
            :reduce="(d) => d.id"
            @option:selected="chooseType"
            placeholder="choose product type"
          ></v-select>
        </div>
        <div class="space-y-2">
          <label for="name" class="text-sm text-gray-800">Choose Product</label>
          <v-select
            v-model="formitem.product_id"
            class="style-chooser w-full min-h-10 text-sm px-4 text-gray-900 border-main border rounded shadow-sm bg-white focus:outline-none focus:border-gray-300"
            :options="productList"
            label="name"
            :clearable="false"
            :reduce="(d) => d.id"
            @option:selected="chooseCar(formitem.product_id)"
            placeholder="choose product"
          ></v-select>
        </div>
        <div
          class="space-y-2"
          v-if="formitem.product_type == '1' || formitem.product_type == '3'"
        >
          <label for="name" class="text-sm text-gray-800"
            >Choose Variation</label
          >
          <v-select
            v-model="formitem.car_id"
            class="style-chooser w-full min-h-10 text-sm px-4 text-gray-900 border-main border rounded shadow-sm bg-white focus:outline-none focus:border-gray-300"
            :options="carType"
            label="name"
            :clearable="false"
            :reduce="(d) => d.id"
            @option:selected="
              chooseCarPrice(
                formitem.product_type,
                formitem.product_id,
                formitem.car_id
              )
            "
            placeholder="choose variation"
          ></v-select>
        </div>
        <div class="space-y-2" v-if="formitem.product_type == '4'">
          <label for="name" class="text-sm text-gray-800"
            >Choose Variation</label
          >
          <v-select
            v-model="formitem.car_id"
            class="style-chooser w-full min-h-10 text-sm px-4 text-gray-900 border-main border rounded shadow-sm bg-white focus:outline-none focus:border-gray-300"
            :options="carType"
            label="name"
            :clearable="false"
            :reduce="(d) => d.id"
            @option:selected="
              chooseCarPrice(
                formitem.product_type,
                formitem.product_id,
                formitem.car_id
              )
            "
            placeholder="choose variation"
          ></v-select>
        </div>
        <div class="space-y-2" v-if="formitem.product_type == '7'">
          <label for="name" class="text-sm text-gray-800"
            >Choose Variation</label
          >
          <v-select
            v-model="formitem.car_id"
            class="style-chooser w-full min-h-10 text-sm px-4 text-gray-900 border-main border rounded shadow-sm bg-white focus:outline-none focus:border-gray-300"
            :options="carType"
            label="price"
            :clearable="false"
            :reduce="(d) => d.id"
            @option:selected="
              chooseCarPrice(
                formitem.product_type,
                formitem.product_id,
                formitem.car_id
              )
            "
            placeholder="choose variation"
          ></v-select>
        </div>
        <div class="space-y-2" v-if="formitem.product_type == '6'">
          <label for="name" class="text-sm text-gray-800"
            >Choose Variation</label
          >
          <v-select
            v-model="formitem.room_id"
            class="style-chooser w-full min-h-10 text-sm px-4 text-gray-900 border-main border rounded shadow-sm bg-white focus:outline-none focus:border-gray-300"
            :options="roomType"
            label="name"
            :clearable="false"
            :reduce="(d) => d.id"
            @option:selected="
              chooseCarPrice(
                formitem.product_type,
                formitem.product_id,
                formitem.room_id
              )
            "
          ></v-select>
        </div>
        <div class="space-y-2">
          <label for="name" class="text-sm text-gray-800">Service Date</label>
          <input
            type="date"
            v-model="formitem.service_date"
            @change="todayCheck"
            id="title"
            class="min-w-[95%] block h-10 text-sm px-4 py-2 text-gray-900 border-main border rounded shadow-sm bg-white focus:outline-none focus:border-gray-300"
            :class="todayVali == true ? 'text-blue-600' : 'text-red-600'"
          />
          <p class="text-xs text-red" v-if="!todayVali">after & today</p>
        </div>
        <div class="space-y-2">
          <label for="name" class="text-sm text-gray-800"
            >Rate per quantity</label
          >
          <input
            v-if="formitem.product_type != '7'"
            type="number"
            disabled
            v-model="formitem.selling_price"
            class="w-full h-10 text-sm px-4 py-2 text-gray-900 border-main border rounded shadow-sm bg-white/20 focus:outline-none focus:border-gray-300"
          />
          <input
            v-if="formitem.product_type == '7'"
            type="number"
            v-model="formitem.selling_price"
            class="w-full h-10 text-sm px-4 py-2 text-gray-900 border-main border rounded shadow-sm bg-white focus:outline-none focus:border-gray-300"
          />
        </div>
        <div class="space-y-2" v-if="formitem.product_type == '6'">
          <p class="text-xs">Checkin Date</p>
          <input
            type="date"
            disabled
            class="min-w-[95%] block h-10 text-sm px-4 py-2 text-gray-900 border-main border rounded shadow-sm bg-white focus:outline-none focus:border-gray-300"
            id=""
            v-model="formitem.checkin_date"
          />
        </div>
        <div class="space-y-2" v-if="formitem.product_type == '6'">
          <p class="text-xs">Checkout Date</p>
          <input
            type="date"
            class="min-w-[95%] block h-10 text-sm px-4 py-2 text-gray-900 border-main border rounded shadow-sm bg-white focus:outline-none focus:border-gray-300"
            id=""
            v-model="formitem.checkout_date"
          />
        </div>
        <div class="space-y-2" v-if="formitem.product_type == '6'">
          <p class="text-xs pt-2" @click="calculateRateRoom">
            Days
            <span class="text-xs text-red"
              >(click that label for auto calcute days)</span
            >
          </p>
          <input
            type="number"
            disabled
            class="w-full h-10 text-sm px-4 py-2 text-gray-900 border-main border rounded shadow-sm bg-transparent focus:outline-none focus:border-gray-300"
            id=""
            v-model="formitem.days"
            placeholder="days"
          />
        </div>
        <div class="space-y-2">
          <label
            for="name"
            class="text-sm text-gray-800"
            v-if="formitem.product_type == '6'"
            >Quantity of Rooms</label
          >
          <label
            for="name"
            class="text-sm text-gray-800"
            v-if="formitem.product_type != '6'"
            >Quantity</label
          >
          <input
            type="number"
            v-model="formitem.quantity"
            class="w-full h-10 text-sm px-4 py-2 text-gray-900 border-main border rounded shadow-sm bg-white focus:outline-none focus:border-gray-300"
          />
          <label
            for="name"
            class="text-sm text-gray-800"
            v-if="formitem.product_type == '6'"
            >Quantity</label
          >
          <p
            class="w-full h-10 text-sm px-4 py-2 text-gray-900 border-main border rounded shadow-sm bg-white focus:outline-none focus:border-gray-300"
            v-if="formitem.product_type == '6'"
          >
            {{
              hotelQ(formitem.product_type, formitem.days, formitem.quantity)
            }}
          </p>
        </div>
        <div
          class="space-y-1"
          v-if="formitem.product_type != '7' && is_inclusive != '1'"
        >
          <label for="" class="text-sm text-gray-800">Discount</label>
          <div>
            <input
              type="number"
              v-model="formitem.discount"
              class="w-full text-sm px-4 py-2 text-gray-900 border-main border rounded shadow-sm bg-white focus:outline-none focus:border-gray-300"
            />
          </div>
        </div>
        <div class="space-y-2">
          <label for="name" class="text-sm text-gray-800">Description</label>
          <textarea
            name=""
            id=""
            class="w-full text-sm px-4 py-2 text-gray-900 border-main border rounded shadow-sm bg-white focus:outline-none focus:border-gray-300"
            cols="30"
            rows="5"
            v-model="formitem.comment"
          ></textarea>
        </div>
        <div class="space-y-2" v-if="moreInfo">
          <label for="name" class="text-sm text-gray-800"
            >Special Request</label
          >
          <textarea
            name=""
            id=""
            class="w-full text-sm px-4 py-2 text-gray-900 border-main border rounded shadow-sm bg-white focus:outline-none focus:border-gray-300"
            cols="30"
            rows="5"
            v-model="formitem.special_request"
            placeholder="enter special request"
          ></textarea>
        </div>
        <div
          class="space-y-2"
          v-if="
            (formitem.product_type == '1' || formitem.product_type == '3') &&
            moreInfo
          "
        >
          <label for="name" class="text-sm text-gray-800">Pickup Time</label>
          <input
            type="time"
            name=""
            v-model="formitem.pickup_time"
            class="min-w-[95%] block h-10 text-sm px-4 py-2 text-gray-900 border-main border rounded shadow-sm bg-white focus:outline-none focus:border-gray-300"
            id=""
          />
        </div>
        <div
          class="space-y-2"
          v-if="
            (formitem.product_type == '1' || formitem.product_type == '3') &&
            moreInfo
          "
        >
          <label for="name" class="text-sm text-gray-800"
            >Pickup Location</label
          >
          <textarea
            name=""
            id=""
            class="w-full text-sm px-4 py-2 text-gray-900 border-main border rounded shadow-sm bg-white focus:outline-none focus:border-gray-300"
            cols="30"
            rows="5"
            v-model="formitem.pickup_location"
            placeholder="enter pickup location"
          ></textarea>
        </div>
        <div
          class="space-y-2"
          v-if="
            (formitem.product_type == '1' || formitem.product_type == '3') &&
            moreInfo
          "
        >
          <label for="name" class="text-sm text-gray-800"
            >Dropoff Location</label
          >
          <textarea
            name=""
            id=""
            class="w-full text-sm px-4 py-2 text-gray-900 border-main border rounded shadow-sm bg-white focus:outline-none focus:border-gray-300"
            cols="30"
            rows="5"
            v-model="formitem.dropoff_location"
            placeholder="enter dropoff location"
          ></textarea>
        </div>
        <div
          class="space-y-2"
          v-if="
            (formitem.product_type == '1' || formitem.product_type == '3') &&
            moreInfo
          "
        >
          <label for="name" class="text-sm text-gray-800">Route Plan</label>
          <textarea
            name=""
            id=""
            class="w-full text-sm px-4 py-2 text-gray-900 border-main border rounded shadow-sm bg-white focus:outline-none focus:border-gray-300"
            cols="30"
            rows="5"
            v-model="formitem.route_plan"
            placeholder="enter dropoff location"
          ></textarea>
        </div>
        <div class="space-y-2">
          <label for="name" class="text-sm text-gray-800">Total Amount</label>
          <p
            class="w-full h-10 text-sm px-4 py-2 text-gray-900 border-main border rounded shadow-sm bg-transparent focus:outline-none focus:border-gray-300"
          >
            {{ sub_qty_total }}
          </p>
        </div>

        <div class="flex justify-end items-center py-4 space-x-2">
          <!-- <div
            class="space-x-4 flex justify-center items-center gap-2 px-4 py-2 rounded border-main bg-white text-black border"
            @click="moreInfo = !moreInfo"
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
                d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>

            <p class="">More</p>
          </div> -->
          <div
            class="space-x-4 flex justify-center items-center gap-2 px-4 py-2 rounded border-main bg-main text-white border"
            v-if="formitem.product_id && todayVali"
            @click="getFunction"
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
                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p class="">Add</p>
          </div>
          <div
            class="space-x-4 flex justify-center items-center gap-2 px-4 py-2 rounded border-black/50 bg-black/50 text-white border"
            v-if="!formitem.product_id || !todayVali"
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
                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p class="">Need to fill Data</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
