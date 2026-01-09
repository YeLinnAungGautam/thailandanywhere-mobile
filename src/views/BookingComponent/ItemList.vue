<script setup>
import {
  TrashIcon,
  PencilSquareIcon,
  XCircleIcon,
  DocumentCheckIcon,
  MagnifyingGlassIcon,
  ChatBubbleBottomCenterIcon,
  ChatBubbleBottomCenterTextIcon,
} from "@heroicons/vue/24/outline";
import { onMounted, defineProps, ref, defineEmits, watch } from "vue";
import Modal from "../../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import van from "../../../public/1.png";
import saloon from "../../../public/2.png";
import deluxe from "../../../public/3.png";
import { useAuthStore } from "../../stores/auth";
import { useHotelStore } from "../../stores/hotel";
import AddonListOnBooking from "../Addon/AddonListOnBooking.vue";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { daysBetween } from "../help/DateBetween";
import AmendCreate from "./AmendCreate.vue";
import AmendIcon from "../../assets/refresh-button.png";

const props = defineProps({
  data: Object,
});
const emit = defineEmits(["remove"]);
const route = useRoute();
const itemList = ref([]);
const editIndex = ref("");
const openModal = ref(false);
const authStore = useAuthStore();
const hotelStore = useHotelStore();

const search = ref("");

const formitem = ref({
  reservation_id: null,
  product_type: "",
  product_id: "",
  car_id: "",
  car_list: [],
  discount: 0,
  room_id: "",
  room: null,
  service_date: "",
  quantity: 0,
  days: "",
  cancellation: null,
  duration: "",
  selling_price: "",
  child_info: [],
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
});

const getRemoveFunction = (id, index) => {
  let data = {
    id: id,
    index: index,
  };
  console.log("====================================");
  console.log(data, "this is emit id");
  console.log("====================================");
  emit("remove", data);
  cancellationModal.value = false;
};

const router = useRouter();

const cancellationModal = ref(false);

const amendModal = ref(false);
const amendData = ref(null);

const amendModalAction = (data, index) => {
  amendData.value = data;
  amendModal.value = true;
};
const amendCloseAction = () => {
  amendModal.value = false;
  amendData.value = null;
};

const cancellationAction = (data, index) => {
  editIndex.value = index;
  formitem.value = data;
  cancellationModal.value = true;
  console.log("====================================");
  console.log(formitem.value, "this is for cancel formitem");
  console.log("====================================");
};

// Fix 4: Improved cancellation handling
const cancellationModalAction = () => {
  console.log("Cancellation state:", formitem.value.cancellation);

  if (formitem.value.cancellation) {
    console.log("Updated cancellation status to:", formitem.value.cancellation);
  }

  cancellationModal.value = false;
};

const editAction = (index, data) => {
  editIndex.value = index;
  formitem.value = data;
  openModal.value = true;
  console.log("====================================");
  console.log(formitem.value, "this is formitem");
  console.log("====================================");
};

const closeModalAction = () => {
  editIndex.value = "";
  formitem.value = {
    reservation_id: null,
    product_type: "",
    product_name: "",
    item_name: "",
    product_id: "",
    car_id: "",
    car_list: [],
    discount: 0,
    room_id: "",
    room: null,
    service_date: "",
    quantity: 0,
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
    pickup_location: "",
    pickup_time: "",
    is_driver_collect: "",
    dropoff_location: "",
    route_plan: "",
    checkin_date: "",
    room_number: "",
    checkout_date: "",
    customer_attachment: "",
  };
  openModal.value = false;
};

const addItemModal = ref(false);
const addInfoModal = ref(false);

const nextState = () => {
  openModal.value = true;
  addItemModal.value = false;
};

const openAddItemModalAction = () => {
  openModal.value = false;
  addItemModal.value = true;
};

const selectAction = (item) => {
  formitem.value.car_id = item.id;
  console.log("====================================");
  console.log(item, "this is selected item");
  console.log("====================================");
  if (formitem.value.product_type != 7) {
    formitem.value.item_name = item.name;
    if (formitem.value.product_type == 1) {
      let des = formitem.value.comment.replace(/^[^;]*;\s*/, "");
      formitem.value.comment = `Car Type : ${item.name} ; ${des}`;
      // formitem.value.selling_price = item.price ? item.price : item.room_price;
    }
    formitem.value.selling_price = item.price ? item.price : item.room_price;
    if (formitem.value.product_type == 6) {
      formitem.value.cost_price = item.cost ? item.cost : 0;
      formitem.value.selling_price = item.room_price
        ? item.room_price
        : item.price;
    }
    if (formitem.value.product_type == 4) {
      formitem.value.cost_price = item.cost_price ? item.cost_price : 0;
      formitem.value.comment = `Variation : ${formitem.value.item_name}`;
      formitem.value.child_info = item.child_info
        ? JSON.parse(item.child_info)
        : [];
      if (formitem.value.child_info.length == 0) {
        formitem.value.individual_pricing.child.quantity = 0;
        formitem.value.individual_pricing.child.selling_price = 0;
        formitem.value.individual_pricing.child.cost_price = 0;
        formitem.value.individual_pricing.child.total_cost_price = 0;
        formitem.value.individual_pricing.child.amount = 0;
      }
    }
  }
  if (formitem.value.product_type == 7) {
    formitem.value.item_name = item.description;
    formitem.value.comment = `Ticket : ${formitem.value.item_name}`;
  }
  console.log(formitem.value, "this is formItem");
  getFunction();
};

