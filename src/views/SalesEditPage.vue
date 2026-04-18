<script setup>
import {
  XCircleIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
  PrinterIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowLeftIcon,
  PlusIcon,
  CheckBadgeIcon,
  DocumentCheckIcon,
} from "@heroicons/vue/24/outline";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { computed, onMounted, ref, watch } from "vue";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { useToast } from "vue-toastification";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import Modal from "../components/Modal.vue";
import Swal from "sweetalert2";

import Vantour from "./BookingComponent/Vantour.vue";
import Airline from "./BookingComponent/Airline.vue";
import Attraction from "./BookingComponent/Attraction.vue";
import Hotel from "./BookingComponent/Hotel.vue";
import ItemList from "./BookingComponent/ItemList.vue";
import InclusivePart from "./BookingComponent/InclusivePart.vue";
import CustomerInfo from "./BookingComponent/CustomerInfo.vue";
import PaymentDetail from "./BookingComponent/PaymentDetail.vue";
import TaxInfo from "./BookingComponent/TaxInfo.vue";
import DetailItemVue from "./BookingComponent/DetailItem.vue";
import DetailListVue from "./BookingComponent/DetailList.vue";
import ArchiveConfirmationModal from "./BookingComponent/ConfirmationModel.vue";
import CashImage from "./CashImageCreate/CashImage.vue";
import PngUsage from "./PngGenerate/PngUsage.vue";
import Navbar from "../components/Navbar.vue";

import { useBookingStore } from "../stores/booking";
import { useAdminStore } from "../stores/admin";
import { useAuthStore } from "../stores/auth";
import { useUserStore } from "../stores/user";
import { useCashImageStore } from "../stores/cashImage";
import { useInternalTransferStore } from "../stores/internalTransfer";

import VantourImage from "../../src/assets/road-trip.png";
import HotelImage from "../../src/assets/hotel.png";
import AttractionImage from "../../src/assets/attractions icon.svg";
import AirlineImage from "../../src/assets/flight icon.svg";

import { daysBetween } from "./help/DateBetween";

const bookingStore = useBookingStore();
const adminStore = useAdminStore();
const authStore = useAuthStore();
const userStore = useUserStore();
const cashImageStore = useCashImageStore();
const internalTransterStore = useInternalTransferStore();
const toast = useToast();
const router = useRouter();
const route = useRoute();
const { user } = storeToRefs(authStore);

// ── Mobile screen state: 'detail' | 'add' | 'review' ──────
const mobileScreen = ref("detail");
const currentTag = ref("Van Tours");
const currentSubTag = ref("items");
const showEditPart = ref(false); // desktop only
const updatingLoading = ref(false);
const checkCondition = ref(false);
const openShowModal = ref(false);
const openModalArchive = ref(false);
const openModalArchiveConfirmation = ref(false);
const openPrintModal = ref(false);
const openAddUserModal = ref(false);
const required_archive = ref(false);
const errors = ref(null);
const editData = ref("");
const queryCrmId = ref("");
const unique_key = ref("");
const userData = ref(null);
const formitem = ref({});

const productArray = [
  { id: 1, name: "Van Tours", image: VantourImage },
  { id: 2, name: "Attractions", image: AttractionImage },
  { id: 3, name: "Hotels", image: HotelImage },
  { id: 4, name: "Airlines", image: AirlineImage },
];

const componentsMap = {
  "Van Tours": Vantour,
  Attractions: Attraction,
  Hotels: Hotel,
  Airlines: Airline,
};
const currentComponent = computed(
  () => componentsMap[currentTag.value] || Vantour,
);

const formData = ref({
  payment_notes: "",
  transfer_code: "",
  customer_id: "",
  user_id: "",
  user_name: "",
  customer_name: "",
  customer_phone: "",
  customer_email: "",
  is_corporate: "",
  sold_from: "",
  payment_method: "",
  bank_name: "",
  payment_status: "",
  booking_date: "",
  payment_currency: "",
  items: [],
  money_exchange_rate: "",
  crm_id: "",
  discount: "0",
  comment: "",
  receipt_image: [],
  receipt_images: [],
  confirmation_letter: [],
  due_date: "",
  deposit: 0,
  balance_due_date: "",
  past_user_id: "",
  is_past_info: "",
  past_crm_id: "",
  is_inclusive: "",
  inclusive_name: "",
  inclusive_description: "",
  inclusive_quantity: "",
  inclusive_rate: "",
  inclusive_start_date: "",
  inclusive_end_date: "",
});

// ── Computed totals ────────────────────────────────────────
const sub_total_discount = computed(() => {
  if (formData.value.is_inclusive != 1) {
    let t = 0;
    for (const item of formData.value.items)
      if (!item.is_inclusive && item.cancellation !== "cancel_confirm")
        t += item.discount;
    return t;
  }
  return 0;
});

const sub_total = computed(() => {
  if (formData.value.is_inclusive != 1) {
    let t = 0;
    for (const item of formData.value.items)
      if (item.cancellation !== "cancel_confirm") t += item.total_amount;
    return t + sub_total_discount.value * 1;
  }
  return formData.value.inclusive_rate * formData.value.inclusive_quantity;
});

const sub_total_real = computed(() => {
  if (formData.value.is_inclusive != 1) {
    let t = 0;
    for (const item of formData.value.items)
      if (
        !item.is_inclusive &&
        item.product_type &&
        item.cancellation !== "cancel_confirm"
      )
        t += item.total_amount;
    return t + sub_total_discount.value * 1;
  }
  return formData.value.inclusive_rate * formData.value.inclusive_quantity;
});

const sub_total_airline = computed(() => {
  if (formData.value.is_inclusive != 1) {
    let t = 0;
    for (const item of formData.value.items)
      if (
        !item.is_inclusive &&
        item.product_type == "7" &&
        item.cancellation !== "cancel_confirm"
      )
        t += item.total_amount;
    return t;
  }
  return 0;
});

const grand_total = computed(
  () => sub_total.value - sub_total_discount.value * 1,
);
const grand_total_real = computed(
  () => sub_total_real.value - sub_total_discount.value * 1,
);

const balance_due = computed(() => {
  if (formData.value.items.length === 0) return undefined;
  const diff = grand_total.value - formData.value.deposit;
  if (diff === 0) formData.value.payment_status = "fully_paid";
  else if (formData.value.deposit != 0)
    formData.value.payment_status = "partially_paid";
  else formData.value.payment_status = "not_paid";
  return diff;
});

const balance_due_real = computed(() => {
  if (formData.value.items.length === 0) return undefined;
  return grand_total_real.value - formData.value.deposit;
});

const allowCreate = computed(() => {
  if (
    formData.value.items.length !== 0 &&
    formData.value.deposit != 0 &&
    formData.value.receipt_image.length !== 0
  )
    return true;
  if (formData.value.items.length !== 0 && formData.value.deposit == 0)
    return true;
  if (formData.value.items.length !== 0 && checkCondition.value) return true;
  return false;
});

// ── Helpers ────────────────────────────────────────────────
const formatNullValue = (v, d = "") =>
  v === null || v === "null" || v === undefined ? d : v;

const formatDateDb = (s) => {
  if (!s) return "";
  if (s.includes("T")) return s.replace("T", " ");
  const m = s.match(/^(\d{2})-(\d{2})-(\d{4})\s(.*)$/);
  if (m) return `${m[3]}-${m[2]}-${m[1]} ${m[4]}`;
  return s;
};

