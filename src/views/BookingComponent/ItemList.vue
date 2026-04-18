<script setup>
import {
  TrashIcon,
  PencilSquareIcon,
  XCircleIcon,
  DocumentCheckIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  TableCellsIcon,
} from "@heroicons/vue/24/outline";
import { onMounted, defineProps, ref, defineEmits, watch } from "vue";
import Modal from "../../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import van from "../../../public/1.png";
import saloon from "../../../public/2.png";
import deluxe from "../../../public/3.png";
import { useAuthStore } from "../../stores/auth";
import { useHotelStore } from "../../stores/hotel";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { daysBetween } from "../help/DateBetween";
import AmendCreate from "./AmendCreate.vue";
import AmendIcon from "../../assets/refresh-button.png";
import { useToast } from "vue-toastification";
import ItemSummaryTable from "./ItemSummaryTable.vue";

const props = defineProps({
  data: Object,
  grand: Number || String,
});
const emit = defineEmits(["remove"]);
const route = useRoute();
const itemList = ref([]);
const editIndex = ref("");
const openModal = ref(false);
const authStore = useAuthStore();
const toast = useToast();
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
  child_price: 0,
  child_cost: 0,
  child_quantity: 0,
  child_total_selling_price: 0,
  child_total_cost: 0,
  adult_price: 0,
  adult_cost: 0,
  adult_quantity: 0,
  adult_total_selling_price: 0,
  adult_total_cost: 0,
});

const roomRates = ref({});

const getRemoveFunction = (id, index) => {
  emit("remove", { id, index });
  cancellationModal.value = false;
};

const router = useRouter();
const cancellationModal = ref(false);

// ── Amend Modal ──
const amendModal = ref(false);
const amendData = ref(null);
// "history" | "create"  — which tab is active in the amend modal
const amendTab = ref("history");

const amendModalAction = (data) => {
  amendData.value = data;
  // If there are existing amendments → show history first, else go straight to create
  amendTab.value =
    data?.amend_info && data.amend_info.length > 0 ? "history" : "create";
  amendModal.value = true;
};

const amendCloseAction = () => {
  amendModal.value = false;
  amendData.value = null;
};

// ── Helpers ──
const amendStatusLabel = (status) => {
  switch (status) {
    case "pending":
      return { text: "Pending", cls: "bg-yellow-100 text-yellow-700" };
    case "approved":
      return { text: "Approved", cls: "bg-green-100 text-green-700" };
    case "rejected":
      return { text: "Rejected", cls: "bg-red-100 text-red-700" };
    default:
      return { text: status, cls: "bg-gray-100 text-gray-600" };
  }
};