const addOnList = ref([]);

const changeAddOnList = (message) => {
  console.log(message, "this is message");

  addOnList.value = [];
};

// const addOnSellingPrice = computed(() => {
//   let result = 0;
//   if (addOnList.value != null) {
//     for (let i = 0; i < addOnList.value.length; i++) {
//       if (addOnList.value[i].select == true) {
//         result += addOnList.value[i].price * addOnList.value[i].quantity;
//       }
//     }
//   }
//   return result;
// });

// const addOnCostPrice = computed(() => {
//   let result = 0;
//   if (addOnList.value != null) {
//     for (let i = 0; i < addOnList.value.length; i++) {
//       if (addOnList.value[i].select == true) {
//         result += addOnList.value[i].cost_price * addOnList.value[i].quantity;
//       }
//     }
//   }
//   return result;
// });

const goInfoModal = () => {
  console.log("====================================");
  console.log(formitem.value, "this is item");
  console.log("====================================");

  todayCheck();
  addItemModal.value = false;
  openModal.value = false;
  addInfoModal.value = true;
};

// Fix 2: Improve the date validation functions
const formatDate = (date) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return "";
  }
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const isAfterToday = (dateStr) => {
  if (!dateStr) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let selectDate = new Date(dateStr);
  selectDate.setHours(0, 0, 0, 0);

  return selectDate >= today;
};

const todayVali = ref(false);

const todayCheck = () => {
  if (!formitem.value.service_date) {
    todayVali.value = false;
    return;
  }

  todayVali.value = isAfterToday(formitem.value.service_date);
  console.log("Date validation result:", todayVali.value);
};

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
    // data.room_ids = formitem.value.car_list.map((item) => item.id).join(",");
    const res = await hotelStore.getRoomPrice(data, formitem.value.car_id);
    console.log("====================================");
    console.log(res, "this is room price");
    console.log("====================================");
    priceArray.value = res.data.daily_pricing;
    formitem.value.selling_price = res.data.total_sale_price;
    formitem.value.cost_price = res.data.total_cost_price;
  }
};

// send item
const getFunction = () => {
  // Ensure all values are properly parsed numbers to avoid string concatenation
  const quantity = parseFloat(formitem.value.quantity) || 0;
  const sellingPrice = parseFloat(formitem.value.selling_price) || 0;
  const costPrice = parseFloat(formitem.value.cost_price) || 0;
  const discount = parseFloat(formitem.value.discount) || 0;
  const days = parseFloat(formitem.value.days) || 1;

  const childAmount =
    formitem.value.individual_pricing && formitem.value.individual_pricing.child
      ? parseFloat(formitem.value.individual_pricing.child.amount) || 0
      : 0;

  const childCostPrice =
    formitem.value.individual_pricing && formitem.value.individual_pricing.child
      ? parseFloat(formitem.value.individual_pricing.child.total_cost_price) ||
        0
      : 0;

  if (days > 1) {
    formitem.value.total_amount = quantity * sellingPrice - discount;
    formitem.value.total_cost_price = quantity * costPrice;
  } else {
    formitem.value.total_amount =
      sellingPrice * quantity - discount + childAmount;
    formitem.value.total_cost_price = quantity * costPrice + childCostPrice;
  }

  console.log("Calculated total amount:", formitem.value.total_amount);
  console.log("Calculated total cost price:", formitem.value.total_cost_price);
};

const cancelAction = () => {
  getFunction();
  closeModalAction();
  addItemModal.value = false;
  addInfoModal.value = false;
};

const getCarImage = (type) => {
  // Define the car images for each van tour type
  const carImages = {
    car1: van,
    car2: saloon,
    car3: deluxe,
    // Add more car types and their corresponding images as needed
  };

  // Return the car image based on the van tour type
  // return carImages[type.toLowerCase()] || 'https://placehold.co/400';
  switch (type) {
    case "SUV":
      return carImages["car2"]; // Use this for SUV logic
    case "Saloon":
      return carImages["car1"];
    case "VIP Van": // Example of a different case, instead of repeating 'SUV'
      return carImages["car2"];
    default:
      return carImages["car2"]; // Default case
  }
};

const checkRoomPrice = async () => {
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
    // formitem.value.selling_price = res.data.room_price;
    // formitem.value.selling_price = res.data.room_price;
    // formitem.value.cost_price = res.data.room?.cost ? res.data.room.cost : 0;
  } else {
    console.log("need to fill");
  }
};

const calculateRateRoom = () => {
  if (formitem.value.checkin_date && formitem.value.checkout_date) {
    formitem.value.days = daysBetween(
      formitem.value.checkin_date,
      formitem.value.checkout_date
    );
  }
};

const score = (item) => {
  console.log(item, "item score");

  if (item?.total_amount && item?.total_cost_price) {
    let score =
      (item?.total_amount * 1 - item?.total_cost_price) /
      (item?.total_amount * 1);
    // return score.toFixed(4);
    if (score < 0.14) {
      return "low";
    } else if (score < 0.19) {
      return "medium";
    } else {
      return "high";
    }
  }
  return null;
};