const formatDate = (s) => {
  const d = new Date(s);
  if (isNaN(d.getTime())) return "Invalid Date";
  const M = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${String(d.getDate()).padStart(2, "0")}-${M[d.getMonth()]}-${d.getFullYear()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
};

const choiceProductType = (type) =>
  ({
    "App\\Models\\PrivateVanTour": "1",
    "App\\Models\\GroupTour": "2",
    "App\\Models\\AirportPickup": "3",
    "App\\Models\\EntranceTicket": "4",
    "App\\Models\\Hotel": "6",
    "App\\Models\\Airline": "7",
  })[type] || "";
const checkType = (p) => p?.cars || p?.variations || p?.rooms || p?.tickets;
const getProductId = (item) =>
  !item
    ? ""
    : {
        "App\\Models\\PrivateVanTour": item.car?.id,
        "App\\Models\\EntranceTicket": item.variation?.id,
        "App\\Models\\Hotel": item.room?.id,
        "App\\Models\\Airline": item.ticket?.id,
      }[item.product_type] || "";
const getProductName = (item) =>
  !item
    ? ""
    : {
        "App\\Models\\PrivateVanTour": item.car?.name,
        "App\\Models\\EntranceTicket": item.variation?.name,
        "App\\Models\\Hotel": item.room?.name,
        "App\\Models\\Airline": item.ticket?.price,
      }[item.product_type] || "";

// ── Processors ─────────────────────────────────────────────
const processItem = (item, isInclusive) => {
  const productType = choiceProductType(item.product_type);
  return {
    reservation_id: item.id,
    product_type: productType,
    crm_id: item.crm_id,
    group_id: item.group_id,
    product_id: item.product_id,
    product_name: item.product?.name,
    product_image:
      item.product?.cover_image || item.product?.images?.[0]?.image || "",
    service_date: item.service_date,
    is_inclusive: isInclusive ? 1 : 0,
    cancellation: item.cancellation ?? null,
    discount: item.discount,
    quantity: item.quantity,
    days: daysBetween(item.checkin_date, item.checkout_date),
    duration: item.duration,
    selling_price: item.selling_price,
    comment: formatNullValue(item.comment),
    special_request: formatNullValue(item.special_request),
    reservation_status: item.reservation_status,
    payment_method: item.payment_method,
    payment_status: item.payment_status,
    exchange_rate: item.exchange_rate,
    cost_price: item.cost_price,
    pickup_location: formatNullValue(item.pickup_location),
    pickup_time: formatNullValue(item.pickup_time),
    is_driver_collect:
      item.is_driver_collect === null ? null : item.is_driver_collect === 1,
    dropoff_location: formatNullValue(item.dropoff_location),
    route_plan: formatNullValue(item.route_plan),
    car_list: checkType(item.product),
    car_id: getProductId(item) || "",
    item_name: getProductName(item) || "",
    checkin_date: formatNullValue(item.checkin_date),
    checkout_date: formatNullValue(item.checkout_date),
    room_number: formatNullValue(item.room_number),
    total_amount: Number(item.amount),
    total_cost_price: Number(item.total_cost_price),
    child_info: item?.variation?.child_info
      ? JSON.parse(item.variation.child_info)
      : [],
    individual_pricing:
      item.individual_pricing != "null" &&
      item.individual_pricing?.child?.quantity &&
      item.individual_pricing?.child?.quantity != "NaN"
        ? item.individual_pricing
        : productType == "4"
          ? {
              adult: {
                quantity: item.individual_pricing?.adult?.quantity ?? 0,
                cost_price: item.individual_pricing?.adult?.cost_price ?? 0,
                amount: item.individual_pricing?.adult?.amount ?? 0,
                selling_price:
                  item.individual_pricing?.adult?.selling_price ?? 0,
                total_cost_price:
                  item.individual_pricing?.adult?.total_cost_price ?? 0,
              },
              child: {
                quantity: 0,
                cost_price: 0,
                amount: 0,
                selling_price: 0,
                total_cost_price: 0,
              },
            }
          : null,
    child_quantity: item.child_quantity,
    child_price: item.child_price,
    child_cost: item.child_cost,
    child_total_cost: item.child_total_cost,
    child_total_selling_price: item.child_total_selling_price,
    adult_quantity: item.adult_quantity,
    adult_price: item.adult_price,
    adult_cost: item.adult_cost,
    adult_total_cost: item.adult_total_cost,
    adult_total_selling_price: item.adult_total_selling_price,
    associated_customer: item.associated_customer,
    customer_passport: item.customer_passports,
    amend_info: item.amend_info ?? null,
    has_amendment: item.has_amendment,
  };
};

const processReceipt = (receipt) => {
  if (receipt.is_internal_transfer)
    return {
      is_internal_transfer: true,
      id: receipt.internal_transfer_id,
      exchange_rate: receipt.exchange_rate,
      note: receipt.notes || "",
      from_files: receipt.from_files.map((f) => ({
        id: f.id,
        file: null,
        preview: f.image,
        amount: f.amount,
        currency: f.currency,
        sender: f.sender,
        receiver: f.receiver,
        interact_bank: f.interact_bank,
        date: f.date,
      })),
      to_files: receipt.to_files.map((f) => ({
        id: f.id,
        file: null,
        preview: f.image,
        amount: f.amount,
        currency: f.currency,
        sender: f.sender,
        receiver: f.receiver,
        interact_bank: f.interact_bank,
        date: f.date,
      })),
    };
  return {
    is_internal_transfer: false,
    id: receipt.id,
    file: null,
    preview: receipt.image,
    amount: receipt.amount,
    date: receipt.date,
    receiver: receipt.receiver,
    sender: receipt.sender,
    currency: receipt.currency,
    interact_bank: receipt.interact_bank,
    bank_name: receipt.bank_name || "",
    is_corporate: receipt.is_corporate || false,
    note: receipt.note || "",
  };
};

// ── Event handlers ─────────────────────────────────────────
const removeItemList = (message) => {
  if (
    !message ||
    typeof message.id === "undefined" ||
    typeof message.index === "undefined"
  )
    return;
  const items = formData.value.items;
  if (!Array.isArray(items)) return;
  if (items[message.index]?.product_id === message.id)
    items.splice(message.index, 1);
};

const changeGetForm = (d) =>
  Object.assign(formData.value, {
    balance_due_date: d.balance_due_date,
    booking_date: d.booking_date,
    money_exchange_rate: d.money_exchange_rate,
    payment_currency: d.payment_currency,
    payment_method: d.payment_method,
    bank_name: d.bank_name,
    is_past_info: d.is_past_info,
    past_crm_id: d.past_crm_id,
    past_user_id: d.past_user_id,
    is_inclusive: d.is_inclusive,
  });
const changeGetTaxForm = (d) => {
  formData.value.transfer_code = d.transfer_code;
};
const changeGetInclusiveForm = (d) =>
  Object.assign(formData.value, {
    inclusive_name: d.inclusive_name,
    inclusive_quantity: d.inclusive_quantity,
    inclusive_rate: d.inclusive_rate,
    inclusive_start_date: d.inclusive_start_date,
    inclusive_end_date: d.inclusive_end_date,
    inclusive_description: d.inclusive_description,
  });
const customerId = (d) =>
  Object.assign(formData.value, {
    customer_id: d.id,
    customer_name: d.name,
    customer_email: d.email,
    customer_phone: d.phone_number,
    is_corporate: d.is_corporate_customer,
    sold_from: d.sold_from,
    is_past_info: d.is_past_info,
    past_crm_id: d.past_crm_id,
    past_user_id: d.past_user_id,
  });

const changeGetItem = (data) => {
  formitem.value = {
    ...data,
    is_inclusive: formData.value.is_inclusive == 1 ? 1 : "",
  };
  formData.value.items.push(formitem.value);
  formitem.value = {};
  // After adding: mobile goes to review screen
  if (mobileScreen.value === "add") mobileScreen.value = "review";
};

// Desktop handler
const handleAddItem = (product) => {
  showEditPart.value = true;
  const map = {
    Hotel: "Hotels",
    Attraction: "Attractions",
    "Van Tour": "Van Tours",
    Airline: "Airlines",
  };
  if (map[product?.category]) currentTag.value = map[product.category];
};

// ── Validation ─────────────────────────────────────────────
const validateItemByType = (item) => {
  switch (item.product_type) {
    case "1":
    case "2":
    case "3":
      if (!item.service_date) {
        toast.warning(
          "ပစ္စည်းတစ်ခု၏ ဝန်ဆောင်မှုရက်စွဲကို ထည့်သွင်းရန် လိုအပ်ပါသည်",
        );
        return false;
      }
      if (!item.car_id) {
        toast.warning("ကားအမျိုးအစား ရွေးချယ်ရန် လိုအပ်ပါသည်");
        return false;
      }
      break;
    case "4":
      if (!item.car_id) {
        toast.warning("Variation ကို ရွေးချယ်ရန် လိုအပ်ပါသည်");
        return false;
      }
      if (!item.service_date) {
        toast.warning("ဝန်ဆောင်မှုရက်စွဲကို ထည့်သွင်းရန် လိုအပ်ပါသည်");
        return false;
      }
      break;
    case "5":
      if (!item.service_date) {
        toast.warning(
          "Inclusive ဝန်ဆောင်မှုရက်စွဲကို ထည့်သွင်းရန် လိုအပ်ပါသည်",
        );
        return false;
      }
      break;
    case "6":
      if (!item.car_id) {
        toast.warning("အခန်းအမျိုးအစားကို ရွေးချယ်ရန် လိုအပ်ပါသည်");
        return false;
      }
      if (!item.checkin_date || !item.checkout_date) {
        toast.warning(
          "ဟိုတယ်အတွက် Check-in နှင့် Check-out ရက်စွဲများ ထည့်သွင်းရန် လိုအပ်ပါသည်",
        );
        return false;
      }
      break;
    case "7":
      if (!item.car_id) {
        toast.warning("လက်မှတ်အမျိုးအစားကို ရွေးချယ်ရန် လိုအပ်ပါသည်");
        return false;
      }
      if (!item.service_date) {
        toast.warning("ခရီးစဉ်ရက်စွဲကို ထည့်သွင်းရန် လိုအပ်ပါသည်");
        return false;
      }
      break;
  }
  if (!item.total_amount) {
    toast.warning("စုစုပေါင်းတန်ဖိုး ထည့်သွင်းရန် လိုအပ်ပါသည်");
    return false;
  }
  return true;
};

const validateBasicInfo = () => {
  if (!formData.value.customer_id) {
    toast.warning("ဖောက်သည် ရွေးချယ်ရန် လိုအပ်ပါသည်");
    return false;
  }
  if (!formData.value.payment_method) {
    toast.warning("ငွေပေးချေမှု နည်းလမ်း ရွေးရန် လိုအပ်ပါသည်");
    return false;
  }
  if (!formData.value.booking_date) {
    toast.warning("စာရင်းသွင်းသည့်ရက်စွဲ ထည့်သွင်းရန် လိုအပ်ပါသည်");
    return false;
  }
  if (!formData.value.payment_status) {
    toast.warning("ငွေပေးချေမှု အခြေအနေ ရွေးချယ်ရန် လိုအပ်ပါသည်");
    return false;
  }
  if (formData.value.items.length === 0) {
    toast.warning("အနည်းဆုံး ပစ္စည်းတစ်ခု ထည့်သွင်းရန် လိုအပ်ပါသည်");
    return false;
  }
  return true;
};

// ── Submit ─────────────────────────────────────────────────
const onSubmitHandler = async () => {
  if (!isNaN(sub_total_real.value) && sub_total_real.value !== null)
    openModalArchiveConfirmation.value = true;
  else toast.warning("please check again, item have issue!");
};

const handleArchiveUpdate = () => {
  updateAuthAction();
  openModalArchiveConfirmation.value = false;
};
const handleNormalUpdate = () => {
  updateAuthAction();
  openModalArchiveConfirmation.value = false;
};
const closeModal = () => {
  openModalArchiveConfirmation.value = false;
};

const updateAuthAction = async () => {
  if (authStore.isSuperAdmin) openModalArchive.value = true;
  else await processSubmission();
};

const archiveUpdate = async () => {
  required_archive.value = true;
  await processSubmission();
  openModalArchive.value = false;
};
const normalUpdate = async () => {
  required_archive.value = false;
  await processSubmission();
  openModalArchive.value = false;
};

const processSubmission = async () => {
  updatingLoading.value = true;
  if (!isNaN(sub_total_real.value) && sub_total_real.value !== null) {
    if (!validateBasicInfo()) {
      updatingLoading.value = false;
      return;
    }
    const frmData = new FormData();
    frmData.append("_method", "PUT");
    [
      "customer_id",
      "payment_notes",
      "transfer_code",
      "sold_from",
      "payment_method",
      "bank_name",
      "comment",
      "past_crm_id",
      "past_user_id",
      "payment_status",
      "booking_date",
      "payment_currency",
      "balance_due_date",
    ].forEach((f) => {
      if (formData.value[f]) frmData.append(f, formData.value[f]);
    });
    frmData.append("is_past_info", formData.value.is_past_info ? 1 : 0);
    frmData.append("user_id", formData.value.user_id || 0);
    frmData.append(
      "money_exchange_rate",
      formData.value.money_exchange_rate || 0,
    );
    frmData.append("discount", sub_total_discount.value || 0);
    if (required_archive.value) frmData.append("required_archive", true);
    if (formData.value.is_inclusive == 1)
      [
        "is_inclusive",
        "inclusive_name",
        "inclusive_quantity",
        "inclusive_rate",
        "inclusive_start_date",
        "inclusive_end_date",
        "inclusive_description",
      ].forEach((f) => frmData.append(f, formData.value[f]));
    if (sub_total_real.value) frmData.append("sub_total", sub_total_real.value);
    if (sub_total_airline.value)
      frmData.append("exclude_amount", sub_total_airline.value);
    if (grand_total_real.value)
      frmData.append("grand_total", grand_total_real.value);
    if (formData.value.deposit)
      frmData.append("deposit", formData.value.deposit);
    frmData.append("balance_due", balance_due_real.value);
    const typeMap = {
      1: "App\\Models\\PrivateVanTour",
      2: "App\\Models\\GroupTour",
      3: "App\\Models\\AirportPickup",
      4: "App\\Models\\EntranceTicket",
      5: "App\\Models\\Inclusive",
      6: "App\\Models\\Hotel",
      7: "App\\Models\\Airline",
    };
    formData.value.items.forEach((item, x) => {
      if (typeMap[item.product_type])
        frmData.append(`items[${x}][product_type]`, typeMap[item.product_type]);
    });
    if (formData.value.receipt_image?.length > 0) {
      formData.value.receipt_image.forEach((receipt, x) => {
        if (receipt.is_internal_transfer) {
          frmData.append(`receipt_image[${x}][is_internal_transfer]`, true);
          frmData.append(
            `receipt_image[${x}][exchange_rate]`,
            receipt.exchange_rate,
          );
          frmData.append(`receipt_image[${x}][note]`, receipt.note || "");
          frmData.append(`receipt_image[${x}][id]`, receipt.id || "");
          receipt.from_files.forEach((f, i) => {
            if (f.file)
              frmData.append(
                `receipt_image[${x}][from_files][${i}][file]`,
                f.file,
              );
            [
              "amount",
              "currency",
              "sender",
              "receiver",
              "interact_bank",
              "date",
            ].forEach((k) =>
              frmData.append(
                `receipt_image[${x}][from_files][${i}][${k}]`,
                f[k],
              ),
            );
          });
          receipt.to_files.forEach((f, i) => {
            if (f.file)
              frmData.append(
                `receipt_image[${x}][to_files][${i}][file]`,
                f.file,
              );
            [
              "amount",
              "currency",
              "sender",
              "receiver",
              "interact_bank",
              "date",
            ].forEach((k) =>
              frmData.append(`receipt_image[${x}][to_files][${i}][${k}]`, f[k]),
            );
          });
        } else {
          frmData.append(`receipt_image[${x}][is_internal_transfer]`, false);
          if (receipt.file)
            frmData.append(`receipt_image[${x}][file]`, receipt.file);
          frmData.append(`receipt_image[${x}][amount]`, receipt.amount);
          frmData.append(`receipt_image[${x}][date]`, receipt.date);
          frmData.append(
            `receipt_image[${x}][bank_name]`,
            receipt.bank_name ?? "other...",
          );
          frmData.append(`receipt_image[${x}][sender]`, receipt.sender);
          frmData.append(`receipt_image[${x}][reciever]`, receipt.reciever);
          frmData.append(
            `receipt_image[${x}][interact_bank]`,
            receipt.interact_bank,
          );
          frmData.append(`receipt_image[${x}][currency]`, receipt.currency);
          frmData.append(
            `receipt_image[${x}][is_corporate]`,
            receipt.is_corporate ? 1 : 0,
          );
          frmData.append(`receipt_image[${x}][note]`, receipt.note || "");
        }
      });
    }
    for (let x = 0; x < formData.value.items.length; x++) {
      if (!validateItemByType(formData.value.items[x])) {
        updatingLoading.value = false;
        return;
      }
      const item = formData.value.items[x];
      frmData.append(`items[${x}][product_id]`, item.product_id);
      frmData.append(
        `items[${x}][is_inclusive]`,
        formData.value.is_inclusive ? 1 : 0,
      );
      frmData.append(`items[${x}][amount]`, item.total_amount);
      frmData.append(`items[${x}][discount]`, item.discount || 0);
      frmData.append(`items[${x}][total_cost_price]`, item.total_cost_price);
      if (item.pickup_location)
        frmData.append(`items[${x}][pickup_location]`, item.pickup_location);
      if (item.pickup_time)
        frmData.append(`items[${x}][pickup_time]`, item.pickup_time);
      if (item.cancellation)
        frmData.append(`items[${x}][cancellation]`, item.cancellation);
      if (item.customer_attachment)
        frmData.append(
          `items[${x}][customer_attachment]`,
          item.customer_attachment,
        );
      if (item.cost_price)
        frmData.append(`items[${x}][cost_price]`, item.cost_price);
      if (item.dropoff_location)
        frmData.append(`items[${x}][dropoff_location]`, item.dropoff_location);
      if (item.checkin_date)
        frmData.append(`items[${x}][checkin_date]`, item.checkin_date);
      if (item.checkout_date)
        frmData.append(`items[${x}][checkout_date]`, item.checkout_date);
      if (item.room_number)
        frmData.append(`items[${x}][room_number]`, item.room_number);
      if (item.route_plan)
        frmData.append(`items[${x}][route_plan]`, item.route_plan);
      if (item.duration) frmData.append(`items[${x}][duration]`, item.duration);
      if (item.special_request)
        frmData.append(`items[${x}][special_request]`, item.special_request);
      if (item.comment) frmData.append(`items[${x}][comment]`, item.comment);
      if (item.service_date)
        frmData.append(`items[${x}][service_date]`, item.service_date);
      if (item.quantity) frmData.append(`items[${x}][quantity]`, item.quantity);
      if (item.selling_price)
        frmData.append(`items[${x}][selling_price]`, item.selling_price);
      if (item.exchange_rate)
        frmData.append(`items[${x}][exchange_rate]`, item.exchange_rate);
      if (item.reservation_id !== "")
        frmData.append(`items[${x}][reservation_id]`, item.reservation_id);
      if (item.reservation_status)
        frmData.append(
          `items[${x}][reservation_status]`,
          item.reservation_status,
        );
      if (item.payment_method)
        frmData.append(`items[${x}][payment_method]`, item.payment_method);
      if (item.payment_status)
        frmData.append(`items[${x}][payment_status]`, item.payment_status);
      if (item.product_type == "6")
        frmData.append(`items[${x}][room_id]`, item.car_id);
      else if (["1", "2", "3"].includes(item.product_type))
        frmData.append(`items[${x}][car_id]`, item.car_id);
      else if (item.product_type == "4")
        frmData.append(`items[${x}][variation_id]`, item.car_id);
      else if (item.product_type == "7")
        frmData.append(`items[${x}][ticket_id]`, item.car_id);
      if (item.product_type == "4" && item.child_quantity) {
        item.child_quantity !== undefined && item.child_quantity !== null
          ? frmData.append(
              "items[" + x + "][child_quantity]",
              item.child_quantity,
            )
          : "";
        item.child_price !== undefined && item.child_price !== null
          ? frmData.append("items[" + x + "][child_price]", item.child_price)
          : "";
        item.child_cost !== undefined && item.child_cost !== null
          ? frmData.append("items[" + x + "][child_cost]", item.child_cost)
          : "";
        item.child_total_cost !== undefined && item.child_total_cost !== null
          ? frmData.append(
              "items[" + x + "][child_total_cost]",
              item.child_total_cost,
            )
          : "";
        item.child_total_selling_price !== undefined &&
        item.child_total_selling_price !== null
          ? frmData.append(
              "items[" + x + "][child_total_selling_price]",
              item.child_total_selling_price,
            )
          : "";
        item.adult_quantity !== undefined && item.adult_quantity !== null
          ? frmData.append(
              "items[" + x + "][adult_quantity]",
              item.adult_quantity,
            )
          : "";
        item.adult_price !== undefined && item.adult_price !== null
          ? frmData.append("items[" + x + "][adult_price]", item.adult_price)
          : "";
        item.adult_cost !== undefined && item.adult_cost !== null
          ? frmData.append("items[" + x + "][adult_cost]", item.adult_cost)
          : "";
        item.adult_total_cost !== undefined && item.adult_total_cost !== null
          ? frmData.append(
              "items[" + x + "][adult_total_cost]",
              item.adult_total_cost,
            )
          : "";
        item.adult_total_selling_price !== undefined &&
        item.adult_total_selling_price !== null
          ? frmData.append(
              "items[" + x + "][adult_total_selling_price]",
              item.adult_total_selling_price,
            )
          : "";
      }
      if (item.passports?.length > 0)
        item.passports.forEach((p, pi) => {
          if (p.name) {
            frmData.append(`items[${x}][passports][${pi}][name]`, p.name);
            frmData.append(
              `items[${x}][passports][${pi}][passport]`,
              p.passport ?? "",
            );
          }
        });
    }
    try {
      const response = await bookingStore.updateAction(
        frmData,
        route.params.id,
      );
      if (response.status == 1) {
        errors.value = null;
        toast.success(response.message);
        // router.push("/bookings/new-update/" + response.result.id);
        router.push("/sales/edit/" + response.result.id);
        await getDetail();
      }
    } catch (error) {
      if (error.response?.data?.errors)
        errors.value = error.response.data.errors;
      toast.error(error.response?.data?.message);
    } finally {
      updatingLoading.value = false;
    }
  } else {
    toast.warning("please check again, item have issue!");
    updatingLoading.value = false;
  }
};

const tabOrder = ["items", "info", "payment", "tax", "confirm"];

const onNext = () => {
  const currentIndex = tabOrder.indexOf(currentSubTag.value);

  if (currentIndex < tabOrder.length - 1) {
    currentSubTag.value = tabOrder[currentIndex + 1];
  }
};

// ── Receipt actions ─────────────────────────────────────────
const internalTransferAction = (message) => {
  const data = {
    is_internal_transfer: true,
    exchange_rate: message.data.exchange_rate,
    id: message.data.id,
    note: message.data.notes,
    from_files: message.data.from_images.map((img) => ({
      id: img.id || null,
      file: img.image,
      amount: img.amount,
      currency: img.currency,
      sender: img.sender,
      receiver: img.receiver,
      interact_bank: img.interact_bank,
      date: formatDateDb(img.date),
    })),
    to_files: message.data.to_images.map((img) => ({
      id: img.id || null,
      file: img.image,
      amount: img.amount,
      currency: img.currency,
      sender: img.sender,
      receiver: img.receiver,
      interact_bank: img.interact_bank,
      date: formatDateDb(img.date),
    })),
  };
  if (data.id) {
    const idx = formData.value.receipt_image.findIndex(
      (i) => i.id === data.id && i.is_internal_transfer,
    );
    if (idx !== -1) formData.value.receipt_image[idx] = data;
    else formData.value.receipt_image.push(data);
  } else formData.value.receipt_image.push(data);
  openShowModal.value = false;
};

const directAction = (message) => {
  formData.value.receipt_image.push({
    is_internal_transfer: false,
    file: message.data.image,
    amount: message.data.amount,
    currency: message.data.currency,
    sender: message.data.sender,
    reciever: message.data.receiver,
    interact_bank: message.data.interact_bank,
    date: formatDateDb(message.data.date),
    bank_name: "",
    is_corporate: false,
    note: "",
  });
  openShowModal.value = false;
};

const closeAction = () => {
  editData.value = "";
  openShowModal.value = false;
};
const editFeatureSelectImage = (data) => {
  editData.value = data;
  openShowModal.value = true;
};
const removeFeatureSelectImage = (idx) => {
  formData.value.receipt_image.splice(idx, 1);
};

// ── Delete ──────────────────────────────────────────────────
const deleteImage = async (id) => {
  const r = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#2463EB",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  });
  if (r.isConfirmed) {
    try {
      updatingLoading.value = true;
      await cashImageStore.deleteAction(id);
      toast.success("success delete sale Image");
    } catch (e) {
      toast.error(e.response.data.message);
    } finally {
      window.location.reload();
    }
  }
};
const deleteInternalTransfer = async (id) => {
  const r = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#2463EB",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  });
  if (r.isConfirmed) {
    try {
      const res = await internalTransterStore.deleteAction(id);
      toast.success(res.message);
    } catch (e) {
      toast.error(e.response.data.message);
    } finally {
      window.location.reload();
    }
  }
};

// ── User ────────────────────────────────────────────────────
const searchWithUnique = async () => {
  if (!unique_key.value) {
    toast.warning("Please enter user unique key");
    return;
  }
  const res = await userStore.getListAction({ unique_key: unique_key.value });
  if (res?.result?.data?.length > 0) userData.value = res.result.data;
  else toast.warning("User not found");
};
const cancelAddUser = () => {
  unique_key.value = "";
  userData.value = null;
  formData.value.user_id = "";
  formData.value.user_name = "";
  openAddUserModal.value = false;
};
const removeUserAdd = async () => {
  const r = await Swal.fire({
    title: "Are you sure?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#2463EB",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  });
  if (r.isConfirmed) {
    formData.value.user_id = "";
    userData.value = null;
    formData.value.user_name = "";
    await onSubmitHandler();
  }
};
const addUserToBooking = async (id) => {
  formData.value.user_id = id;
  openAddUserModal.value = false;
  await onSubmitHandler();
};
const openPaid = () => {
  window.open(
    import.meta.env.VITE_API_URL +
      "/bookings/" +
      route.params.id +
      "/receipt?paid=1",
  );
};

// ── Get detail ──────────────────────────────────────────────
const getDetail = async () => {
  try {
    updatingLoading.value = true;
    const response = await bookingStore.getDetailAction(route.params.id);
    const data = response.result;
    formData.value = {
      id: data.id,
      payment_notes: formatNullValue(data.payment_notes),
      transfer_code: data.transfer_code,
      customer_id: data.customer.id,
      user_id: response.result.user?.id,
      user_name: response.result.user?.name,
      customer_name: data.customer?.name,
      customer_email: formatNullValue(data.customer?.email),
      customer_phone: formatNullValue(data.customer?.phone_number),
      is_corporate: data.customer?.is_corporate_customer,
      sold_from: data?.sold_from,
      is_past_info: data.is_past_info,
      past_crm_id: data.past_crm_id,
      past_user_id: data.past_user_id,
      payment_method: formatNullValue(data.payment_method),
      payment_currency: formatNullValue(data.payment_currency),
      bank_name: formatNullValue(data.bank_name),
      payment_status: formatNullValue(data.payment_status),
      booking_date: formatNullValue(data.booking_date),
      money_exchange_rate: formatNullValue(data.money_exchange_rate),
      crm_id: formatNullValue(data.crm_id),
      items: [],
      receipt_image: [],
      receipt_images: [],
      balance_due_date: data.balance_due_date,
      deposit: data.deposit,
      is_inclusive: data.is_inclusive,
      inclusive_name: data.inclusive_name,
      inclusive_quantity: data.inclusive_quantity,
      inclusive_rate: data.inclusive_rate,
      inclusive_start_date: data.inclusive_start_date,
      inclusive_end_date: data.inclusive_end_date,
      inclusive_description: data.inclusive_description,
      comment: data.comment,
    };
    formData.value.receipt_image = [
      ...data.receipts.map(processReceipt),
      ...data.receipts_orignal.map((r) => ({
        is_internal_transfer: false,
        id: r.id,
        file: null,
        preview: r.image,
        amount: r.amount,
        date: r.date,
        receiver: r.receiver || r.reciever,
        sender: r.sender,
        currency: r.currency,
        interact_bank: r.interact_bank,
        bank_name: r.bank_name || "",
        is_corporate: r.is_corporate || false,
        note: r.note || "",
      })),
    ];
    formData.value.items = data.items.map((item) =>
      processItem(item, data.is_inclusive),
    );
  } catch {
    toast.error("စာရင်းအသေးစိတ် ရယူရာတွင် အမှားဖြစ်ပွားခဲ့သည်။");
  } finally {
    updatingLoading.value = false;
  }
};

onMounted(async () => {
  await getDetail();
  queryCrmId.value = route.query.crm_id ?? "";
  await adminStore.getSimpleListAction();
});
</script>

<template>
  <div class="flex flex-col h-screen overflow-hidden bg-[#f5f5f0]">
    <!-- ══════════════════════════════════════════════════════════
         DESKTOP  lg+
    ══════════════════════════════════════════════════════════ -->
    <div class="hidden lg:block h-full">
      <div :class="updatingLoading ? 'opacity-50' : ''">
        <div class="grid grid-cols-6 gap-4 relative">
          <!-- LEFT -->
          <div class="col-span-4 h-[85vh] overflow-hidden">
            <div class="space-y-4" v-if="!showEditPart">
              <DetailListVue
                :data="formData"
                :total="grand_total"
                :balance_due="balance_due"
              />
              <DetailItemVue
                :data="formData"
                @print="openPrintModal = true"
                @addItem="handleAddItem"
                :showEditPart="
                  () => {
                    showEditPart = !showEditPart;
                  }
                "
                :uploadingAction="
                  () => {
                    updatingLoading = !updatingLoading;
                  }
                "
              />
            </div>
            <div class="space-y-4" v-if="showEditPart">
              <div
                class="flex items-center gap-x-2 overflow-x-scroll no-sidebar-container pb-2 border-r border-gray-300"
              >
                <div
                  @click="showEditPart = false"
                  class="p-2 shadow-sm bg-white rounded-md flex items-center gap-x-2 cursor-pointer hover:bg-[#ff613c]/20"
                >
                  <img
                    src="https://placehold.co/400"
                    class="w-12 h-12 rounded-xl"
                    alt=""
                  />
                  <div class="w-[130px] space-y-1">
                    <p class="whitespace-nowrap text-[10px] font-medium">
                      View Items
                    </p>
                    <p class="text-[8px] text-gray-500">Go Back</p>
                  </div>
                </div>
                <div
                  v-for="l in productArray"
                  :key="l.id"
                  @click="currentTag = l.name"
                  class="p-2 shadow-sm rounded-md flex items-center gap-x-2 cursor-pointer hover:bg-[#ff613c]/20"
                  :class="
                    currentTag == l.name
                      ? 'bg-[#ff613c] text-white font-semibold'
                      : 'bg-white'
                  "
                >
                  <img
                    :src="l.image"
                    class="w-12 h-12 p-2 rounded-xl"
                    :class="
                      currentTag == l.name
                        ? 'bg-[#ff613c]'
                        : 'bg-gradient-to-r to-[#ff613c] from-[#ff5b00]/50'
                    "
                    alt=""
                  />
                  <div class="w-[130px] space-y-1">
                    <p class="whitespace-nowrap text-[10px] font-medium">
                      {{ l.name }}
                    </p>
                    <p
                      class="text-[8px] font-normal whitespace-nowrap"
                      :class="
                        currentTag == l.name ? 'text-white' : 'text-gray-500'
                      "
                    >
                      +100 Products
                    </p>
                  </div>
                </div>
              </div>
              <transition name="slide" mode="out-in">
                <component
                  :is="currentComponent"
                  :key="currentTag"
                  @formData="changeGetItem"
                />
              </transition>
            </div>
          </div>

          <!-- RIGHT -->
          <div
            class="col-span-2 h-[85vh] relative overflow-y-scroll no-sidebar-container space-y-4"
          >
            <div class="flex justify-end items-center space-x-2">
              <button
                @click="openPrintModal = !openPrintModal"
                class="bg-orange-600 px-4 py-2 text-xs flex items-center text-white rounded-xl"
              >
                <PrinterIcon class="w-4 h-4" /><span class="pl-2">PNG</span>
              </button>
              <button
                v-if="formData.is_inclusive == 1"
                @click="openPaid"
                class="bg-gray-600 px-4 py-2 text-xs flex items-center text-white rounded-xl"
              >
                <PrinterIcon class="w-4 h-4" /><span class="pl-2">PDF</span>
              </button>
              <div
                @click="openAddUserModal = true"
                class="cursor-pointer relative max-w-[200px] bg-green-500 py-2 px-4 text-xs text-white rounded-xl flex items-center gap-x-2"
              >
                <div class="flex items-center cursor-pointer">
                  <UserPlusIcon class="w-4 h-4 mr-2" />
                  <p
                    v-if="
                      formData.user_name && formData.user_id && userData == null
                    "
                    class="text-[10px] whitespace-nowrap line-clamp-1"
                  >
                    {{ formData.user_name }}
                  </p>
                  <p v-if="userData != null">{{ userData[0]?.name }}</p>
                  <p v-if="formData.user_id == null">Connect</p>
                </div>
                <div
                  @click.stop="removeUserAdd"
                  v-if="authStore.isSuperAdmin && formData.user_id != undefined"
                  class="absolute right-0.5 top-0.5 z-40 cursor-pointer rounded-xl bg-white p-1.5"
                >
                  <TrashIcon class="w-4 h-4 text-red-500" />
                </div>
              </div>
              <button
                v-show="allowCreate"
                @click="onSubmitHandler"
                class="bg-[#ff613c] py-2 px-4 text-xs text-white rounded-xl flex items-center gap-x-2"
              >
                <PencilSquareIcon class="w-4 h-4" />Update
              </button>
              <button
                v-show="!allowCreate"
                class="bg-gray-400 py-2 px-4 text-xs text-white rounded-xl flex items-center gap-x-2"
              >
                <PencilSquareIcon class="w-4 h-4" />Update
              </button>
            </div>
            <div
              class="bg-white flex justify-start sticky top-0 overflow-x-scroll no-sidebar-container z-30 items-center gap-x-2 rounded-xl p-1.5"
            >
              <p
                v-for="(label, key) in {
                  items: 'Items',
                  info: 'Customer Information',
                  payment: 'Payment detail',
                  tax: 'Tax information',
                }"
                :key="key"
                class="rounded-lg px-5 py-1.5 text-[10px] cursor-pointer hover:bg-[#ff613c]/20 whitespace-nowrap"
                @click="currentSubTag = key"
                :class="currentSubTag == key ? 'bg-[#ff613c] text-white' : ''"
              >
                {{ label }}
              </p>
            </div>
            <div
              v-if="currentSubTag == 'items'"
              class="min-h-[10vh] max-h-[50vh] bg-white rounded-lg overflow-y-scroll no-sidebar-container px-3"
            >
              <ItemList
                :data="formData"
                @remove="removeItemList"
                :grand="grand_total"
              />
            </div>
            <div v-if="currentSubTag == 'info'">
              <CustomerInfo @checked="customerId" :data="formData" />
            </div>
            <div
              v-if="currentSubTag == 'payment'"
              class="bg-white rounded-lg px-3"
            >
              <PaymentDetail :data="formData" @formData="changeGetForm" />
            </div>
            <div v-if="currentSubTag == 'tax'" class="bg-white rounded-lg px-3">
              <TaxInfo :data="formData" @formData="changeGetTaxForm" />
            </div>
            <div
              v-if="formData.is_inclusive == 1 && currentSubTag == 'payment'"
              class="bg-white rounded-lg px-3"
            >
              <InclusivePart
                :data="formData"
                @formData="changeGetInclusiveForm"
              />
            </div>
            <div class="px-3 pt-2 pb-1 bg-white rounded-lg">
              <p class="text-xs font-medium whitespace-nowrap">
                Sale Comment :
              </p>
              <textarea
                v-model="formData.payment_notes"
                class="px-2 py-1.5 mt-1.5 text-gray-900 border border-gray-300 rounded-md shadow-sm text-xs w-full"
              ></textarea>
            </div>
            <div class="p-3 bg-white rounded-lg">
              <p class="text-xs font-medium text-[#ff613c] pb-2">
                Payment Summary
              </p>
              <div class="flex justify-between items-center">
                <p class="text-xs font-medium">Sub Total :</p>
                <input
                  type="text"
                  disabled
                  v-model="sub_total"
                  class="w-[140px] h-8 px-4 py-1.5 mt-1 text-gray-900 bg-gray-200 border border-gray-300 rounded-md text-xs"
                />
              </div>
              <div class="flex justify-between items-center">
                <p class="text-xs font-medium">Discount :</p>
                <input
                  type="text"
                  disabled
                  v-model="sub_total_discount"
                  class="w-[140px] h-8 px-4 py-1.5 mt-1 text-gray-900 bg-gray-200 border border-gray-300 rounded-md text-xs"
                />
              </div>
              <div class="flex justify-between items-center">
                <p class="text-xs font-medium">Total :</p>
                <input
                  type="text"
                  disabled
                  v-model="grand_total"
                  class="w-[140px] h-8 px-4 py-1.5 mt-1 text-gray-900 bg-gray-200 border border-gray-300 rounded-md text-xs"
                />
              </div>
              <div class="flex justify-between items-center">
                <p class="text-xs font-medium">Deposit :</p>
                <input
                  type="text"
                  v-model="formData.deposit"
                  class="w-[140px] h-8 px-4 py-1.5 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md text-xs"
                />
              </div>
              <div class="flex justify-between items-center">
                <p class="text-xs font-medium">Balance Due :</p>
                <input
                  type="text"
                  disabled
                  v-model="balance_due"
                  class="w-[140px] h-8 px-4 py-1.5 mt-1 text-gray-900 bg-gray-200 border border-gray-300 rounded-md text-xs"
                />
              </div>
              <div
                v-if="formData.deposit > 0"
                class="flex justify-between items-start"
              >
                <p class="text-xs font-medium pt-2">Reciept Image :</p>
                <div
                  class="cursor-pointer mt-2 w-[140px] h-[80px] border-2 border-dashed border-gray-300 rounded flex justify-center items-center"
                  @click.prevent="openShowModal = true"
                >
                  <span class="text-xs"
                    ><i
                      class="px-2 py-1 text-sm font-semibold text-white bg-[#ff613c] rounded-full shadow fa-solid fa-plus"
                    ></i
                  ></span>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-start mt-4 mb-4 space-x-3">
              <input
                type="checkbox"
                v-model="checkCondition"
                class="w-6 h-6 border-gray-300 rounded-lg"
              />
              <p class="text-xs">click get allow update !</p>
            </div>
            <!-- Desktop receipts -->
            <div
              class="p-3 bg-white rounded-lg mt-4"
              v-if="formData.receipt_image.length > 0"
            >
              <p class="text-xs font-medium text-[#ff613c] pb-2">
                Receipt Images
              </p>
              <div class="space-y-3">
                <div
                  v-for="(receipt, index) in formData.receipt_image"
                  :key="index"
                  class="border border-gray-200 rounded-lg p-3"
                >
                  <div v-if="receipt.is_internal_transfer" class="space-y-2">
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center gap-2">
                        <span
                          class="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium"
                          >Internal Transfer</span
                        ><span class="text-xs text-gray-600"
                          >Rate: {{ receipt.exchange_rate }}</span
                        >
                      </div>
                      <div class="flex items-center space-x-2">
                        <button
                          @click="editFeatureSelectImage(receipt)"
                          class="text-blue-500"
                        >
                          <PencilSquareIcon class="w-5 h-5" />
                        </button>
                        <button
                          v-if="authStore.isSuperAdmin"
                          @click="
                            receipt.id
                              ? deleteInternalTransfer(receipt.id)
                              : removeFeatureSelectImage(index)
                          "
                          class="text-red-500"
                        >
                          <XCircleIcon class="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                      <div class="bg-red-50 p-2 rounded">
                        <p class="text-xs font-semibold text-red-700 mb-2">
                          FROM
                        </p>
                        <div
                          v-for="(f, i) in receipt.from_files"
                          :key="i"
                          class="bg-white p-2 rounded mb-1"
                        >
                          <img
                            v-if="f.preview"
                            :src="f.preview"
                            class="w-full h-24 object-cover rounded mb-1"
                          />
                          <div class="text-[10px] space-y-0.5">
                            <p>
                              <strong>Amount:</strong> {{ f.currency }}
                              {{ f.amount?.toLocaleString() }}
                            </p>
                            <p><strong>From:</strong> {{ f.sender }}</p>
                            <p><strong>To:</strong> {{ f.receiver }}</p>
                          </div>
                        </div>
                      </div>
                      <div class="bg-green-50 p-2 rounded">
                        <p class="text-xs font-semibold text-green-700 mb-2">
                          TO
                        </p>
                        <div
                          v-for="(f, i) in receipt.to_files"
                          :key="i"
                          class="bg-white p-2 rounded mb-1"
                        >
                          <img
                            v-if="f.preview"
                            :src="f.preview"
                            class="w-full h-24 object-cover rounded mb-1"
                          />
                          <div class="text-[10px] space-y-0.5">
                            <p>
                              <strong>Amount:</strong> {{ f.currency }}
                              {{ f.amount?.toLocaleString() }}
                            </p>
                            <p><strong>From:</strong> {{ f.sender }}</p>
                            <p><strong>To:</strong> {{ f.receiver }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="flex items-start gap-3">
                    <img
                      v-if="receipt.preview"
                      :src="receipt.preview"
                      class="w-24 h-24 object-cover rounded"
                    />
                    <div class="flex-1">
                      <div class="flex items-center justify-between mb-1">
                        <span
                          class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium"
                          >Direct Banking</span
                        >
                        <button
                          v-if="authStore.isSuperAdmin"
                          @click="
                            receipt.id
                              ? deleteImage(receipt.id)
                              : removeFeatureSelectImage(index)
                          "
                          class="text-red-500"
                        >
                          <XCircleIcon class="w-5 h-5" />
                        </button>
                      </div>
                      <div class="text-xs space-y-1">
                        <p>
                          <strong>Amount:</strong> {{ receipt.currency }}
                          {{ receipt.amount }}
                        </p>
                        <p><strong>From:</strong> {{ receipt.sender }}</p>
                        <p><strong>To:</strong> {{ receipt.receiver }}</p>
                        <p>
                          <strong>Date:</strong> {{ formatDate(receipt.date) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- /desktop -->

    <!-- ══════════════════════════════════════════════════════════
         MOBILE  3-screen flow:
           mobileScreen === 'detail'  →  booking detail + item list
           mobileScreen === 'add'     →  product browser
           mobileScreen === 'review'  →  review sheet (create-flow style)
    ══════════════════════════════════════════════════════════ -->
    <div class="flex flex-col h-screen lg:hidden bg-[#f5f5f0]">
      <Navbar />

      <!-- ─────────────── SCREEN 1: DETAIL ─────────────── -->
      <div
        v-if="mobileScreen === 'detail'"
        class="flex flex-col flex-1 overflow-hidden"
      >
        <!-- top bar -->
        <div
          class="flex items-center justify-between px-3 py-2.5 bg-white border-b border-[#f0ede8] shrink-0 gap-2"
        >
          <p class="text-sm font-semibold text-gray-800 shrink-0">Detail</p>
          <div class="flex items-center gap-1.5 flex-wrap justify-end">
            <button
              @click="openPrintModal = true"
              class="flex items-center gap-1 bg-[#ff613c] text-white text-[11px] font-medium px-2.5 py-1.5 rounded-lg"
            >
              <PrinterIcon class="w-3.5 h-3.5" /> PNG
            </button>
            <button
              v-if="formData.is_inclusive == 1"
              @click="openPaid"
              class="flex items-center gap-1 bg-gray-600 text-white text-[11px] font-medium px-2.5 py-1.5 rounded-lg"
            >
              <PrinterIcon class="w-3.5 h-3.5" /> PDF
            </button>
            <div
              @click="openAddUserModal = true"
              class="flex items-center gap-1 bg-green-500 text-white text-[11px] font-medium px-2.5 py-1.5 rounded-lg cursor-pointer relative"
            >
              <UserPlusIcon class="w-3.5 h-3.5" />
              <span
                v-if="
                  formData.user_name && formData.user_id && userData == null
                "
                class="max-w-[60px] truncate"
                >{{ formData.user_name }}</span
              >
              <span v-else-if="userData != null">{{ userData[0]?.name }}</span>
              <span v-else>Connect</span>
              <div
                v-if="authStore.isSuperAdmin && formData.user_id != undefined"
                @click.stop="removeUserAdd"
                class="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow"
              >
                <TrashIcon class="w-3 h-3 text-red-500" />
              </div>
            </div>
            <button
              v-if="allowCreate"
              @click="onSubmitHandler"
              class="flex items-center gap-1 bg-[#ff613c] text-white text-[11px] font-medium px-2.5 py-1.5 rounded-lg"
            >
              <PencilSquareIcon class="w-3.5 h-3.5" /> Update
            </button>
            <button
              v-else
              class="flex items-center gap-1 bg-gray-400 text-white text-[11px] font-medium px-2.5 py-1.5 rounded-lg"
              disabled
            >
              <PencilSquareIcon class="w-3.5 h-3.5" /> Update
            </button>
          </div>
        </div>

        <!-- scrollable: stat cards + DetailItemVue (has "Add new items" button) -->
        <div
          class="flex-1 overflow-y-auto px-3 pt-3 pb-4 space-y-3 scrollbar-hide"
        >
          <DetailListVue
            :data="formData"
            :total="grand_total"
            :balance_due="balance_due"
          />
          <!-- DetailItemVue renders the item grid + "Add new items" blue button.
               :showEditPart is the callback for that button → go to 'add' screen -->
          <DetailItemVue
            :data="formData"
            @print="openPrintModal = true"
            @addItem="
              () => {
                mobileScreen = 'add';
              }
            "
            :showEditPart="
              () => {
                mobileScreen = 'add';
              }
            "
            :uploadingAction="
              () => {
                updatingLoading = !updatingLoading;
              }
            "
          />
        </div>

        <!-- bottom CTA: tap to open review -->
        <div
          @click="mobileScreen = 'review'"
          class="flex items-center justify-between bg-[#ff613c] px-5 py-3.5 shrink-0 cursor-pointer"
        >
          <div>
            <p class="text-sm font-semibold text-white leading-tight">
              {{ formData.items.length }} item{{
                formData.items.length !== 1 ? "s" : ""
              }}
            </p>
            <p class="text-[11px] text-white/70">Tap to review &amp; submit</p>
          </div>
          <div class="flex items-center gap-1 text-white font-semibold">
            <span>฿ {{ grand_total ?? 0 }}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M4 6l4 4 4-4"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
      <!-- /screen 1 -->

      <!-- ─────────────── SCREEN 2: ADD ITEMS ──────────── -->
      <div
        v-if="mobileScreen === 'add'"
        class="flex flex-col flex-1 overflow-hidden"
      >
        <!-- category tabs -->
        <div
          class="flex items-center gap-2 px-3 py-2 bg-white border-b border-[#f0ede8] overflow-x-auto shrink-0 scrollbar-hide"
        >
          <button
            @click="mobileScreen = 'detail'"
            class="flex items-center gap-1.5 pl-2 pr-3 py-1.5 rounded-full border border-[#e8e5e0] bg-white whitespace-nowrap shrink-0 text-xs text-gray-600 font-medium cursor-pointer"
          >
            <div
              class="w-[26px] h-[26px] rounded-full bg-gray-100 flex items-center justify-center shrink-0"
            >
              <ArrowLeftIcon class="w-3.5 h-3.5 text-gray-500" />
            </div>
            Back
          </button>
          <div
            v-for="l in productArray"
            :key="l.id"
            class="flex items-center gap-1.5 pl-2 pr-3 py-1.5 rounded-full border cursor-pointer whitespace-nowrap shrink-0 text-xs font-medium transition-all"
            :class="
              currentTag === l.name
                ? 'bg-[#ff613c] border-[#ff613c] text-white'
                : 'bg-white border-[#e8e5e0] text-[#555]'
            "
            @click="currentTag = l.name"
          >
            <div
              class="w-[26px] h-[26px] rounded-full flex items-center justify-center overflow-hidden shrink-0"
              :class="
                currentTag === l.name
                  ? 'bg-white/20'
                  : 'bg-gradient-to-r from-[#ff5b00]/40 to-[#ff613c]/70'
              "
            >
              <img
                :src="l.image"
                :alt="l.name"
                class="w-4 h-4 object-contain"
              />
            </div>
            {{ l.name }}
          </div>
        </div>

        <!-- product list -->
        <div
          class="flex-1 overflow-y-auto overflow-x-hidden p-3 scrollbar-hide"
        >
          <transition name="slide" mode="out-in">
            <component
              :is="currentComponent"
              :key="currentTag"
              @formData="changeGetItem"
            />
          </transition>
        </div>

        <!-- bottom bar: item count, tap to go review -->
        <div
          @click="mobileScreen = 'review'"
          class="flex items-center justify-between bg-[#ff613c] px-5 py-3.5 shrink-0 cursor-pointer"
        >
          <div>
            <p class="text-sm font-semibold text-white leading-tight">
              {{ formData.items.length }} item{{
                formData.items.length !== 1 ? "s" : ""
              }}
              added
            </p>
            <p class="text-[11px] text-white/70">Tap to review booking</p>
          </div>
          <div class="flex items-center gap-1 text-white font-semibold">
            <span>฿ {{ grand_total ?? 0 }}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M4 6l4 4 4-4"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
      <!-- /screen 2 -->

      <!-- ─────────────── SCREEN 3: REVIEW & SUBMIT ─────── -->
      <div
        v-if="mobileScreen === 'review'"
        class="flex flex-col flex-1 overflow-hidden bg-white"
      >
        <!-- top nav row -->
        <div
          class="flex items-center justify-between px-4 pt-3 pb-1.5 border-b border-[#f0ede8] shrink-0"
        >
          <button
            @click="mobileScreen = 'detail'"
            class="flex items-center gap-1.5 text-xs text-gray-500 font-medium"
          >
            <ArrowLeftIcon class="w-4 h-4" /> Back
          </button>
          <p class="text-sm font-semibold text-gray-800">Review Booking</p>
          <button
            @click="mobileScreen = 'add'"
            class="flex items-center gap-1.5 text-xs text-[#ff613c] font-semibold"
          >
            <PlusIcon class="w-4 h-4" /> Add More
          </button>
        </div>

        <!-- sub-tabs (Items / Customer / Payment / Tax / Confirm) -->
        <div
          class="flex px-4 border-b border-[#f0ede8] overflow-x-auto shrink-0 scrollbar-hide"
        >
          <span
            v-for="(tab, key) in {
              items: 'Items',
              info: 'Customer',
              payment: 'Payment',
              tax: 'Tax Info',
              confirm: 'Confirm',
            }"
            :key="key"
            class="px-3.5 py-[9px] text-xs font-medium cursor-pointer whitespace-nowrap border-b-2 transition-all"
            :class="
              currentSubTag === key
                ? 'text-[#ff613c] border-[#ff613c]'
                : 'text-[#888] border-transparent'
            "
            @click="currentSubTag = key"
            >{{ tab }}</span
          >
        </div>

        <!-- scrollable body -->
        <div class="flex-1 overflow-y-auto px-4 pt-3.5 pb-8 scrollbar-hide">
          <!-- ITEMS tab: create-flow style item cards ──── -->
          <div v-if="currentSubTag === 'items'" class="space-y-3">
            <div
              v-if="formData.items.length === 0"
              class="text-center py-14 text-gray-400"
            >
              <PlusIcon class="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p class="text-sm">No items yet</p>
              <button
                @click="mobileScreen = 'add'"
                class="mt-3 text-[#ff613c] text-xs font-semibold"
              >
                + Add Items
              </button>
            </div>

            <!-- Item card (mirrors DetailItem.vue card style from create flow) -->
            <div
              v-for="(i, idx) in formData.items"
              :key="idx"
              class="bg-[#fafaf8] rounded-[14px] border border-[#eeebe6] p-3"
              :class="i?.product_type != undefined ? '' : 'hidden'"
            >
              <!-- product header -->
              <div class="flex items-start gap-3">
                <img
                  :src="i?.product_image || 'https://placehold.co/400'"
                  class="w-14 h-14 rounded-xl object-cover shrink-0"
                  alt=""
                />
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-semibold text-gray-800 line-clamp-1">
                    {{ i?.product_name }}
                  </p>
                  <p class="text-[10px] text-gray-500 line-clamp-1">
                    {{ i?.item_name }}
                  </p>
                  <p class="text-[10px] text-gray-400">{{ i?.service_date }}</p>
                </div>
                <button
                  @click="removeItemList({ id: i.product_id, index: idx })"
                  class="text-red-400 shrink-0"
                >
                  <XCircleIcon class="w-5 h-5" />
                </button>
              </div>

              <!-- crm badge -->
              <div
                v-if="i?.crm_id"
                class="flex items-center justify-between mt-2"
              >
                <span
                  class="text-[10px] font-medium px-2 py-0.5 rounded-full"
                  :class="
                    i?.is_inclusive == 1
                      ? 'bg-yellow-200 text-yellow-800'
                      : 'bg-gray-100 text-gray-600'
                  "
                  >{{ i?.crm_id }}</span
                >
                <DocumentCheckIcon class="w-4 h-4 text-[#ff613c]" />
              </div>

              <!-- status indicators -->
              <div class="mt-2 space-y-1 border-t border-[#f0ede8] pt-2">
                <template v-if="i?.product_type != 1">
                  <div class="flex justify-between items-center">
                    <p class="text-[10px] text-gray-500">Expense Status</p>
                    <CheckBadgeIcon
                      v-if="i?.payment_status == 'fully_paid'"
                      class="w-4 h-4 text-green-500"
                    /><XMarkIcon v-else class="w-4 h-4 text-red-400" />
                  </div>
                  <div class="flex justify-between items-center">
                    <p class="text-[10px] text-gray-500">Passport Info</p>
                    <CheckBadgeIcon
                      v-if="i?.associated_customer?.length > 0"
                      class="w-4 h-4 text-green-500"
                    /><XMarkIcon v-else class="w-4 h-4 text-red-400" />
                  </div>
                  <div class="flex justify-between items-center">
                    <p class="text-[10px] text-gray-500">Confirmation</p>
                    <CheckBadgeIcon
                      v-if="i?.reservation_status == 'confirmed'"
                      class="w-4 h-4 text-green-500"
                    /><XMarkIcon v-else class="w-4 h-4 text-red-400" />
                  </div>
                </template>
                <template v-if="i?.product_type == 1">
                  <div class="flex justify-between items-center">
                    <p class="text-[10px] text-gray-500">Driver Collect</p>
                    <CheckBadgeIcon
                      v-if="i?.is_driver_collect"
                      class="w-4 h-4 text-green-500"
                    /><XMarkIcon v-else class="w-4 h-4 text-red-400" />
                  </div>
                  <div class="flex justify-between items-center">
                    <p class="text-[10px] text-gray-500">Route Plan</p>
                    <CheckBadgeIcon
                      v-if="i?.route_plan"
                      class="w-4 h-4 text-green-500"
                    /><XMarkIcon v-else class="w-4 h-4 text-red-400" />
                  </div>
                  <div class="flex justify-between items-center">
                    <p class="text-[10px] text-gray-500">Pick-up details</p>
                    <CheckBadgeIcon
                      v-if="i?.pickup_time && i?.pickup_location"
                      class="w-4 h-4 text-green-500"
                    /><XMarkIcon v-else class="w-4 h-4 text-red-400" />
                  </div>
                </template>
              </div>

              <!-- amount -->
              <div
                class="flex justify-between items-center mt-2 pt-2 border-t border-[#f0ede8]"
              >
                <p class="text-sm font-bold text-gray-800">
                  {{ i?.total_amount?.toLocaleString() }} ฿
                </p>
                <span
                  v-if="i?.cancellation == 'cancel_confirm'"
                  class="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium"
                  >Cancelled</span
                >
              </div>
            </div>

            <!-- totals row -->
            <div
              v-if="formData.items.length > 0"
              class="bg-[#ff613c]/10 rounded-xl p-3 flex justify-between items-center"
            >
              <p class="text-xs font-semibold text-[#ff613c]">Grand Total</p>
              <p class="text-base font-bold text-[#ff613c]">
                ฿ {{ grand_total ?? 0 }}
              </p>
            </div>
          </div>

          <!-- CUSTOMER tab ──────────────────────────── -->
          <div v-if="currentSubTag === 'info'" class="mb-1">
            <CustomerInfo @checked="customerId" :data="formData" />
          </div>

          <!-- PAYMENT tab ───────────────────────────── -->
          <div v-if="currentSubTag === 'payment'" class="mb-1 space-y-3">
            <PaymentDetail :data="formData" @formData="changeGetForm" />
            <div v-if="formData.is_inclusive == 1">
              <InclusivePart
                :data="formData"
                @formData="changeGetInclusiveForm"
              />
            </div>
          </div>

          <!-- TAX tab ────────────────────────────────── -->
          <div v-if="currentSubTag === 'tax'" class="mb-1">
            <TaxInfo :data="formData" @formData="changeGetTaxForm" />
          </div>

          <!-- CONFIRM tab ─────────────────────────────── -->
          <div v-if="currentSubTag === 'confirm'" class="space-y-4">
            <!-- comment -->
            <div>
              <label class="block text-xs font-medium text-[#444] mb-1.5"
                >Sale Comment</label
              >
              <textarea
                v-model="formData.payment_notes"
                rows="2"
                placeholder="Add a note…"
                class="w-full border border-[#e0ddd8] rounded-[10px] px-3 py-2.5 text-xs text-gray-700 resize-none outline-none focus:border-[#ff613c]"
              ></textarea>
            </div>

            <!-- payment summary card -->
            <div
              class="bg-[#fafaf8] rounded-[14px] border border-[#eeebe6] p-3.5"
            >
              <p
                class="text-[11px] font-semibold text-[#ff613c] uppercase tracking-wide mb-2.5"
              >
                Payment Summary
              </p>

              <div
                v-for="(row, idx) in [
                  { label: 'Sub Total', val: '฿ ' + (sub_total ?? 0) },
                  { label: 'Discount', val: '฿ ' + (sub_total_discount ?? 0) },
                  { label: 'Total', val: '฿ ' + (grand_total ?? 0) },
                  { label: 'Balance Due', val: '฿ ' + (balance_due ?? 0) },
                ]"
                :key="idx"
                class="flex justify-between items-center py-[7px] text-[13px] text-[#555]"
                :class="idx < 3 ? 'border-b border-[#f0ede8]' : ''"
              >
                <span>{{ row.label }}</span>
                <span
                  class="bg-[#f0ede8] text-[#666] font-medium px-3 py-1 rounded-lg"
                  >{{ row.val }}</span
                >
              </div>

              <!-- deposit -->
              <div
                class="flex justify-between items-center py-[7px] border-b border-[#f0ede8] text-[13px] text-[#555]"
              >
                <span>Deposit</span>
                <input
                  type="number"
                  v-model="formData.deposit"
                  placeholder="0"
                  class="w-[110px] border border-gray-300 rounded-lg px-2.5 py-1.5 text-sm text-right text-gray-700 outline-none focus:border-[#ff613c]"
                />
              </div>

              <!-- receipt upload -->
              <div
                v-if="formData.deposit > 0"
                class="flex items-center justify-between mt-2.5 pt-2.5 border-t border-[#f0ede8]"
              >
                <span class="text-[13px] text-[#555]">Receipt Image</span>
                <button
                  class="bg-[#ff613c] text-white text-sm font-medium rounded-full px-4 py-[7px] cursor-pointer"
                  @click.prevent="openShowModal = true"
                >
                  + Add Slip
                </button>
              </div>

              <!-- receipt compact list -->
              <div
                v-if="formData.receipt_image.length > 0"
                class="mt-3 space-y-2"
              >
                <div
                  v-for="(receipt, index) in formData.receipt_image"
                  :key="index"
                  class="flex items-center gap-2 bg-white rounded-lg p-2 border border-gray-100"
                >
                  <img
                    v-if="!receipt.is_internal_transfer && receipt.preview"
                    :src="receipt.preview"
                    class="w-10 h-10 object-cover rounded-lg shrink-0"
                  />
                  <div
                    v-else
                    class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0"
                  >
                    <span
                      class="text-[8px] text-purple-600 font-bold text-center leading-tight"
                      >INT<br />TFR</span
                    >
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-[10px] font-medium text-gray-700 truncate">
                      {{
                        receipt.is_internal_transfer
                          ? "Internal Transfer"
                          : "Direct Banking"
                      }}
                    </p>
                    <p class="text-[9px] text-gray-400">
                      {{ receipt.currency }} {{ receipt.amount }}
                    </p>
                  </div>
                  <button
                    v-if="authStore.isSuperAdmin || !receipt.id"
                    @click="
                      receipt.is_internal_transfer
                        ? receipt.id
                          ? deleteInternalTransfer(receipt.id)
                          : removeFeatureSelectImage(index)
                        : receipt.id
                          ? deleteImage(receipt.id)
                          : removeFeatureSelectImage(index)
                    "
                    class="text-red-400 shrink-0"
                  >
                    <XCircleIcon class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <!-- allow-update checkbox -->
            <div class="flex items-center gap-3">
              <input
                type="checkbox"
                v-model="checkCondition"
                class="w-5 h-5 rounded border-gray-300 accent-[#ff613c]"
              />
              <p class="text-xs text-gray-500">click to allow update!</p>
            </div>

            <!-- submit button -->
          </div>
        </div>
        <!-- /scrollable body -->
        <div class="p-2">
          <button
            v-if="currentSubTag != 'confirm'"
            @click="onNext"
            class="w-full bg-[#ff613c] text-white text-[15px] font-semibold rounded-[14px] py-[15px] border-0 cursor-pointer mt-1 transition-opacity"
          >
            Next
          </button>
          <div v-if="currentSubTag === 'confirm'" class="w-full">
            <button
              v-if="allowCreate"
              @click="onSubmitHandler"
              class="w-full bg-[#ff613c] text-white text-[15px] font-semibold rounded-[14px] py-[15px] border-0 cursor-pointer mt-1"
            >
              Update Booking
            </button>
            <button
              v-else
              class="w-full bg-gray-300 text-white text-[15px] font-semibold rounded-[14px] py-[15px] border-0 cursor-not-allowed mt-1"
              disabled
            >
              Fill required fields to update
            </button>
          </div>
        </div>
      </div>
      <!-- /screen 3 -->
    </div>
    <!-- /mobile -->

    <!-- ══════════════════════════════════════════════════════════
         SHARED MODALS
    ══════════════════════════════════════════════════════════ -->
    <p
      v-if="updatingLoading"
      class="fixed w-full bg-black/80 text-white z-50 h-full top-0 left-0 flex justify-center items-center text-2xl"
    >
      Please wait…
    </p>

    <ArchiveConfirmationModal
      :openModalArchive="openModalArchiveConfirmation"
      :formData="formData"
      :sub_total_discount="sub_total_discount"
      :grand_total_real="grand_total_real"
      :sub_total_real="sub_total_real"
      @closeModal="closeModal"
      @archiveUpdate="handleArchiveUpdate"
      @normalUpdate="handleNormalUpdate"
    />

    <Modal :isOpen="openModalArchive" @closeModal="openModalArchive = false">
      <DialogPanel
        class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-lg font-medium leading-6 text-gray-900 mb-5 flex justify-between items-center"
        >
          ⚠️ Archive Confirmation
          <XMarkIcon
            class="w-6 h-6 text-black cursor-pointer"
            @click="openModalArchive = false"
          />
        </DialogTitle>
        <div class="space-y-1">
          <p class="text-sm font-medium">
            Do you want to archive this invoice?
          </p>
          <p
            v-for="c in [
              'Is all items correct?',
              'Is payment correct?',
              'Is tax correct?',
              'Is discount correct?',
              'Is total correct?',
            ]"
            :key="c"
            class="text-sm"
          >
            <span
              class="bg-[#ff613c] w-3 h-3 mr-2 inline-block rounded-full"
            ></span
            >{{ c }}
          </p>
          <div class="flex justify-between items-center gap-x-4 pt-4">
            <p
              @click="archiveUpdate"
              class="w-full bg-[#ff613c] py-2 shadow text-white text-center text-xs rounded-xl cursor-pointer"
            >
              Archive Update
            </p>
            <p
              @click="normalUpdate"
              class="w-full bg-white py-2 shadow text-[#ff613c] border border-[#ff613c] text-center text-xs rounded-xl cursor-pointer"
            >
              Normal Update
            </p>
          </div>
        </div>
      </DialogPanel>
    </Modal>

    <Modal :isOpen="openPrintModal" @closeModal="openPrintModal = false">
      <DialogPanel
        class="w-full max-w-6xl transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-lg font-medium leading-6 text-gray-900 mb-5 flex justify-between items-center"
        >
          <span class="pl-4">Print Invoice as PNG</span
          ><XMarkIcon
            class="w-6 h-6 text-black cursor-pointer"
            @click="openPrintModal = false"
          />
        </DialogTitle>
        <PngUsage :invoice_id="route.params.id" />
      </DialogPanel>
    </Modal>

    <Modal :isOpen="openShowModal" @closeModal="closeAction">
      <DialogPanel
        class="w-full max-w-5xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-sm text-white bg-[#FF613c] font-medium leading-6 flex justify-between items-center py-2 px-4"
        >
          <p>Payment Slip Audit</p>
          <XCircleIcon
            class="w-5 h-5 text-white cursor-pointer"
            @click="closeAction"
          />
        </DialogTitle>
        <CashImage
          :editData="editData"
          @internal-transfer-submitted="internalTransferAction"
          @direct-banking-submitted="directAction"
        />
      </DialogPanel>
    </Modal>

    <Modal :isOpen="openAddUserModal" @closeModal="openAddUserModal = false">
      <DialogPanel
        class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h3"
          class="text-lg font-medium leading-6 text-gray-900 mb-5"
          >{{ formData.user_id ? "Edit User" : "Add User" }}</DialogTitle
        >
        <div>
          <div class="relative">
            <input
              type="search"
              v-model="unique_key"
              placeholder="Paste User Unique Key"
              class="w-full h-10 px-4 py-2 text-xs text-gray-900 border border-gray-300 rounded-xl shadow-sm focus:outline-none"
            />
            <div
              @click="searchWithUnique"
              class="absolute right-1 top-1 flex items-center gap-2 bg-[#ff613c] text-white px-2 py-2 rounded-xl cursor-pointer text-xs"
            >
              <MagnifyingGlassIcon class="w-4 h-4" /> search
            </div>
          </div>
          <div
            v-if="userData"
            class="w-full border border-gray-300 rounded-xl mt-4 px-4 pb-5"
          >
            <div class="w-20 h-20 overflow-hidden rounded-full mx-auto mt-5">
              <img
                :src="userData[0]?.profile"
                alt=""
                class="w-full h-full object-cover"
              />
            </div>
            <p class="text-center text-xl font-semibold">
              {{ userData[0]?.name }}
            </p>
            <p class="text-center text-sm">{{ userData[0]?.email }}</p>
            <p class="text-center text-sm">
              phone: {{ userData[0]?.phone ?? "-" }}
            </p>
            <p
              class="text-center text-xs text-red-600 bg-red-300/50 p-2 mt-4 rounded"
            >
              Please check user information before adding. User privacy may be
              exposed if wrong.
            </p>
            <div class="flex justify-end items-center gap-x-4 pt-5">
              <button
                @click.prevent="cancelAddUser"
                class="bg-white border border-gray-300 px-3 py-2 rounded-lg text-xs"
              >
                Cancel
              </button>
              <button
                @click.prevent="addUserToBooking(userData[0]?.id)"
                class="bg-[#ff613c] text-white border border-gray-300 px-3 py-2 rounded-lg text-xs"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      </DialogPanel>
    </Modal>
  </div>
</template>

<style>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.35s ease-in-out;
}
.slide-enter-from {
  transform: translateX(100%);
}
.slide-leave-to {
  transform: translateX(-100%);
}

.no-sidebar-container {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.no-sidebar-container::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