const formatTs = (ts) => {
  if (!ts) return "-";
  return new Date(ts).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const changeLabel = (key) => {
  const map = {
    service_date: "Service Date",
    checkout_date: "Checkout Date",
    quantity: "Quantity",
    child_quantity: "Child Qty",
    selling_price: "Selling Price",
    cost_price: "Cost Price",
    total_amount: "Total Amount",
    total_cost_price: "Total Cost",
    variation_id: "Variation ID",
    variation_name: "Variation",
    delete: "Delete Request",
  };
  return map[key] ?? key;
};

const tableModal = ref(false);

// keys we want to display in the diff table (excluding internal previous_* fields)
const diffKeys = (changes) =>
  Object.keys(changes).filter(
    (k) =>
      !k.startsWith("current_") && changes[k] !== "" && changes[k] !== null,
  );

const prevValue = (history, key) => {
  const prev = history.previous_values ?? {};
  return prev[`current_${key}`] ?? "-";
};

// ── Cancellation ──
const cancellationAction = (data, index) => {
  editIndex.value = index;
  formitem.value = data;
  cancellationModal.value = true;
};

const cancellationModalAction = () => {
  cancellationModal.value = false;
};

// ── Edit ──
const editAction = (index, data) => {
  roomRates.value = {};
  editIndex.value = index;
  formitem.value = data;
  openModal.value = true;
};

const closeModalAction = () => {
  roomRates.value = {};
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
    child_price: 0,
    child_cost: 0,
    child_quantity: 0,
    child_total_selling_price: 0,
    child_total_cost: 0,
    adult_price: 0,
    adult_cost: 0,
    adult_quantity: 0,
    adult_total_selling_price: 0,
    adult_total_cost: 0,
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

const openAddItemModalAction = () => {
  openModal.value = false;
  addItemModal.value = true;
};

const selectAction = (item) => {
  formitem.value.car_id = item.id;
  if (formitem.value.product_type != 7) {
    formitem.value.item_name = item.name;
    if (formitem.value.product_type == 1) {
      let des = formitem.value.comment.replace(/^[^;]*;\s*/, "");
      formitem.value.comment = `Car Type : ${item.name} ; ${des}`;
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
        formitem.value.individual_pricing.child = {
          quantity: 0,
          selling_price: 0,
          cost_price: 0,
          total_cost_price: 0,
          amount: 0,
        };
      }
    }
  }
  if (formitem.value.product_type == 7) {
    formitem.value.item_name = item.description;
    formitem.value.comment = `Ticket : ${formitem.value.item_name}`;
  }
  getFunction();
};

const addOnList = ref([]);

const goInfoModal = () => {
  todayCheck();
  addItemModal.value = false;
  openModal.value = false;
  addInfoModal.value = true;
};

const formatDate = (date) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const isAfterToday = (dateStr) => {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  return d >= today;
};

const todayVali = ref(false);
const todayCheck = () => {
  if (!formitem.value.service_date) {
    todayVali.value = false;
    return;
  }
  todayVali.value = isAfterToday(formitem.value.service_date);
};

const priceArray = ref([]);
const getRoomPeriod = async () => {
  if (
    formitem.value.car_id &&
    formitem.value.checkin_date &&
    formitem.value.checkout_date
  ) {
    try {
      const res = await hotelStore.getRoomPrice(
        {
          checkin_date: formitem.value.checkin_date,
          checkout_date: formitem.value.checkout_date,
        },
        formitem.value.car_id,
      );
      priceArray.value = res.data.daily_pricing;
      formitem.value.selling_price = res.data.total_sale_price;
      formitem.value.cost_price = res.data.total_cost_price;
      roomRates.value = res.data.room_rates || {};
    } catch {
      toast.error("This room is deleted so can't change");
    }
  }
};

// Selected room object from car_list
const selectedRoom = computed(
  () =>
    formitem.value.car_list.find((r) => r.id === formitem.value.car_id) ?? null,
);

// null = no stock restriction (non-partner or is_extra)
const minAvailableStock = computed(() => {
  // Only applies to hotel product type
  if (formitem.value.product_type != 6) return null;
  // Extra bed / add-on — no restriction
  if (selectedRoom.value?.is_extra == 1) return null;
  // No room_rates = non-partner hotel
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

const getFunction = () => {
  const quantity = parseFloat(formitem.value.quantity) || 0;
  const sellingPrice = parseFloat(formitem.value.selling_price) || 0;
  const costPrice = parseFloat(formitem.value.cost_price) || 0;
  const discount = parseFloat(formitem.value.discount) || 0;
  const days = parseFloat(formitem.value.days) || 1;
  const childAmount = formitem.value.individual_pricing?.child
    ? parseFloat(formitem.value.individual_pricing.child.amount) || 0
    : 0;
  const childCostPrice = formitem.value.individual_pricing?.child
    ? parseFloat(formitem.value.individual_pricing.child.total_cost_price) || 0
    : 0;

  if (days > 1) {
    formitem.value.total_amount = quantity * sellingPrice - discount;
    formitem.value.total_cost_price = quantity * costPrice;
  } else {
    formitem.value.total_amount =
      sellingPrice * quantity - discount + childAmount;
    formitem.value.total_cost_price = quantity * costPrice + childCostPrice;
  }
};

const cancelAction = () => {
  roomRates.value = {};
  getFunction();
  closeModalAction();
  addItemModal.value = false;
  addInfoModal.value = false;
};

const getCarImage = (type) => {
  const imgs = { car1: van, car2: saloon, car3: deluxe };
  switch (type) {
    case "SUV":
      return imgs.car2;
    case "Saloon":
      return imgs.car1;
    case "VIP Van":
      return imgs.car2;
    default:
      return imgs.car2;
  }
};

const calculateRateRoom = () => {
  if (formitem.value.checkin_date && formitem.value.checkout_date)
    formitem.value.days = daysBetween(
      formitem.value.checkin_date,
      formitem.value.checkout_date,
    );
};

const score = (item) => {
  if (item?.total_amount && item?.total_cost_price) {
    const s =
      (item.total_amount * 1 - item.total_cost_price) / (item.total_amount * 1);
    if (s < 0.14) return "low";
    if (s < 0.19) return "medium";
    return "high";
  }
  return null;
};

const getDotClass = (item) => {
  const v = score(item);
  if (v === "low") return "bg-red-500 w-[30%]";
  if (v === "medium") return "bg-orange-500 w-[40%]";
  if (v === "high") return "bg-green-500 w-[60%]";
  return "bg-gray-500";
};

watch(
  () => [
    formitem.value.service_date,
    formitem.value.checkout_date,
    formitem.value.item_name,
  ],
  async ([, ,]) => {
    if (formitem.value.product_type == "6") {
      if (formitem.value.service_date)
        formitem.value.checkin_date = formitem.value.service_date;
      if (
        formitem.value.item_name &&
        formitem.value.checkin_date &&
        formitem.value.checkout_date
      )
        formitem.value.comment = `Room : ${formitem.value.item_name}; Checkin : ${formitem.value.checkin_date} Checkout : ${formitem.value.checkout_date}`;
    }
    if (formitem.value.checkin_date && formitem.value.checkout_date) {
      calculateRateRoom();
      await getRoomPeriod();
    }
  },
);

watch(
  () => [formitem.value.quantity, formitem.value.child_quantity],
  ([newData, secData]) => {
    if (formitem.value.product_type == 4 && (newData || secData))
      formitem.value.comment = `Variation : ${formitem.value.item_name}. Adult : ${formitem.value.quantity}, Child : ${formitem.value.child_quantity}`;
  },
);

watch(
  () => props.data?.items,
  (newItems) => {
    if (newItems) itemList.value = newItems;
  },
  { deep: true, immediate: true },
);

watch(
  () => formitem.value.quantity,
  (newValue) => {
    if (formitem.value.product_type == 4) {
      const costPrice = parseFloat(formitem.value.cost_price) || 0;
      const sellingPrice = parseFloat(formitem.value.selling_price) || 0;
      if (
        !formitem.value.individual_pricing ||
        typeof formitem.value.individual_pricing !== "object"
      )
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
        };
      // formitem.value.individual_pricing.adult = {
      //   quantity: newValue * 1,
      //   selling_price: sellingPrice,
      //   cost_price: costPrice,
      //   total_cost_price: newValue * 1 * costPrice,
      //   amount: newValue * 1 * sellingPrice,
      // };
      formitem.value.adult_price = sellingPrice;
      formitem.value.adult_cost = costPrice;
      formitem.value.adult_quantity = newValue * 1;
      formitem.value.adult_total_selling_price = newValue * 1 * sellingPrice;
      formitem.value.adult_total_cost = newValue * 1 * costPrice;
    }
  },
  { immediate: true },
);

watch(
  () => formitem.value.child_quantity,
  (newValue) => {
    if (formitem.value.product_type == 4) {
      // ✅ child_info မရောက်သေးလျှင် skip လုပ်သည်
      if (
        !formitem.value.child_info ||
        formitem.value.child_info.length === 0
      ) {
        return;
      }

      const costPrice =
        parseFloat(formitem.value.child_info[0]?.child_cost_price) || 0;
      const sellingPrice =
        parseFloat(formitem.value.child_info[0]?.child_price) || 0;
      const qty = parseInt(newValue) || 0;

      // formitem.value.individual_pricing.child = {
      //   quantity: qty,
      //   selling_price: sellingPrice, // ✅ မှန်ကန်သော price
      //   cost_price: costPrice, // ✅ မှန်ကန်သော cost
      //   total_cost_price: qty * costPrice, // ✅ မှန်ကန်
      //   amount: qty * sellingPrice, // ✅ မှန်ကန်
      // };
      formitem.value.child_price = sellingPrice;
      formitem.value.child_cost = costPrice;
      formitem.value.child_quantity = qty;
      formitem.value.child_total_selling_price = qty * sellingPrice;
      formitem.value.child_total_cost = qty * costPrice;
    }
  },
);

const calculatePrice = computed(() => {
  if (!props.data?.items) return 0;
  return props.data.items
    .filter((item) => item?.product_type != undefined) // ← skip invalid items
    .reduce((total, item) => {
      return total + (parseFloat(item.total_amount) || 0);
    }, 0);
});

// Map itemList → ItineraryTable orderedItems format
const mappedItemsForTable = computed(() => {
  return itemList.value
    .filter((i) => i?.product_type !== undefined)
    .map((i, idx) => {
      // ── Detect which shape we have ──
      // "rich" shape = has sellingPrice (already mapped, e.g. from package builder)
      // "raw" shape  = has total_amount (from reservation itemList)
      const isRich = i.sellingPrice !== undefined;

      const type =
        i.product_type == 1 || i._type === "van"
          ? "van"
          : i.product_type == 6 || i._type === "hotel"
            ? "hotel"
            : "attraction";

      const base = {
        _uid: i._uid ?? `item-${idx}`,
        _order: i._order ?? idx,
        _type: type,
        dayNumber: i.dayNumber ?? 1,
        serviceDate: i.serviceDate ?? i.service_date ?? "",
        // ── Selling / cost: prefer rich fields, fall back to raw ──
        sellingPrice: isRich
          ? Number(i.sellingPrice) || 0
          : Number(i.total_amount) || 0,
        costPrice: isRich
          ? Number(i.costPrice) || 0
          : Number(i.total_cost_price) || 0,
      };

      // ── VAN ──
      if (type === "van") {
        return {
          ...base,
          vanTourName: i.vanTourName ?? i.product_name,
          carName: i.carName ?? i.item_name,
          city: i.city ?? "",
          cars: i.cars ?? i.quantity ?? 1,
        };
      }

      // ── HOTEL ──
      if (type === "hotel") {
        return {
          ...base,
          name: i.name ?? i.product_name,
          roomName: i.roomName ?? i.item_name,
          nights: i.nights ?? i.days ?? 1,
          rooms: i.rooms ?? i.quantity ?? 1,
          checkIn: i.checkIn ?? i.checkin_date ?? i.service_date ?? "",
          checkOut: i.checkOut ?? i.checkout_date ?? "",
          checkInDay: i.checkInDay ?? i.dayNumber ?? 1,
        };
      }

      // ── ATTRACTION ──
      const adults = isRich ? (i.adults ?? i.quantity ?? 1) : (i.quantity ?? 1);
      const children = isRich
        ? (i.children ?? i.individual_pricing?.child?.quantity ?? 0)
        : (i.individual_pricing?.child?.quantity ?? 0);

      // unit prices — rich shape already has them; raw shape uses selling_price
      const adultPrice = isRich
        ? Number(i.adultPrice) || 0
        : Number(i.selling_price) || 0;
      const adultCostPrice = isRich
        ? Number(i.adultCostPrice) || 0
        : Number(i.cost_price) || 0;
      const childPrice = isRich
        ? i.childPrice
        : (i.individual_pricing?.child?.selling_price ?? "null");
      const childCostPrice = isRich
        ? i.childCostPrice
        : i.individual_pricing?.child?.selling_price
          ? String(i.individual_pricing.child.selling_price)
          : "null";

      return {
        ...base,
        name: i.name ?? i.product_name,
        adults,
        children,
        adultPrice,
        adultCostPrice,
        childPrice,
        childCostPrice,
        unitSellingPrice: adultPrice,
        city: i.city ?? "",
        productType: i.productType ?? "entrance_ticket",
        variation: i.variation ?? i.item_name ?? "",
      };
    });
});

const earliestServiceDate = computed(() => {
  const dates = itemList.value
    .map((i) => i.service_date || i.checkin_date)
    .filter(Boolean)
    .sort();
  return dates[0] ?? new Date().toISOString().split("T")[0];
});

const totalUniqueDays = computed(() => {
  const days = new Set(mappedItemsForTable.value.map((i) => i.dayNumber));
  return Math.max(...days, 1);
});

onMounted(() => {
  if (props.data) itemList.value = props.data.items;
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
      <button
        v-if="data?.is_inclusive"
        @click="tableModal = true"
        class="bg-[#ff613c] text-white px-2 py-1 rounded-lg text-[10px] flex items-center gap-1"
      >
        <TableCellsIcon class="w-3 h-3" />
        Table View
      </button>
    </div>

    <!-- ── Itinerary Table Modal ── -->
    <Modal :isOpen="tableModal" @closeModal="tableModal = false">
      <DialogPanel
        class="w-full max-w-6xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all"
      >
        <!-- Header -->
        <div class="flex justify-between items-center bg-[#ff613c] px-4 py-2.5">
          <p class="text-white font-medium text-sm">Itinerary Table View</p>
          <XCircleIcon
            class="w-5 h-5 text-white cursor-pointer"
            @click="tableModal = false"
          />
        </div>

        <!-- Table content -->
        <div class="p-4 max-h-[80vh] overflow-y-auto">
          <ItemSummaryTable :items="itemList" :grand="grand" />
        </div>
      </DialogPanel>
    </Modal>

    <div
      class="space-y-3 divide-y-2 pb-3 divide-gray-200"
      v-if="itemList.length > 0"
    >
      <div
        v-for="(i, index) in itemList ?? []"
        :key="i"
        class="flex justify-start items-start gap-x-2 px-2 pt-2 rounded-lg"
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
          <!-- top row: name + actions -->
          <div class="flex justify-between items-center">
            <p class="text-xs font-medium">{{ i?.product_name }}</p>
            <div class="flex justify-end items-center gap-x-2">
              <!-- Amend icon + badge -->
              <div class="relative" v-if="i?.reservation_id">
                <img
                  :src="AmendIcon"
                  class="w-4 h-4 cursor-pointer"
                  @click="amendModalAction(i)"
                  alt="Amend"
                />
                <!-- Amendment count badge -->
                <span
                  v-if="i?.amend_info && i.amend_info.length > 0"
                  class="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none"
                >
                  {{ i.amend_info.length }}
                </span>
              </div>

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

          <!-- CRM ID -->
          <div
            v-if="i?.crm_id"
            class="flex justify-start items-center gap-x-2 pt-1 cursor-pointer"
            @click="
              () => {
                if (i?.product_type == 4)
                  router.push(`/group-attraction?id=${i?.group_id}`);
                else if (i?.product_type == 6)
                  router.push(`/group-hotel?id=${i?.group_id}`);
                else if (i?.product_type == 1)
                  router.push(`/group-vantour?id=${i?.group_id}`);
              }
            "
          >
            <DocumentCheckIcon
              class="w-5 h-5 text-[#ff613c] shadow-lg bg-white p-0.5 rounded-full"
            />
            <p
              class="text-[10px] bg-[#ff613c] py-0.5 text-white px-2 inline-block rounded-md"
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
              adult - {{ i?.quantity }} x {{ i?.selling_price }} ฿<br />
              child - {{ i?.child_quantity }} x {{ i?.child_price }} ฿
            </p>
            <p class="text-[10px]">
              Amount :
              <span class="font-medium text-sm">{{ i?.total_amount }} ฿</span>
            </p>
          </div>

          <!-- Amendment status pills -->
          <div
            v-if="i?.amend_info && i.amend_info.length > 0"
            class="flex flex-wrap gap-1 pt-1"
          >
            <span
              v-for="am in i.amend_info"
              :key="am.id"
              class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-medium"
              :class="amendStatusLabel(am.amend_status).cls"
            >
              <span v-if="am.is_delete">🗑</span>
              {{ amendStatusLabel(am.amend_status).text }}
            </span>
          </div>

          <div class="flex items-center gap-2 pt-2" v-if="score(i) != null">
            <span :class="getDotClass(i)" class="h-2 rounded-full"></span>
          </div>
        </div>
      </div>
    </div>

    <div
      class="sticky bottom-0 py-2 bg-white border-t border-black/10 text-sm"
      v-if="data?.is_inclusive"
    >
      Item Total Price : {{ Number(calculatePrice).toLocaleString() }} ฿
    </div>

    <div
      v-if="itemList.length == 0"
      class="text-xs font-medium text-gray-500 w-full h-[200px] flex justify-center items-center"
    >
      <p>please add items !</p>
    </div>

    <!-- ── Edit type modal ── -->
    <Modal :isOpen="openModal" @closeModal="closeModalAction">
      <DialogPanel
        class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h3"
          class="text-lg font-medium leading-6 text-gray-900 mb-1"
          >Choose Detail Type</DialogTitle
        >
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
                  Change type
                </p>
                <p class="text-xs">{{ formitem.item_name }}</p>
                <div class="flex justify-between items-center">
                  <p class="text-xs">{{ formitem?.quantity }} Qty</p>
                  <p
                    @click="openAddItemModalAction"
                    class="text-xs font-medium bg-[#ff613c] rounded-lg px-4 py-1 text-white cursor-pointer"
                  >
                    Edit
                  </p>
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
                      formitem?.is_driver_collect ? "collect" : "bank transfer"
                    }}
                  </p>
                  <p
                    @click="goInfoModal"
                    class="text-xs font-medium bg-[#ff613c] rounded-lg px-4 py-1 text-white cursor-pointer"
                  >
                    Edit
                  </p>
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

    <!-- ── Choose type modal ── -->
    <Modal :isOpen="addItemModal" @closeModal="cancelAction">
      <DialogPanel
        class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h3"
          class="text-lg font-medium leading-6 text-gray-900 mb-1"
          >Choose Type</DialogTitle
        >
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
            class="bg-white p-2 rounded-xl border mt-2 shadow-sm space-y-2 cursor-pointer"
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
            <div
              class="flex justify-start items-start gap-x-2"
              v-if="formitem?.product_type == 4"
            >
              <img
                src="https://placehold.co/400"
                class="w-16 h-16 rounded-lg"
                alt=""
              />
              <div class="flex justify-between items-start w-full gap-x-2">
                <div class="space-y-1">
                  <p class="text-xs font-medium text-[#ff613c]">{{ i.name }}</p>
                  <p class="text-[10px] text-gray-500">{{ i.description }}</p>
                </div>
                <div class="my-auto text-right">
                  <p class="text-xs font-semibold whitespace-nowrap">
                    <span class="text-lg">{{ i?.price }}</span> / person
                  </p>
                  <p class="text-[10px] text-gray-400" v-if="i?.cost_price">
                    Cost: {{ i.cost_price }}
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
                <div class="pt-2">
                  <p class="text-xs font-medium">{{ i?.description }}</p>
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
            class="text-white px-3 py-2.5 rounded-lg text-xs"
            :class="formitem.car_id ? 'bg-[#ff613c]' : 'bg-gray-300'"
          >
            Next : Details
          </button>
        </div>
      </DialogPanel>
    </Modal>

    <!-- ── Booking info modal ── -->
    <Modal :isOpen="addInfoModal" @closeModal="addInfoModal = false">
      <DialogPanel
        class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h3"
          class="text-lg font-medium leading-6 text-gray-900 mb-1"
          >Provide Booking Information</DialogTitle
        >
        <div class="space-y-2.5 pb-3 border-b border-gray-300">
          <p class="text-xs text-gray-500">
            Please provide booking information.
          </p>
        </div>
        <div class="h-[450px] overflow-y-scroll py-2 space-y-2 pr-1">
          <div v-if="formitem.product_type != 6" class="space-y-2">
            <div class="grid grid-cols-2 gap-x-2">
              <div class="space-y-1" v-if="formitem.product_type == 1">
                <label class="text-[12px] text-gray-500">Pick up time</label>
                <input
                  type="time"
                  :disabled="!authStore?.isSuperAdmin"
                  v-model="formitem.pickup_time"
                  class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                />
              </div>
              <div class="space-y-1">
                <label class="text-[12px] text-gray-500"
                  >Service date <span class="text-red-800">*</span></label
                >
                <input
                  type="date"
                  :disabled="!authStore?.isSuperAdmin"
                  v-model="formitem.service_date"
                  @change="todayCheck"
                  class="border w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                  :class="
                    todayVali
                      ? 'border-gray-300'
                      : 'border-red-600 text-red-600'
                  "
                />
                <p v-if="!todayVali" class="text-[8px] text-red-600">
                  ! please change date
                </p>
              </div>
            </div>
          </div>
          <div
            v-if="formitem.product_type == 4"
            class="space-y-3 border border-gray-200 rounded-lg p-3 bg-gray-50"
          >
            <p class="text-xs font-semibold text-[#ff613c]">Ticket Pricing</p>

            <!-- Adult -->
            <div class="grid grid-cols-3 gap-2 items-center">
              <p class="text-xs text-gray-600 font-medium">Adult</p>
              <div class="space-y-1">
                <label class="text-[10px] text-gray-400">Qty</label>
                <input
                  type="number"
                  v-model="formitem.quantity"
                  min="0"
                  class="border border-gray-300 w-full px-2 py-1.5 rounded-lg text-xs focus:outline-none"
                />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] text-gray-400">Price</label>
                <input
                  type="number"
                  disabled
                  v-model="formitem.selling_price"
                  class="border border-gray-300 w-full px-2 py-1.5 rounded-lg text-xs focus:outline-none"
                />
              </div>
            </div>

            <!-- Child (only show if child_info exists) -->
            <div
              v-if="formitem.child_info && formitem.child_info.length > 0"
              class="grid grid-cols-3 gap-2 items-center"
            >
              <div>
                <p class="text-xs text-gray-600 font-medium">Child</p>
                <p class="text-[9px] text-gray-400">
                  {{ formitem.child_info[0]?.info }}
                </p>
              </div>
              <div class="space-y-1">
                <label class="text-[10px] text-gray-400">Qty</label>
                <input
                  type="number"
                  v-model="formitem.child_quantity"
                  min="0"
                  class="border border-gray-300 w-full px-2 py-1.5 rounded-lg text-xs focus:outline-none"
                />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] text-gray-400">Price</label>
                <input
                  type="number"
                  disabled
                  :value="formitem.child_info[0]?.child_price"
                  class="border border-gray-300 w-full px-2 py-1.5 rounded-lg text-xs focus:outline-none bg-gray-100"
                />
              </div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-2" v-if="formitem.product_type == 6">
            <div class="space-y-1">
              <label class="text-[12px] text-gray-500">Check in date</label>
              <input
                type="date"
                :disabled="!authStore?.isSuperAdmin"
                v-model="formitem.service_date"
                @change="todayCheck"
                class="border w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
              />
            </div>
            <div class="space-y-1">
              <label class="text-[12px] text-gray-500">Check out date</label>
              <input
                type="date"
                :disabled="!authStore?.isSuperAdmin"
                v-model="formitem.checkout_date"
                class="border w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
              />
            </div>
            <!-- <div class="space-y-1">
              <label class="text-[12px] text-gray-500">Total Rooms</label>
              <input
                type="number"
                :disabled="!authStore?.isSuperAdmin"
                v-model="formitem.quantity"
                class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
              />
            </div> -->
            <div class="space-y-1">
              <label class="text-[12px] text-gray-500">
                Total Rooms <span class="text-red-800">*</span>
              </label>
              <input
                type="number"
                :disabled="authStore?.isSuperAdmin ? false : true"
                v-model="formitem.quantity"
                name=""
                class="border w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                :class="
                  isOutOfStock
                    ? 'border-red-500 text-red-600'
                    : 'border-gray-300'
                "
                id=""
              />
              <!-- Stock hint — only shows for partner hotels -->
              <p
                v-if="minAvailableStock !== null"
                class="text-[10px] font-medium"
                :class="isOutOfStock ? 'text-red-500' : 'text-gray-400'"
              >
                {{
                  isOutOfStock
                    ? `⚠ Only ${minAvailableStock} room${minAvailableStock !== 1 ? "s" : ""} available`
                    : `${minAvailableStock} room${minAvailableStock !== 1 ? "s" : ""} available`
                }}
              </p>
            </div>
          </div>
          <div class="space-y-1">
            <label class="text-[12px] text-gray-500">Discount</label>
            <input
              type="number"
              :disabled="!authStore?.isSuperAdmin"
              v-model="formitem.discount"
              class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
            />
          </div>
          <div class="space-y-1">
            <label class="text-[12px] text-gray-500">Description</label>
            <textarea
              :disabled="!authStore?.isSuperAdmin"
              v-model="formitem.comment"
              class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
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
            @click="!isOutOfStock && cancelAction()"
            :disabled="isOutOfStock || !todayVali || !formitem.product_id"
            class="px-3 py-2.5 rounded-lg text-xs text-white transition-colors"
            :class="
              isOutOfStock || !todayVali || !formitem.product_id
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-[#ff613c]'
            "
          >
            {{
              isOutOfStock
                ? `Out of Stock (max ${minAvailableStock})`
                : "Add Item"
            }}
          </button>
        </div>
      </DialogPanel>
    </Modal>

    <!-- ── Cancellation modal ── -->
    <Modal :isOpen="cancellationModal" @closeModal="cancellationModalAction">
      <DialogPanel
        class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h3"
          class="text-lg font-medium leading-6 text-gray-900 mb-1"
          >Choose Cancellation Type</DialogTitle
        >
        <div class="space-y-2.5 pb-3 border-b border-gray-300">
          <p class="text-xs text-gray-500">Please Choose cancellation type.</p>
        </div>
        <div class="h-[160px] overflow-y-scroll flex justify-start items-start">
          <div class="space-y-4 py-6">
            <div class="flex justify-start items-center gap-x-2">
              <input
                type="radio"
                name="cancellation"
                class="mr-2 focus:outline-none w-5 h-5"
                @click="formitem.cancellation = 'cancel_request'"
                :checked="formitem.cancellation == 'cancel_request'"
              />
              <label
                class="text-xs font-medium text-yellow-600 bg-yellow-200 px-2 py-0.5 rounded-full"
                >Cancel Request</label
              >
            </div>
            <div class="flex justify-start items-center gap-x-2">
              <input
                type="radio"
                name="cancellation"
                class="mr-2 focus:outline-none w-5 h-5"
                @click="formitem.cancellation = 'cancel_confirm'"
                :checked="formitem.cancellation == 'cancel_confirm'"
              />
              <label
                class="text-xs font-medium text-green-600 bg-green-200 px-2 py-0.5 rounded-full"
                >Cancel Complete</label
              >
            </div>
            <div class="flex justify-start items-center gap-x-2">
              <input
                type="radio"
                name="cancellation"
                class="mr-2 focus:outline-none w-5 h-5"
                @click="formitem.cancellation = null"
                :checked="formitem.cancellation == null"
              />
              <label class="text-xs font-medium px-2 py-0.5 rounded-full"
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

    <!-- ══════════════════════════════════════════════════════════
         AMEND MODAL — History + Create tabs
    ══════════════════════════════════════════════════════════ -->
    <Modal :isOpen="amendModal" @closeModal="amendCloseAction">
      <DialogPanel
        class="w-full max-w-4xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all"
      >
        <!-- Header -->
        <div class="flex justify-between items-center bg-[#ff613c] px-4 py-2.5">
          <div>
            <p class="text-white font-medium text-sm">
              Amend: {{ amendData?.crm_id }}
            </p>
            <p class="text-white/70 text-[10px]">
              {{ amendData?.product_name }} — {{ amendData?.item_name }}
            </p>
          </div>
          <XCircleIcon
            class="w-5 h-5 text-white cursor-pointer"
            @click="amendCloseAction"
          />
        </div>

        <!-- Tab bar -->
        <div class="flex border-b border-gray-200 bg-gray-50 px-4">
          <button
            @click="amendTab = 'history'"
            class="px-4 py-2.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5"
            :class="
              amendTab === 'history'
                ? 'border-[#ff613c] text-[#ff613c]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            "
          >
            <ClockIcon class="w-3.5 h-3.5" />
            Amendment History
            <span
              v-if="amendData?.amend_info?.length"
              class="bg-[#ff613c] text-white text-[9px] font-bold rounded-full px-1.5 py-0.5 leading-none"
              >{{ amendData.amend_info.length }}</span
            >
          </button>
          <button
            @click="amendTab = 'create'"
            class="px-4 py-2.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5"
            :class="
              amendTab === 'create'
                ? 'border-[#ff613c] text-[#ff613c]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            "
          >
            <PencilSquareIcon class="w-3.5 h-3.5" />
            Create Amendment
          </button>
        </div>

        <div class="p-4 max-h-[70vh] overflow-y-auto">
          <!-- ── HISTORY TAB ── -->
          <div v-if="amendTab === 'history'">
            <div
              v-if="!amendData?.amend_info || amendData.amend_info.length === 0"
              class="flex flex-col items-center justify-center py-12 text-gray-400"
            >
              <ClockIcon class="w-10 h-10 mb-2 opacity-40" />
              <p class="text-xs">No amendment history yet</p>
              <button
                @click="amendTab = 'create'"
                class="mt-3 text-xs bg-[#ff613c] text-white px-4 py-1.5 rounded-lg"
              >
                Create First Amendment
              </button>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="am in amendData.amend_info"
                :key="am.id"
                class="border border-gray-200 rounded-xl overflow-hidden"
              >
                <!-- Amendment card header -->
                <div
                  class="flex justify-between items-center px-4 py-2.5 bg-gray-50 border-b border-gray-200"
                >
                  <div class="flex items-center gap-2">
                    <!-- Status badge -->
                    <span
                      class="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      :class="amendStatusLabel(am.amend_status).cls"
                    >
                      {{ amendStatusLabel(am.amend_status).text }}
                    </span>
                    <!-- Delete badge -->
                    <span
                      v-if="am.is_delete"
                      class="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-[10px] font-semibold"
                    >
                      🗑 Delete Request
                    </span>
                    <!-- Flags -->
                    <span
                      v-if="am.amend_request"
                      class="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px]"
                      >Requested</span
                    >
                    <span
                      v-if="am.amend_approve"
                      class="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px]"
                      >Approved</span
                    >
                    <span
                      v-if="am.amend_mail_sent"
                      class="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-[10px]"
                      >Mail Sent</span
                    >
                  </div>
                  <span class="text-[10px] text-gray-400">{{
                    formatTs(am.created_at)
                  }}</span>
                </div>

                <!-- Latest changes diff table -->
                <div
                  class="px-4 py-3"
                  v-if="!am.is_delete && am.latest_changes"
                >
                  <p
                    class="text-[10px] font-semibold text-gray-500 mb-2 uppercase tracking-wide"
                  >
                    Changes
                  </p>
                  <table class="w-full text-[10px]">
                    <thead>
                      <tr class="text-gray-400 border-b border-gray-100">
                        <th class="text-left py-1 w-1/3">Field</th>
                        <th class="text-center py-1 w-1/3">Before</th>
                        <th class="text-center py-1 w-1/3">After</th>
                      </tr>
                    </thead>
                    <tbody>
                      <template
                        v-for="history in am.amend_history"
                        :key="history.timestamp"
                      >
                        <tr
                          v-for="key in diffKeys(history.changes)"
                          :key="key"
                          class="border-b border-gray-50 hover:bg-gray-50"
                        >
                          <td class="py-1.5 text-gray-600 font-medium">
                            {{ changeLabel(key) }}
                          </td>
                          <td
                            class="py-1.5 text-center text-gray-400 line-through"
                          >
                            {{ prevValue(history, key) }}
                          </td>
                          <td
                            class="py-1.5 text-center font-semibold"
                            :class="
                              key.includes('total')
                                ? 'text-green-600'
                                : 'text-[#ff613c]'
                            "
                          >
                            {{ history.changes[key] }}
                          </td>
                        </tr>
                      </template>
                    </tbody>
                  </table>

                  <!-- History log (who/when) -->
                  <div class="mt-3 space-y-1" v-if="am.amend_history?.length">
                    <p
                      class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1"
                    >
                      Activity Log
                    </p>
                    <div
                      v-for="h in am.amend_history"
                      :key="h.timestamp"
                      class="flex items-center gap-2 text-[10px] text-gray-500"
                    >
                      <span
                        class="w-1.5 h-1.5 rounded-full bg-[#ff613c] flex-shrink-0"
                      ></span>
                      <span class="font-medium text-gray-700">{{
                        h.user_name
                      }}</span>
                      <span>requested changes</span>
                      <span class="ml-auto text-gray-400">{{
                        formatTs(h.timestamp)
                      }}</span>
                    </div>
                  </div>
                </div>

                <!-- Delete request info -->
                <div class="px-4 py-3" v-if="am.is_delete">
                  <p class="text-xs text-red-600 font-medium">
                    This item has been requested for deletion.
                  </p>
                  <p class="text-[10px] text-gray-500 mt-1">
                    Original amount:
                    <span class="font-semibold"
                      >{{ am.latest_changes?.total_amount }} ฿</span
                    >
                  </p>
                </div>
              </div>

              <!-- Button to switch to create tab -->
              <div class="flex justify-end pt-2">
                <button
                  @click="amendTab = 'create'"
                  class="text-xs bg-[#ff613c] text-white px-4 py-2 rounded-lg flex items-center gap-1.5"
                >
                  <PencilSquareIcon class="w-3.5 h-3.5" />
                  Create New Amendment
                </button>
              </div>
            </div>
          </div>

          <!-- ── CREATE TAB ── -->
          <div v-if="amendTab === 'create'">
            <AmendCreate
              :amendData="amendData"
              :amendCloseAction="amendCloseAction"
            />
          </div>
        </div>
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