const getDotClass = (item) => {
  const scoreValue = score(item);
  if (scoreValue === "low") return "bg-red-500 w-[30%]";
  if (scoreValue === "medium") return "bg-orange-500 w-[40%]";
  if (scoreValue === "high") return "bg-green-500 w-[60%]";
  return "bg-gray-500";
};

// Fix 5: Improved watch function for service_date and checkout_date
watch(
  () => [
    formitem.value.service_date,
    formitem.value.checkout_date,
    formitem.value.item_name,
  ],
  async ([newData, secData, thirdData]) => {
    if (formitem.value.product_type == "6") {
      if (formitem.value.service_date) {
        formitem.value.checkin_date = formitem.value.service_date;
      }

      if (
        formitem.value.item_name &&
        formitem.value.checkin_date &&
        formitem.value.checkout_date
      ) {
        formitem.value.comment = `Room : ${formitem.value.item_name}; Checkin : ${formitem.value.checkin_date} Checkout : ${formitem.value.checkout_date}`;
      }
    }

    if (formitem.value.checkin_date && formitem.value.checkout_date) {
      calculateRateRoom();
      await getRoomPeriod();
    }
  }
);

watch(
  () => [
    formitem.value.quantity,
    formitem.value.individual_pricing?.child?.quantity,
  ],
  ([newData, secData]) => {
    if (formitem.value.product_type == 4) {
      if (newData || secData) {
        // checkRoomPrice();
        formitem.value.comment = `Variation : ${formitem.value.item_name}. Adult : ${formitem.value.quantity}, Child : ${formitem.value.individual_pricing?.child?.quantity}`;
      }
    }
  }
);

watch(
  () => props.data?.items, // Watch for changes in items
  (newItems) => {
    console.log("props.data.items changed:", newItems);
    if (newItems) {
      itemList.value = newItems; // Update itemList when items change
    }
  },
  { deep: true, immediate: true } // Optional: immediate triggers the callback initially
);

watch(
  () => formitem.value.quantity, // Watch the quantity property
  (newValue) => {
    if (formitem.value.product_type == 4) {
      // Ensure newValue is a valid number
      // if (typeof newValue !== "number" || isNaN(newValue)) {
      //   console.error("Invalid quantity value:", newValue);
      //   return;
      // }

      // Ensure cost_price and selling_price are valid numbers
      const costPrice = parseFloat(formitem.value.cost_price) || 0;
      const sellingPrice = parseFloat(formitem.value.selling_price) || 0;

      // Ensure individual_pricing is an object
      if (
        !formitem.value.individual_pricing ||
        typeof formitem.value.individual_pricing !== "object"
      ) {
        formitem.value.individual_pricing = {
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
        }; // Initialize as an empty object
      }

      // Create a new object for individual_pricing.adult
      const updatedAdultPricing = {
        quantity: newValue * 1,
        selling_price: sellingPrice,
        cost_price: costPrice,
        total_cost_price: newValue * 1 * costPrice,
        amount: newValue * 1 * sellingPrice,
      };

      // Update formitem.value.individual_pricing.adult
      formitem.value.individual_pricing.adult = updatedAdultPricing;

      // Debugging logs (optional)
      console.log("====================================");
      console.log("Updated Adult Pricing:", formitem.value.individual_pricing);
      console.log("====================================");
    }
  },
  { immediate: true } // Optional: Trigger the watcher immediately on setup
);

// Fix 1: Improve the child quantity handling in watch function
watch(
  () => formitem.value.individual_pricing?.child?.quantity,
  (newValue) => {
    if (formitem.value.product_type == 4) {
      let costPrice = 0;
      let sellingPrice = 0;

      if (formitem.value.child_info?.length > 0) {
        costPrice =
          parseFloat(formitem.value.child_info[0]?.child_cost_price) || 0;
        sellingPrice =
          parseFloat(formitem.value.child_info[0]?.child_price) || 0;
      }

      const childQuantity = parseInt(newValue) || 0;

      const updatedChildPricing = {
        quantity: childQuantity,
        selling_price: sellingPrice,
        cost_price: costPrice,
        total_cost_price: childQuantity * costPrice,
        amount: childQuantity * sellingPrice,
      };

      formitem.value.individual_pricing.child = updatedChildPricing;
    }
  },
  { immediate: true }
);

onMounted(() => {
  console.log("====================================");
  console.log(props.data, "this is props");
  if (props.data) {
    itemList.value = props.data.items;
  }
  console.log("====================================");
});
</script>
<template>
  <div class="relative w-full h-full">
    <div
      class="sticky top-0 bg-white z-10 py-2 text-xs font-medium text-[#ff613c] flex justify-between items-center"
    >
      <p>Added items</p>
      <p>
        {{ data?.is_inclusive ? itemList.length - 1 : itemList.length }} items
      </p>
    </div>
    <div
      class="space-y-3 divide-y-2 pb-3 divide-gray-200"
      v-if="itemList.length > 0"
    >
      <div
        class="flex justify-start items-start gap-x-2 px-2 pt-2 rounded-lg"
        v-for="(i, index) in itemList ?? []"
        :key="i"
        :class="{
          hidden: i?.product_type == undefined,
          'bg-yellow-200/40': i?.cancellation === 'cancel_request',
          'bg-green-200/40': i?.cancellation === 'cancel_confirm',
        }"
      >
        <img
          :src="
            i?.product_image ? i?.product_image : 'https://placehold.co/400'
          "
          class="w-16 h-16 rounded-lg"
          alt=""
        />
        <div class="w-full space-y-0.5">
          <div class="flex justify-between items-center">
            <p class="text-xs font-medium">{{ i?.product_name }}</p>
            <div class="flex justify-end items-center gap-x-2">
              <!-- <ChatBubbleBottomCenterTextIcon
                v-if="i?.reservation_id && authStore?.isSuperAdmin"
                class="w-4 h-4 cursor-pointer text-red-600"
                @click="amendModalAction(i, index)"
              /> -->
              <img
                :src="AmendIcon"
                class="w-4 h-4 cursor-pointer"
                @click="amendModalAction(i, index)"
                v-if="i?.reservation_id && authStore?.isSuperAdmin"
                alt=""
              />
              <PencilSquareIcon
                class="w-4 h-4 cursor-pointer text-blue-800"
                @click="editAction(index, i)"
              />
              <XCircleIcon
                v-if="i?.reservation_id && authStore?.isSuperAdmin"
                class="w-4 h-4 cursor-pointer text-yellow-600"
                @click="cancellationAction(i, index)"
              />
              <TrashIcon
                v-if="!i?.reservation_id"
                class="w-4 h-4 cursor-pointer text-red-800"
                @click="getRemoveFunction(i?.product_id, index)"
              />
            </div>
          </div>
          <div
            v-if="i?.crm_id"
            class="flex justify-start items-center gap-x-2 pt-1"
            @click="
              () => {
                if (i?.product_type == 4) {
                  router.push(`/group-attraction?id=${i?.group_id}`);
                } else if (i?.product_type == 6) {
                  router.push(`/group-hotel?id=${i?.group_id}`);
                } else if (i?.product_type == 1) {
                  router.push(`/group-vantour?id=${i?.group_id}`);
                }
              }
            "
          >
            <DocumentCheckIcon
              class="w-5 h-5 text-[#ff613c] shadow-lg bg-white p-0.5 rounded-full"
            />
            <p
              v-if="i?.crm_id"
              class="text-[10px] cursor-pointer bg-[#ff613c] py-0.5 text-white px-2 inline-block rounded-md"
            >
              {{ i?.crm_id }}
            </p>
          </div>
          <p class="text-[10px] pt-1">{{ i?.item_name }}</p>
          <div class="flex justify-between items-center">
            <p class="text-[10px]">{{ i?.service_date }}</p>
            <p class="text-[10px]">
              Discount :
              <span class="font-medium text-xs">{{ i?.discount }} ฿</span>
            </p>
          </div>
          <div class="flex justify-between items-center">
            <p class="text-[10px]" v-if="i?.product_type != 4">
              {{ i?.quantity }} x {{ i?.selling_price }} ฿
            </p>
            <p class="text-[10px]" v-if="i?.product_type == 4">
              adult - {{ i?.quantity }} x {{ i?.selling_price }} ฿
              <br />
              child - {{ i?.individual_pricing?.child?.quantity }} x
              {{ i?.individual_pricing?.child?.selling_price }} ฿
            </p>
            <p class="text-[10px]">
              Amount :
              <span class="font-medium text-sm">{{ i?.total_amount }} ฿</span>
            </p>
          </div>
          <div class="flex items-center gap-2 pt-2" v-if="score(i) != null">
            <span :class="getDotClass(i)" class="h-2 rounded-full"></span>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="itemList.length == 0"
      class="text-xs font-medium text-gray-500 w-full h-[200px] flex justify-center items-center"
    >
      <p>please add items !</p>
    </div>
    <!-- choose room type modal -->
    <Modal :isOpen="openModal" @closeModal="closeModalAction">
      <DialogPanel
        class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h3"
          class="text-lg font-medium leading-6 text-gray-900 mb-1"
        >
          Choose Detail Type
        </DialogTitle>
        <div class="space-y-2.5 pb-3 border-b border-gray-300">
          <p class="text-xs text-gray-500">Please Choose detail type.</p>
        </div>
        <div class="h-[300px] overflow-y-scroll">
          <div class="bg-white p-2 rounded-xl border mt-2 shadow-sm space-y-2">
            <div class="flex justify-start items-start gap-x-2">
              <img
                src="https://placehold.co/400"
                class="w-16 h-16 rounded-lg"
                alt=""
              />

              <div class="w-full">
                <p class="text-sm font-medium pb-1 text-[#ff613c] line-clamp-1">
                  <!-- {{ formitem?.product_name }} -->
                  Change type
                </p>
                <p class="text-xs">{{ formitem.item_name }}</p>
                <div class="flex justify-between items-center">
                  <p class="text-xs">{{ formitem?.quantity }} Qty</p>
                  <div class="flex justify-end items-center">
                    <p
                      @click="openAddItemModalAction"
                      class="text-xs font-medium bg-[#ff613c] rounded-lg px-4 py-1 text-white"
                    >
                      Edit
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-white p-2 rounded-xl border mt-2 shadow-sm space-y-2">
            <div class="flex justify-start items-start gap-x-2">
              <img
                src="https://placehold.co/400"
                class="w-16 h-16 rounded-lg"
                alt=""
              />

              <div class="w-full">
                <p class="text-sm font-medium pb-1 line-clamp-1">
                  Booking information
                </p>
                <p class="text-xs">{{ formitem.service_date }}</p>
                <div class="flex justify-between items-center">
                  <p class="text-xs">
                    {{
                      formitem?.is_driver_collect ? "collect" : "bank tranfer"
                    }}
                  </p>
                  <div class="flex justify-end items-center">
                    <p
                      @click="goInfoModal"
                      class="text-xs font-medium bg-[#ff613c] rounded-lg px-4 py-1 text-white"
                    >
                      Edit
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-end items-center gap-x-2 pt-2">
          <button
            @click="closeModalAction"
            class="bg-white border border-gray-300 px-3 py-2.5 rounded-lg text-xs"
          >
            Cancel
          </button>
        </div>
      </DialogPanel>
    </Modal>

    <!-- choose room type modal -->
    <Modal :isOpen="addItemModal" @closeModal="cancelAction">
      <DialogPanel
        class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h3"
          class="text-lg font-medium leading-6 text-gray-900 mb-1"
        >
          Choose Type
        </DialogTitle>
        <div class="space-y-2.5 pb-3 border-b border-gray-300">
          <p class="text-xs text-gray-500">Please Choose the type.</p>
          <div class="relative w-full border border-gray-300 rounded-lg">
            <input
              type="text"
              v-model="search"
              class="bg-white w-full px-8 py-2 rounded-lg focus:outline-none text-[10px]"
              placeholder="Search Type"
            />
            <MagnifyingGlassIcon
              class="w-4 h-4 absolute text-[#ff613c] top-2 left-2"
            />
          </div>
        </div>
        <div class="h-[300px] overflow-y-scroll pr-2">
          <div
            class="bg-white p-2 rounded-xl border mt-2 shadow-sm space-y-2"
            v-for="i in formitem.car_list.length > 0 ? formitem.car_list : []"
            :key="i"
            @click="selectAction(i)"
            :class="
              formitem.car_id == i.id
                ? 'border-[#ff613c] bg-[#ff613c]/20'
                : 'border-gray-200'
            "
          >
            <div
              class="flex justify-start items-start gap-x-2"
              v-if="formitem?.product_type == 1"
            >
              <img
                :src="getCarImage(i.name)"
                class="w-16 h-16 rounded-lg"
                alt=""
              />
              <div class="flex justify-between items-start w-full h-16">
                <div class="space-y-1">
                  <p class="text-sm font-medium text-[#ff613c]">{{ i.name }}</p>
                  <p class="text-xs">{{ i.max_person }} Pax</p>
                </div>
                <div class="my-auto">
                  <p class="text-xs font-semibold whitespace-nowrap">
                    <span class="text-lg">{{ i?.price }}</span> / car
                  </p>
                </div>
              </div>
            </div>
            <div
              class="flex justify-start items-start gap-x-2"
              v-if="formitem?.product_type == 4"
            >
              <img
                src="https://placehold.co/400"
                class="w-16 h-16 rounded-lg"
                alt=""
              />
              <div class="flex justify-between items-start w-full">
                <div class="space-y-1">
                  <p class="text-xs font-medium text-[#ff613c]">{{ i.name }}</p>
                  <div class="flex justify-start items-center gap-x-1">
                    <p
                      class="text-[8px] text-white px-2 py-0.5 rounded-full inline-block"
                      :class="
                        i?.meta_data != null &&
                        JSON.parse(i?.meta_data)[0].is_main == 1
                          ? 'bg-green-500'
                          : 'hidden'
                      "
                    >
                      {{
                        i?.meta_data != null &&
                        JSON.parse(i?.meta_data)[0].is_show == 1
                          ? "main"
                          : "-"
                      }}
                    </p>
                    <p
                      class="text-[8px] text-white px-2 py-0.5 rounded-full inline-block"
                      :class="
                        i?.meta_data != null &&
                        JSON.parse(i?.meta_data)[0].is_show == 1
                          ? 'bg-green-500'
                          : 'hidden'
                      "
                    >
                      {{
                        i?.meta_data != null &&
                        JSON.parse(i?.meta_data)[0].is_show == 1
                          ? "show"
                          : "no show"
                      }}
                    </p>
                  </div>
                  <div>
                    <p
                      class="text-[10px] text-gray-800"
                      v-for="a in i?.including_services != null &&
                      i?.including_services != ''
                        ? JSON.parse(i?.including_services)
                        : []"
                      :key="a"
                    >
                      <span
                        class="h-1.5 w-1.5 mr-2 bg-gray-500 inline-block rounded-full"
                      ></span
                      >{{ a }}
                    </p>
                  </div>
                </div>
                <div class="my-auto">
                  <p class="text-xs font-semibold whitespace-nowrap">
                    <span class="text-lg">{{ i?.price }}</span> / ticket
                  </p>
                </div>
              </div>
            </div>
            <div
              class="flex justify-start items-start gap-x-2"
              v-if="formitem?.product_type == 6"
            >
              <img
                src="https://placehold.co/400"
                class="w-16 h-16 rounded-lg"
                alt=""
              />
              <div class="flex justify-between items-start w-full gap-x-2">
                <div class="space-y-1">
                  <p class="text-xs font-medium text-[#ff613c]">{{ i.name }}</p>
                  <p class="text-xs">{{ i.max_person }} Pax</p>
                  <p class="text-[10px] text-green-600">
                    {{ i?.has_breakfast == 1 ? "Breakfast included" : "" }}
                  </p>
                </div>
                <div class="my-auto">
                  <p class="text-xs font-semibold whitespace-nowrap">
                    <span class="text-lg">{{ i?.room_price }}</span> / night
                  </p>
                </div>
              </div>
            </div>
            <div v-if="formitem?.product_type == 7">
              <div class="flex justify-start items-start gap-x-2">
                <img
                  src="https://placehold.co/400"
                  class="w-16 h-16 object-cover rounded-lg"
                  alt=""
                />
                <div
                  class="flex justify-between items-start gap-x-2 w-full h-auto"
                >
                  <div class="pt-2">
                    <p class="text-xs font-medium">{{ i?.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-end items-center gap-x-2 pt-2">
          <button
            @click="cancelAction"
            class="bg-white border border-gray-300 px-3 py-2.5 rounded-lg text-xs"
          >
            Cancel
          </button>
          <button
            @click="goInfoModal"
            class="bg-[#ff613c] text-white px-3 py-2.5 rounded-lg text-xs"
            :class="formitem.car_id ? 'bg-[#ff613c]' : 'bg-gray-300'"
          >
            Next : Details
          </button>
        </div>
      </DialogPanel>
    </Modal>

    <!-- choose info booking modal -->
    <Modal :isOpen="addInfoModal" @closeModal="addInfoModal = false">
      <DialogPanel
        class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h3"
          class="text-lg font-medium leading-6 text-gray-900 mb-1"
        >
          Provide Booking Information
        </DialogTitle>
        <div class="space-y-2.5 pb-3 border-b border-gray-300">
          <p class="text-xs text-gray-500">
            Please provide booking information.
          </p>
        </div>
        <div class="h-[450px] overflow-y-scroll py-2 space-y-2 pr-1">
          <div v-if="formitem.product_type != 6" class="space-y-2">
            <div class="grid grid-cols-2 gap-x-2">
              <div class="space-y-1" v-if="formitem.product_type == 1">
                <label for="" class="text-[12px] text-gray-500"
                  >Pick up time <span class="text-red-800">*</span></label
                >
                <input
                  type="time"
                  :disabled="authStore?.isSuperAdmin ? false : true"
                  v-model="formitem.pickup_time"
                  name=""
                  class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                  id=""
                />
              </div>
              <div class="space-y-1">
                <label for="" class="text-[12px] text-gray-500"
                  >Service date <span class="text-red-800">*</span></label
                >
                <input
                  type="date"
                  :disabled="authStore?.isSuperAdmin ? false : true"
                  v-model="formitem.service_date"
                  @change="todayCheck"
                  name=""
                  class="border w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                  :class="
                    todayVali
                      ? 'border-gray-300'
                      : 'border-red-600 text-red-600'
                  "
                  id=""
                />
                <p v-if="!todayVali" class="text-[8px] text-red-600">
                  ! please change date
                </p>
              </div>
            </div>
            <div class="space-y-1" v-if="formitem.product_type == 1">
              <label for="" class="text-[12px] text-gray-500"
                >Pick up location <span class="text-red-800">*</span></label
              >
              <input
                type="text"
                :disabled="authStore?.isSuperAdmin ? false : true"
                v-model="formitem.pickup_location"
                name=""
                class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                id=""
              />
            </div>
            <div class="grid grid-cols-2 gap-x-2">
              <!-- <div class="space-y-1" v-if="formitem.product_type == 1">
                <label for="" class="text-[12px] text-gray-500"
                  >Payment Method <span class="text-red-800">*</span></label
                >
                <div class="flex justify-start flex-col items-start gap-x-2">
                  <select
                    name=""
                    v-model="formitem.is_driver_collect"
                    id=""
                    class="px-2 py-1.5 w-full rounded-lg text-xs border border-gray-300 focus:outline-none"
                  >
                    <option value=""></option>
                    <option :value="true">Driver Collect</option>
                    <option :value="false">Driver Not Collect</option>
                  </select>
                  <p class="text-xs pt-2">
                    Is Driver Collect ? <span class="text-red-800">*</span>
                  </p>
                </div>
              </div> -->
              <div class="space-y-1" v-if="formitem.product_type != 7">
                <label for="" class="text-[12px] text-gray-500"
                  >Qty - selling : {{ formitem.selling_price }}
                  <span class="text-red-800">*</span></label
                >
                <input
                  type="number"
                  :disabled="authStore?.isSuperAdmin ? false : true"
                  v-model="formitem.quantity"
                  name=""
                  class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                  id=""
                />
              </div>
              <div
                class="relative space-y-1"
                v-for="i in formitem.child_info ?? []"
                :key="i"
              >
                <div class="flex justify-between items-center pb-1 pt-1">
                  <label for="" class="text-xs text-gray-500 relative"
                    >Child Qty - selling : {{ i.child_price
                    }}<span class="text-red-800">*</span>
                  </label>
                  <p
                    :title="i?.info"
                    class="absolute top-0 cursor-pointer text-[10px] bg-[#FF613c] shadow-xl border border-white px-1 text-white rounded-full w-5 h-5 right-1 flex justify-center items-center custom-tooltip"
                  >
                    ?
                  </p>
                </div>
                <input
                  type="number"
                  v-model="formitem.individual_pricing.child.quantity"
                  name=""
                  class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                  id="adult_pricing"
                />
              </div>
              <!-- <div
                class="relative space-y-1"
                v-if="formitem.child_info.length == 0"
              >
                <div class="flex justify-between items-center pb-1">
                  <label for="" class="text-xs text-gray-500 relative"
                    >Child Qty N/A <span class="text-red-800">*</span>
                  </label>
                  <p
                    title="empty"
                    class="absolute top-0 cursor-pointer text-[10px] bg-[#FF613c] shadow-xl border border-white px-1 text-white rounded-full w-5 h-5 right-1 flex justify-center items-center custom-tooltip"
                  >
                    ?
                  </p>
                </div>
                <input
                  type="number"
                  disabled
                  name=""
                  class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                  id="adult_pricing"
                />
              </div> -->
              <div class="space-y-1 col-span-2">
                <label for="" class="text-[12px] text-gray-500"
                  >Ticket Info <span class="text-red-800">*</span></label
                >
                <div class="grid-cols-2 grid gap-2">
                  <div class="relative space-y-1">
                    <label for="" class="text-xs text-gray-500"
                      >Selling Price <span class="text-red-800">*</span></label
                    >
                    <input
                      type="number"
                      v-model="formitem.selling_price"
                      :disabled="authStore?.isSuperAdmin ? false : true"
                      name=""
                      class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                      id=""
                    />
                  </div>
                  <div
                    class="relative space-y-1"
                    v-if="formitem.product_type == 7"
                  >
                    <label for="" class="text-xs text-gray-500"
                      >Ticket Qty <span class="text-red-800">*</span></label
                    >
                    <input
                      type="number"
                      v-model="formitem.quantity"
                      :disabled="authStore?.isSuperAdmin ? false : true"
                      name=""
                      class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                      id=""
                    />
                    <p
                      @click="formitem.quantity++"
                      class="bg-[#ff613c]/10 text-[#ff613c] cursor-pointer inline-block px-2 z-50 rounded-lg absolute top-7 right-8"
                    >
                      +
                    </p>
                    <p
                      @click="formitem.quantity--"
                      v-if="formitem.quantity > 1"
                      class="bg-[#ff613c]/10 text-[#ff613c] cursor-pointer inline-block px-2 z-50 rounded-lg absolute top-7 right-1"
                    >
                      -
                    </p>
                    <p
                      v-if="formitem.quantity == 1"
                      class="bg-[#ff613c]/10 text-[#ff613c] cursor-pointer inline-block px-2 z-50 rounded-lg absolute top-7 right-1"
                    >
                      -
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-2" v-if="formitem.product_type == 6">
            <div class="space-y-1">
              <label for="" class="text-[12px] text-gray-500"
                >Check in date <span class="text-red-800">*</span></label
              >
              <input
                type="date"
                :disabled="authStore?.isSuperAdmin ? false : true"
                v-model="formitem.service_date"
                @change="todayCheck"
                name=""
                class="border w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                :class="
                  todayVali ? 'border-gray-300' : 'border-red-600 text-red-600'
                "
                id=""
              />
              <p v-if="!todayVali" class="text-[8px] text-red-600">
                ! please change date
              </p>
            </div>
            <div class="space-y-1">
              <label for="" class="text-[12px] text-gray-500"
                >Check out date <span class="text-red-800">*</span></label
              >
              <input
                type="date"
                :disabled="authStore?.isSuperAdmin ? false : true"
                v-model="formitem.checkout_date"
                name=""
                class="border w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                id=""
              />
            </div>
            <div class="space-y-1">
              <label for="" class="text-[12px] text-gray-500"
                >Total Rooms <span class="text-red-800">*</span></label
              >
              <input
                type="number"
                :disabled="authStore?.isSuperAdmin ? false : true"
                v-model="formitem.quantity"
                name=""
                class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                id=""
              />
            </div>
            <div class="space-y-1">
              <label for="" class="text-[12px] text-gray-500"
                >Qty <span class="text-red-800">*</span></label
              >
              <p
                class="border border-gray-300 bg-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
              >
                {{ formitem.days }} Night x {{ formitem.quantity }} Rooms
              </p>
            </div>
          </div>
          <div class="space-y-1">
            <label for="" class="text-[12px] text-gray-500">Discount</label>
            <input
              type="number"
              :disabled="authStore?.isSuperAdmin ? false : true"
              v-model="formitem.discount"
              name=""
              class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
              id=""
            />
          </div>
          <div v-if="formitem.product_type == 6">
            <div
              v-for="i in priceArray"
              :key="i"
              class="text-xs flex justify-between items-center"
            >
              <p class="whitespace-nowrap px-2">{{ i.date }}</p>
              <p class="h-0.5 w-full bg-black/10"></p>
              <p class="px-2">{{ i.sale_price }}</p>
              <p class="h-0.5 w-full bg-black/10"></p>
              <p class="px-2">{{ i.cost_price }}</p>
            </div>
          </div>

          <p class="text-xs text-gray-500">Total Price</p>
          <div>
            <p
              class="text-sm text-start border border-gray-300 py-1.5 rounded-lg px-2"
            >
              <span class="font-medium text-[#ff613c]"
                >{{
                  formitem.selling_price * 1 * formitem.quantity -
                  formitem.discount * 1 +
                  (formitem.individual_pricing?.child?.amount || 0) * 1
                }}
                ฿</span
              >
            </p>
          </div>
          <div class="space-y-1" v-if="formitem.product_type == 1">
            <label for="" class="text-[12px] text-gray-500"
              >Route Plan <span class="text-red-800">*</span></label
            >
            <textarea
              name=""
              :disabled="authStore?.isSuperAdmin ? false : true"
              v-model="formitem.route_plan"
              class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
              id=""
            ></textarea>
          </div>
          <div class="space-y-1">
            <label for="" class="text-[12px] text-gray-500"
              >Special Request <span class="text-red-800">*</span></label
            >
            <textarea
              name=""
              :disabled="authStore?.isSuperAdmin ? false : true"
              v-model="formitem.special_request"
              class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
              id=""
            ></textarea>
          </div>
          <div class="space-y-1">
            <label for="" class="text-[12px] text-gray-500"
              >Description <span class="text-red-800">*</span></label
            >
            <textarea
              name=""
              :disabled="authStore?.isSuperAdmin ? false : true"
              v-model="formitem.comment"
              class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
              id=""
            ></textarea>
          </div>
        </div>
        <div class="flex justify-end items-center gap-x-2 pt-2">
          <button
            @click="cancelAction"
            class="bg-white border border-gray-300 px-3 py-2.5 rounded-lg text-xs"
          >
            Cancel
          </button>
          <button
            v-if="formitem.product_id && todayVali"
            @click="cancelAction"
            class="bg-[#ff613c] text-white px-3 py-2.5 rounded-lg text-xs"
            :class="todayVali ? 'bg-[#ff613c]' : 'bg-gray-300'"
          >
            Add Item
          </button>
          <button
            v-if="!formitem.product_id || !todayVali"
            class="bg-[#ff613c] text-white px-3 py-2.5 rounded-lg text-xs"
            :class="todayVali ? 'bg-[#ff613c]' : 'bg-gray-300'"
          >
            Add Item
          </button>
        </div>
      </DialogPanel>
    </Modal>

    <!-- for cancellation modal -->
    <Modal :isOpen="cancellationModal" @closeModal="cancellationModalAction">
      <DialogPanel
        class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h3"
          class="text-lg font-medium leading-6 text-gray-900 mb-1"
        >
          Choose Cancellation Type
        </DialogTitle>
        <div class="space-y-2.5 pb-3 border-b border-gray-300">
          <p class="text-xs text-gray-500">Please Choose cancellation type.</p>
        </div>
        <div class="h-[160px] overflow-y-scroll flex justify-start items-start">
          <div class="space-y-4 py-6">
            <div class="flex justify-start items-center gap-x-2">
              <input
                type="radio"
                name="cancellation"
                id="cancel"
                class="mr-2 focus:outline-none w-5 h-5"
                @click="formitem.cancellation = 'cancel_request'"
                :checked="
                  formitem.cancellation != null &&
                  formitem.cancellation == 'cancel_request'
                    ? true
                    : false
                "
              />
              <label
                for="cancel"
                class="text-xs font-medium text-yellow-600 bg-yellow-200 px-2 py-0.5 rounded-full"
                >Cancel Request</label
              >
            </div>
            <div class="flex justify-start items-center gap-x-2">
              <input
                type="radio"
                name="cancellation"
                id="cancel"
                class="mr-2 focus:outline-none w-5 h-5"
                @click="formitem.cancellation = 'cancel_confirm'"
                :checked="
                  formitem.cancellation != null &&
                  formitem.cancellation == 'cancel_confirm'
                    ? true
                    : false
                "
              />
              <label
                for="cancel"
                class="text-xs font-medium text-green-600 bg-green-200 px-2 py-0.5 rounded-full"
                >Cancel Complete</label
              >
            </div>
            <div class="flex justify-start items-center gap-x-2">
              <input
                type="radio"
                name="cancellation"
                id="cancel"
                class="mr-2 focus:outline-none w-5 h-5"
                @click="formitem.cancellation = null"
                :checked="formitem.cancellation == null ? true : false"
              />
              <label
                for="cancel"
                class="text-xs font-medium bg-white-200 px-2 py-0.5 rounded-full"
                >Cancel remove & Cancel empty</label
              >
            </div>
          </div>
        </div>
        <div class="flex justify-center items-center gap-x-2 pt-2">
          <button
            @click="getRemoveFunction(formitem?.product_id, editIndex)"
            class="bg-red-500 border text-white border-red-300 px-3 py-1.5 shadow-lg rounded-md text-xs"
          >
            Delete Item
          </button>
          <button
            @click="cancellationModalAction"
            class="bg-green-500 border text-white border-green-300 px-3 py-1.5 shadow-lg rounded-md text-xs"
          >
            Change Item
          </button>
          <button
            @click="cancellationModalAction"
            class="bg-white border border-gray-300 px-3 py-1.5 shadow-lg rounded-md text-xs"
          >
            Close Modal
          </button>
        </div>
      </DialogPanel>
    </Modal>

    <Modal :isOpen="amendModal" @closeModal="amendCloseAction">
      <DialogPanel
        class="w-full max-w-4xl transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h3"
          class="text-lg font-medium leading-6 text-gray-900 mb-1"
        >
          Amend: {{ amendData?.crm_id }}
        </DialogTitle>
        <div class="space-y-2.5 pb-3 border-b border-gray-300">
          <p class="text-xs text-gray-500">Please Choose amend .</p>
        </div>
        <AmendCreate
          :amendData="amendData"
          :amendCloseAction="amendCloseAction"
        />
      </DialogPanel>
    </Modal>
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
</style>
