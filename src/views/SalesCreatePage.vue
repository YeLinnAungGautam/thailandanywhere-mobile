<script setup>
import {
  XCircleIcon,
  ArrowDownTrayIcon,
  UserIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/vue/24/outline";
import { PlusIcon, ListBulletIcon } from "@heroicons/vue/24/outline";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import Button from "../components/Button.vue";
import OverView from "./BookingComponent/Vantour.vue";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { Switch } from "@headlessui/vue";
import Modal from "../components/Modal.vue";
import { useToast } from "vue-toastification";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import Vantour from "./BookingComponent/Vantour.vue";
import ItemList from "./BookingComponent/ItemList.vue";
import VantourImage from "../../src/assets/road-trip.png";
import HotelImage from "../../src/assets/hotel.png";
import AttractionImage from "../../src/assets/attractions icon.svg";
import AirlineImage from "../../src/assets/flight icon.svg";
import InclusivePart from "./BookingComponent/InclusivePart.vue";
import CustomerInfo from "./BookingComponent/CustomerInfo.vue";
import PaymentDetail from "./BookingComponent/PaymentDetail.vue";
import { useBookingStore } from "../stores/booking";
import Attraction from "./BookingComponent/Attraction.vue";
import Hotel from "./BookingComponent/Hotel.vue";
import Airline from "./BookingComponent/Airline.vue";
import TaxInfo from "./BookingComponent/TaxInfo.vue";
import { useAdminStore } from "../stores/admin";
import ArchiveConfirmationModal from "./BookingComponent/ConfirmationModel.vue";
import { useAuthStore } from "../stores/auth";
import CashImage from "./CashImageCreate/CashImage.vue";
import Navbar from "../components/Navbar.vue";

// ─── All script logic unchanged ───────────────────────────────────────────────

const currentTag = ref("Hotels");
const currentSubTag = ref("items");
// mobile: controls whether the summary bottom sheet is open
const summarySheetOpen = ref(false);
const addItemModal = ref(false);
const bookingStore = useBookingStore();
const toast = useToast();
const adminStore = useAdminStore();
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const productArray = [
  { id: 1, name: "Hotels", image: HotelImage },
  { id: 2, name: "Van Tours", image: VantourImage },
  { id: 3, name: "Attractions", image: AttractionImage },
  { id: 4, name: "Airlines", image: AirlineImage },
];

const componentsMap = {
  "Van Tours": Vantour,
  Attractions: Attraction,
  Hotels: Hotel,
  Restaurants: Vantour,
  Airlines: Airline,
};

const currentComponent = computed(
  () => componentsMap[currentTag.value] || Vantour,
);

const formData = ref({
  payment_notes: "",
  transfer_code: "",
  customer_id: "",
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

const pendingClonePackageId = ref(null);

const sub_total = computed(() => {
  if (formData.value.is_inclusive != 1) {
    let totalsub = 0;
    for (let i = 0; i < formData.value.items.length; i++) {
      totalsub = totalsub + formData.value.items[i].total_amount * 1;
    }
    return totalsub + sub_total_discount.value * 1;
  } else {
    return formData.value.inclusive_rate * formData.value.inclusive_quantity;
  }
});

const sub_total_real = computed(() => {
  if (formData.value.is_inclusive != 1) {
    let totalsub = 0;
    for (let i = 0; i < formData.value.items.length; i++) {
      if (!formData.value.items[i].is_inclusive) {
        if (formData.value.items[i].product_type) {
          totalsub = totalsub + formData.value.items[i].total_amount * 1;
        }
      }
    }
    return totalsub + sub_total_discount.value * 1;
  } else {
    return formData.value.inclusive_rate * formData.value.inclusive_quantity;
  }
});

const sub_total_discount = computed(() => {
  if (formData.value.is_inclusive != 1) {
    let totalsub = 0;
    for (let i = 0; i < formData.value.items.length; i++) {
      if (!formData.value.items[i].is_inclusive) {
        totalsub = totalsub + formData.value.items[i].discount;
      }
    }
    return totalsub;
  } else {
    return 0;
  }
});

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

const sub_total_airline = computed(() => {
  if (formData.value.is_inclusive != 1) {
    let totalsub = 0;
    for (let i = 0; i < formData.value.items.length; i++) {
      if (!formData.value.items[i].is_inclusive) {
        if (formData.value.items[i].product_type == "7") {
          totalsub = totalsub + formData.value.items[i].total_amount;
        }
      }
    }
    return totalsub;
  } else {
    return 0;
  }
});

const grand_total_real = computed(
  () => sub_total_real.value - sub_total_discount.value * 1,
);

const balance_due_real = computed(() => {
  if (
    grand_total_real.value - formData.value.deposit == 0 &&
    formData.value.items.length != 0
  ) {
    return grand_total_real.value - formData.value.deposit;
  } else if (
    grand_total_real.value - formData.value.deposit != 0 &&
    formData.value.items.length != 0 &&
    formData.value.deposit != 0
  ) {
    return grand_total_real.value - formData.value.deposit;
  } else if (formData.value.deposit == 0 && formData.value.items.length != 0) {
    return grand_total_real.value - formData.value.deposit;
  }
});

const grand_total = computed(
  () => sub_total.value - sub_total_discount.value * 1,
);

const balance_due = computed(() => {
  if (
    grand_total.value - formData.value.deposit == 0 &&
    formData.value.items.length != 0
  ) {
    formData.value.payment_status = "fully_paid";
    return grand_total.value - formData.value.deposit;
  } else if (
    grand_total.value - formData.value.deposit != 0 &&
    formData.value.items.length != 0 &&
    formData.value.deposit != 0
  ) {
    formData.value.payment_status = "partially_paid";
    return grand_total.value - formData.value.deposit;
  } else if (formData.value.deposit == 0 && formData.value.items.length != 0) {
    formData.value.payment_status = "not_paid";
    return grand_total.value - formData.value.deposit;
  }
});

const removeItemList = (message) => {
  if (
    !message ||
    typeof message.id === "undefined" ||
    typeof message.index === "undefined"
  ) {
    console.error("Invalid 'message' object. Must have both 'id' and 'index'.");
    return;
  }
  const items = formData.value.items;
  if (!Array.isArray(items)) {
    console.error("'formData.value.items' is not an array.");
    return;
  }
  const itemAtIndex = items[message.index];
  if (itemAtIndex && itemAtIndex.product_id == message.id) {
    items.splice(message.index, 1);
  } else {
    console.warn("No matching item found at the provided index.");
  }
};

const changeGetForm = (data) => {
  formData.value.balance_due_date = data.balance_due_date;
  formData.value.booking_date = data.booking_date;
  formData.value.money_exchange_rate = data.money_exchange_rate;
  formData.value.payment_currency = data.payment_currency;
  formData.value.payment_method = data.payment_method;
  formData.value.bank_name = data.bank_name;
  formData.value.is_inclusive = data.is_inclusive;
};

const changeGetTaxForm = (data) => {
  formData.value.transfer_code = data.transfer_code;
};

const formatDateDb = (dateString) => {
  if (!dateString) return "";
  if (dateString.includes("T")) return dateString.replace("T", " ");
  const ddmmyyyyRegex = /^(\d{2})-(\d{2})-(\d{4})\s(.*)$/;
  const match = dateString.match(ddmmyyyyRegex);
  if (match) return `${match[3]}-${match[2]}-${match[1]} ${match[4]}`;
  return dateString;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";
  const months = [
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
  const day = String(date.getDate()).padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

const changeGetInclusiveForm = (data) => {
  formData.value.inclusive_name = data.inclusive_name;
  formData.value.inclusive_quantity = data.inclusive_quantity;
  formData.value.inclusive_rate = data.inclusive_rate;
  formData.value.inclusive_start_date = data.inclusive_start_date;
  formData.value.inclusive_end_date = data.inclusive_end_date;
  formData.value.inclusive_description = data.inclusive_description;
};

const formitem = ref({});
const changeGetItem = (data) => {
  if (formData.value.is_inclusive == 1) {
    formitem.value.is_inclusive = 1;
  } else {
    formitem.value.is_inclusive = "";
  }
  formitem.value = data;
  addNewitem();
  formitem.value = {};
};

const changeItemList = (data) => {
  if (formData.value.is_inclusive == 1) {
    formData.value.items[data.id].is_inclusive = 1;
  } else {
    formData.value.items[data.id].is_inclusive = "";
  }
  formData.value.items[data.id] = data.data;
};

const addNewitem = () => {
  formData.value.items.push(formitem.value);
};

const customerId = (data) => {
  formData.value.customer_id = data.id;
  formData.value.customer_name = data.name;
  formData.value.customer_email = data.email;
  formData.value.customer_phone = data.phone_number;
  formData.value.is_corporate = data.is_corporate_customer;
  formData.value.sold_from = data.sold_from;
  formData.value.is_past_info = data.is_past_info;
  formData.value.past_crm_id = data.past_crm_id;
  formData.value.past_user_id = data.past_user_id;
};

const featureImageInput = ref(null);
const featureImagePreview = ref([]);
const openFileFeaturePicker = () => {
  featureImageInput.value.click();
};

const paymentForm = ref({
  file: null,
  preview: null,
  amount: 0,
  bank_name: "",
  date: "",
  sender: "",
  reciever: "MR. THIHA@KUMAR BHUSAL",
  interact_bank: "personal",
  currency: "THB",
  is_corporate: false,
  comment: "",
});

const openShowModal = ref(false);
const closeAction = () => {
  paymentForm.value = {
    id: "",
    file: null,
    preview: null,
    amount: 0,
    date: "",
    bank_name: "",
    sender: "",
    reciever: "MR. THIHA@KUMAR BHUSAL",
    interact_bank: "personal",
    currency: "THB",
    is_corporate: false,
    comment: "",
  };
  openShowModal.value = false;
};

const handlerFeatureFileChange = (e) => {
  let selectedFile = e.target.files[0];
  paymentForm.value.file = selectedFile;
  paymentForm.value.preview = URL.createObjectURL(selectedFile);
};

const submitAddAction = () => {
  formData.value.receipt_image.push(paymentForm.value);
  featureImagePreview.value.push(paymentForm.value);
  paymentForm.value = {
    id: "",
    file: null,
    preview: null,
    amount: 0,
    date: "",
    bank_name: "",
    sender: "",
    reciever: "",
    interact_bank: "personal",
    currency: "THB",
    is_corporate: false,
    comment: "",
  };
  openShowModal.value = false;
};

const removeFeatureSelectImage = (index) => {
  formData.value.receipt_image.splice(index, 1);
  featureImagePreview.value.splice(index, 1);
};

const allowCreate = computed(() => {
  if (
    formData.value.items.length != 0 &&
    formData.value.deposit != 0 &&
    formData.value.receipt_image.length != 0
  )
    return true;
  else if (formData.value.items.length != 0 && formData.value.deposit == 0)
    return true;
  else return false;
});

const errors = ref(null);

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

const tabOrder = ["items", "info", "payment", "tax", "confirm"];

const onNext = () => {
  const currentIndex = tabOrder.indexOf(currentSubTag.value);

  if (currentIndex < tabOrder.length - 1) {
    currentSubTag.value = tabOrder[currentIndex + 1];
  }
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

const openModalArchive = ref(false);
const onSubmitHandler = async () => {
  if (!isNaN(sub_total_real.value) && sub_total_real.value !== null) {
    openModalArchive.value = true;
  } else {
    toast.warning("please check again, item have issue!");
  }
};

const handleArchiveUpdate = () => {
  processSubmission();
  openModalArchive.value = false;
};
const handleNormalUpdate = () => {
  processSubmission();
  openModalArchive.value = false;
};
const closeModal = () => {
  openModalArchive.value = false;
};

const internalTransferAction = (message) => {
  const internalTransferData = {
    is_internal_transfer: true,
    exchange_rate: message.data.exchange_rate,
    note: message.data.notes,
    from_files: message.data.from_images.map((img) => ({
      file: img.image,
      amount: img.amount,
      currency: img.currency,
      sender: img.sender,
      receiver: img.receiver,
      interact_bank: img.interact_bank,
      date: formatDateDb(img.date),
    })),
    to_files: message.data.to_images.map((img) => ({
      file: img.image,
      amount: img.amount,
      currency: img.currency,
      sender: img.sender,
      receiver: img.receiver,
      interact_bank: img.interact_bank,
      date: formatDateDb(img.date),
    })),
  };
  formData.value.receipt_image.push(internalTransferData);
  openShowModal.value = false;
};

const directAction = (message) => {
  const directReceiptData = {
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
  };
  formData.value.receipt_image.push(directReceiptData);
  openShowModal.value = false;
  console.log(message, "this is image message");
};

const processSubmission = async () => {
  if (!isNaN(sub_total_real.value) && sub_total_real.value !== null) {
    if (!validateBasicInfo()) return;
    const frmData = new FormData();
    formData.value.customer_id &&
      frmData.append("customer_id", formData.value.customer_id);
    formData.value.payment_notes &&
      frmData.append("payment_notes", formData.value.payment_notes);
    formData.value.transfer_code &&
      frmData.append("transfer_code", formData.value.transfer_code);
    formData.value.sold_from &&
      frmData.append("sold_from", formData.value.sold_from);
    formData.value.payment_method &&
      frmData.append("payment_method", formData.value.payment_method);
    formData.value.bank_name &&
      frmData.append("bank_name", formData.value.bank_name);
    formData.value.comment && frmData.append("comment", formData.value.comment);
    formData.value.is_past_info
      ? frmData.append("is_past_info", 1)
      : frmData.append("is_past_info", 0);
    formData.value.past_crm_id &&
      frmData.append("past_crm_id", formData.value.past_crm_id);
    formData.value.past_user_id &&
      frmData.append("past_user_id", formData.value.past_user_id);
    formData.value.payment_status &&
      frmData.append("payment_status", formData.value.payment_status);
    formData.value.booking_date &&
      frmData.append("booking_date", formData.value.booking_date);
    if (formData.value.money_exchange_rate) {
      frmData.append("money_exchange_rate", formData.value.money_exchange_rate);
    } else {
      frmData.append("money_exchange_rate", 0);
    }
    sub_total_discount.value
      ? frmData.append("discount", sub_total_discount.value)
      : frmData.append("discount", 0);
    if (formData.value.is_inclusive == 1) {
      frmData.append("is_inclusive", formData.value.is_inclusive);
      frmData.append("inclusive_name", formData.value.inclusive_name);
      frmData.append("inclusive_quantity", formData.value.inclusive_quantity);
      frmData.append("inclusive_rate", formData.value.inclusive_rate);
      frmData.append(
        "inclusive_start_date",
        formData.value.inclusive_start_date,
      );
      frmData.append("inclusive_end_date", formData.value.inclusive_end_date);
      frmData.append(
        "inclusive_description",
        formData.value.inclusive_description,
      );
    }
    sub_total_real.value && frmData.append("sub_total", sub_total_real.value);
    sub_total_airline.value &&
      frmData.append("exclude_amount", sub_total_airline.value);
    grand_total_real.value &&
      frmData.append("grand_total", grand_total_real.value);
    formData.value.deposit && frmData.append("deposit", formData.value.deposit);
    formData.value.payment_currency &&
      frmData.append("payment_currency", formData.value.payment_currency);
    balance_due_real.value &&
      frmData.append("balance_due", balance_due_real.value);
    formData.value.balance_due_date &&
      frmData.append("balance_due_date", formData.value.balance_due_date);
    if (formData.value.confirmation_letter.length > 0) {
      for (let i = 0; i < formData.value.confirmation_letter.length; i++) {
        frmData.append(
          "items[" + i + "][confirmation_letter]",
          formData.value.confirmation_letter[i],
        );
      }
    }
    for (var x = 0; x < formData.value.items.length; x++) {
      if (!validateItemByType(formData.value.items[x])) return;
      const typeMap = {
        1: "App\\Models\\PrivateVanTour",
        2: "App\\Models\\GroupTour",
        3: "App\\Models\\AirportPickup",
        4: "App\\Models\\EntranceTicket",
        5: "App\\Models\\Inclusive",
        6: "App\\Models\\Hotel",
        7: "App\\Models\\Airline",
      };
      if (typeMap[formData.value.items[x].product_type])
        frmData.append(
          "items[" + x + "][product_type]",
          typeMap[formData.value.items[x].product_type],
        );
    }
    if (formData.value.receipt_image?.length > 0) {
      for (let x = 0; x < formData.value.receipt_image.length; x++) {
        const receipt = formData.value.receipt_image[x];
        if (receipt.is_internal_transfer) {
          frmData.append(`receipt_image[${x}][is_internal_transfer]`, true);
          frmData.append(
            `receipt_image[${x}][exchange_rate]`,
            receipt.exchange_rate,
          );
          frmData.append(`receipt_image[${x}][note]`, receipt.note || "");
          receipt.from_files.forEach((f, i) => {
            if (f.file)
              frmData.append(
                `receipt_image[${x}][from_files][${i}][file]`,
                f.file,
              );
            frmData.append(
              `receipt_image[${x}][from_files][${i}][amount]`,
              f.amount,
            );
            frmData.append(
              `receipt_image[${x}][from_files][${i}][currency]`,
              f.currency,
            );
            frmData.append(
              `receipt_image[${x}][from_files][${i}][sender]`,
              f.sender,
            );
            frmData.append(
              `receipt_image[${x}][from_files][${i}][receiver]`,
              f.receiver,
            );
            frmData.append(
              `receipt_image[${x}][from_files][${i}][interact_bank]`,
              f.interact_bank,
            );
            frmData.append(
              `receipt_image[${x}][from_files][${i}][date]`,
              f.date,
            );
          });
          receipt.to_files.forEach((f, i) => {
            if (f.file)
              frmData.append(
                `receipt_image[${x}][to_files][${i}][file]`,
                f.file,
              );
            frmData.append(
              `receipt_image[${x}][to_files][${i}][amount]`,
              f.amount,
            );
            frmData.append(
              `receipt_image[${x}][to_files][${i}][currency]`,
              f.currency,
            );
            frmData.append(
              `receipt_image[${x}][to_files][${i}][sender]`,
              f.sender,
            );
            frmData.append(
              `receipt_image[${x}][to_files][${i}][receiver]`,
              f.receiver,
            );
            frmData.append(
              `receipt_image[${x}][to_files][${i}][interact_bank]`,
              f.interact_bank,
            );
            frmData.append(`receipt_image[${x}][to_files][${i}][date]`, f.date);
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
      }
    }
    for (var x = 0; x < formData.value.items.length; x++) {
      frmData.append(
        "items[" + x + "][product_id]",
        formData.value.items[x].product_id,
      );
      frmData.append(
        "items[" + x + "][is_inclusive]",
        formData.value.is_inclusive == 1 ? 1 : 0,
      );
      frmData.append(
        "items[" + x + "][amount]",
        formData.value.items[x].total_amount,
      );
      formData.value.items[x].pickup_location &&
        frmData.append(
          "items[" + x + "][pickup_location]",
          formData.value.items[x].pickup_location,
        );
      formData.value.items[x].pickup_time &&
        frmData.append(
          "items[" + x + "][pickup_time]",
          formData.value.items[x].pickup_time,
        );
      formData.value.items[x].customer_attachment &&
        frmData.append(
          "items[" + x + "][customer_attachment]",
          formData.value.items[x].customer_attachment,
        );
      formData.value.items[x].cost_price &&
        frmData.append(
          "items[" + x + "][cost_price]",
          formData.value.items[x].cost_price,
        );
      if (
        formData.value.items[x].product_type == "4" &&
        formData.value.items[x].individual_pricing?.adult &&
        formData.value.items[x].individual_pricing?.child
      ) {
        const ip = formData.value.items[x].individual_pricing;
        ["adult", "child"].forEach((g) => {
          frmData.append(
            `items[${x}][individual_pricing][${g}][quantity]`,
            ip[g].quantity,
          );
          frmData.append(
            `items[${x}][individual_pricing][${g}][selling_price]`,
            ip[g].selling_price,
          );
          frmData.append(
            `items[${x}][individual_pricing][${g}][cost_price]`,
            ip[g].cost_price,
          );
          frmData.append(
            `items[${x}][individual_pricing][${g}][total_cost_price]`,
            ip[g].total_cost_price,
          );
          frmData.append(
            `items[${x}][individual_pricing][${g}][amount]`,
            ip[g].amount,
          );
        });
      } else {
        frmData.append("items[" + x + "][individual_pricing]", null);
      }
      formData.value.items[x].discount
        ? frmData.append(
            "items[" + x + "][discount]",
            formData.value.items[x].discount,
          )
        : frmData.append("items[" + x + "][discount]", 0);
      frmData.append(
        "items[" + x + "][total_cost_price]",
        formData.value.items[x].total_cost_price,
      );
      formData.value.items[x].dropoff_location &&
        frmData.append(
          "items[" + x + "][dropoff_location]",
          formData.value.items[x].dropoff_location,
        );
      formData.value.items[x].checkin_date &&
        frmData.append(
          "items[" + x + "][checkin_date]",
          formData.value.items[x].checkin_date,
        );
      formData.value.items[x].room_number &&
        frmData.append(
          "items[" + x + "][room_number]",
          formData.value.items[x].room_number,
        );
      formData.value.items[x].checkout_date &&
        frmData.append(
          "items[" + x + "][checkout_date]",
          formData.value.items[x].checkout_date,
        );
      formData.value.items[x].route_plan &&
        frmData.append(
          "items[" + x + "][route_plan]",
          formData.value.items[x].route_plan,
        );
      if (formData.value.items[x].product_type == "6") {
        if (formData.value.items[x].car_id) {
          frmData.append(
            "items[" + x + "][room_id]",
            formData.value.items[x].car_id,
          );
        } else {
          toast.warning("အခန်းအမျိုးအစား ရွေးချယ်ရန် လိုအပ်ပါသည်");
          return;
        }
      }
      if (["1", "2", "3"].includes(formData.value.items[x].product_type)) {
        if (formData.value.items[x].car_id) {
          frmData.append(
            "items[" + x + "][car_id]",
            formData.value.items[x].car_id,
          );
        } else {
          toast.warning("ကားအမျိုးအစား ရွေးချယ်ရန် လိုအပ်ပါသည်");
          return;
        }
      }
      if (formData.value.items[x].product_type == "4") {
        if (formData.value.items[x].car_id) {
          frmData.append(
            "items[" + x + "][variation_id]",
            formData.value.items[x].car_id,
          );
        } else {
          toast.warning("ticket အမျိုးအစား ရွေးချယ်ရန် လိုအပ်ပါသည်");
          return;
        }
      }
      if (formData.value.items[x].product_type == "7") {
        if (formData.value.items[x].car_id) {
          frmData.append(
            "items[" + x + "][ticket_id]",
            formData.value.items[x].car_id,
          );
        } else {
          toast.warning("ticket အမျိုးအစား ရွေးချယ်ရန် လိုအပ်ပါသည်");
          return;
        }
      }
      formData.value.items[x].service_date &&
        frmData.append(
          "items[" + x + "][service_date]",
          formData.value.items[x].service_date,
        );
      formData.value.items[x].quantity &&
        frmData.append(
          "items[" + x + "][quantity]",
          formData.value.items[x].quantity,
        );
      formData.value.days &&
        frmData.append("items[" + x + "][days]", formData.value.items[x].days);
      formData.value.items[x].duration &&
        frmData.append(
          "items[" + x + "][duration]",
          formData.value.items[x].duration,
        );
      formData.value.items[x].special_request &&
        frmData.append(
          "items[" + x + "][special_request]",
          formData.value.items[x].special_request,
        );
      if (
        formData.value.items[x].passports &&
        formData.value.items[x].passports.length > 0
      ) {
        formData.value.items[x].passports.forEach((passport, pi) => {
          if (passport.name) {
            frmData.append(
              `items[${x}][passports][${pi}][name]`,
              passport.name,
            );
            frmData.append(
              `items[${x}][passports][${pi}][passport]`,
              passport.passport ?? "",
            );
          }
        });
      }
      formData.value.items[x].selling_price &&
        frmData.append(
          "items[" + x + "][selling_price]",
          formData.value.items[x].selling_price,
        );
      formData.value.items[x].comment &&
        frmData.append(
          "items[" + x + "][comment]",
          formData.value.items[x].comment,
        );
      formData.value.items[x].reservation_status &&
        frmData.append(
          "items[" + x + "][reservation_status]",
          formData.value.items[x].reservation_status,
        );
      formData.value.items[x].payment_method &&
        frmData.append(
          "items[" + x + "][payment_method]",
          formData.value.items[x].payment_method,
        );
      formData.value.items[x].payment_status &&
        frmData.append(
          "items[" + x + "][payment_status]",
          formData.value.items[x].payment_status,
        );
      formData.value.items[x].exchange_rate &&
        frmData.append(
          "items[" + x + "][exchange_rate]",
          formData.value.items[x].exchange_rate,
        );
    }
    try {
      const response = await bookingStore.addNewAction(frmData);
      if (response.status == 1) {
        formData.value = {
          customer_id: "",
          transfer_code: "",
          sold_from: "",
          payment_method: "",
          bank_name: "",
          payment_status: "",
          booking_date: "",
          items: [],
          receipt_image: [],
          money_exchange_rate: "",
          crm_id: "",
          discount: "",
          comment: "",
          past_user_id: "",
          is_past_info: false,
          past_crm_id: "",
        };
        errors.value = null;
        featureImagePreview.value = [];
        toast.success(response.message);
        if (pendingClonePackageId.value) {
          try {
            await bookingStore.clonePackageAction(
              response.result.id,
              pendingClonePackageId.value,
            );
          } catch (e) {
            console.warn("Clone package failed:", e);
          }
          pendingClonePackageId.value = null;
        }
        router.push("/sales/edit/" + response.result.id);
        // router.push("/sales");
      }
    } catch (error) {
      if (error.response.data.errors) errors.value = error.response.data.errors;
      toast.error(error.response?.data?.message);
    }
  } else {
    toast.warning("please check again , item have issue !");
  }
};

onMounted(async () => {
  await adminStore.getSimpleListAction();
});
</script>

<template>
  <!-- Root: full-screen flex column -->
  <div class="flex flex-col h-screen overflow-hidden bg-[#f5f5f0]">
    <!-- ── TOP NAV ──────────────────────────────────────── -->
    <Navbar />

    <!-- ── PRODUCT CATEGORY TABS ────────────────────────── -->
    <div
      class="flex gap-2.5 px-4 py-2.5 bg-white border-b border-[#f0ede8] overflow-x-auto shrink-0 scrollbar-hide"
    >
      <div
        v-for="l in productArray"
        :key="l.id"
        class="flex items-center gap-2 pl-2 pr-3.5 py-[7px] rounded-full border cursor-pointer whitespace-nowrap shrink-0 transition-all duration-150"
        :class="[
          currentTag === l.name
            ? 'bg-[#ff613c] border-[#ff613c]'
            : 'bg-white border-[#e8e5e0]',
          user?.role === 'admin' &&
          (l.name === 'Hotels' || l.name === 'Attractions')
            ? 'hidden'
            : '',
        ]"
        @click="currentTag = l.name"
      >
        <div
          class="w-[30px] h-[30px] rounded-full flex items-center justify-center overflow-hidden shrink-0"
          :class="currentTag === l.name ? 'bg-white/10' : 'bg-main'"
        >
          <img
            :src="l.image"
            :alt="l.name"
            class="w-[18px] h-[18px] object-contain"
          />
        </div>
        <span
          class="text-xs font-medium"
          :class="currentTag === l.name ? 'text-white' : 'text-[#555]'"
          >{{ l.name }}</span
        >
      </div>
    </div>

    <!-- ── PRODUCT LIST (scrollable main area) ──────────── -->
    <div class="flex-1 overflow-y-auto overflow-x-hidden p-3 scrollbar-hide">
      <transition name="slide" mode="out-in">
        <component
          :is="currentComponent"
          :key="currentTag"
          @formData="changeGetItem"
        />
      </transition>
    </div>

    <!-- ── BOTTOM TRIGGER BAR ────────────────────────────── -->
    <div
      class="flex items-center justify-between bg-[#ff613c] px-5 py-3 shrink-0 cursor-pointer"
      @click="summarySheetOpen = true"
    >
      <div class="flex flex-col gap-px">
        <span class="text-sm font-semibold text-white">
          {{ formData.items.length }} item{{
            formData.items.length !== 1 ? "s" : ""
          }}
        </span>
        <span class="text-[11px] text-white/75">Tap to review booking</span>
      </div>
      <div class="flex items-center gap-1 text-[15px] font-semibold text-white">
        <span>฿ {{ grand_total ?? 0 }}</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>

    <!-- ── BOTTOM SHEET OVERLAY ──────────────────────────── -->
    <transition name="sheet">
      <div
        v-if="summarySheetOpen"
        class="fixed inset-0 bg-black/40 z-[100] flex flex-col justify-end"
        @click.self="summarySheetOpen = false"
      >
        <div
          class="bg-white rounded-t-[20px] flex flex-col h-[88svh] overflow-hidden"
        >
          <!-- Handle row -->
          <div
            class="flex items-center justify-center relative px-4 pt-2.5 pb-1.5 shrink-0"
          >
            <div class="w-9 h-1 bg-gray-300 rounded-full"></div>
            <!-- <button
              class="absolute right-3.5 bg-transparent border-0 text-gray-400 cursor-pointer flex items-center"
              @click="summarySheetOpen = false"
            >
              <XCircleIcon class="w-5 h-5" />
            </button> -->
          </div>

          <!-- Sub-tabs -->
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
              class="px-3.5 py-[9px] text-xs font-medium cursor-pointer whitespace-nowrap border-b-2 transition-all duration-150"
              :class="
                currentSubTag === key
                  ? 'text-[#ff613c] border-[#ff613c]'
                  : 'text-[#888] border-transparent'
              "
              @click="currentSubTag = key"
              >{{ tab }}</span
            >
          </div>

          <!-- Sheet scrollable body -->
          <div class="flex-1 overflow-y-auto px-4 pt-3.5 pb-8 scrollbar-hide">
            <!-- Items tab -->
            <div v-if="currentSubTag === 'items'" class="mb-1">
              <ItemList
                :data="formData"
                @remove="removeItemList"
                :grand="grand_total"
              />
            </div>

            <!-- Customer tab -->
            <div v-if="currentSubTag === 'info'" class="mb-1">
              <CustomerInfo @checked="customerId" :data="formData" />
            </div>

            <!-- Payment tab -->
            <div v-if="currentSubTag === 'payment'" class="mb-1">
              <PaymentDetail :data="formData" @formData="changeGetForm" />
              <div v-if="formData.is_inclusive == 1" class="mt-3">
                <InclusivePart
                  :data="formData"
                  @formData="changeGetInclusiveForm"
                />
              </div>
            </div>

            <!-- Tax tab -->
            <div v-if="currentSubTag === 'tax'" class="mb-1">
              <TaxInfo :data="formData" @formData="changeGetTaxForm" />
            </div>

            <!-- Sale Comment -->
            <div class="my-3.5" v-if="currentSubTag === 'confirm'">
              <label class="block text-xs font-medium text-[#444] mb-1.5"
                >Sale Comment</label
              >
              <textarea
                v-model="formData.comment"
                rows="2"
                placeholder="Add a note…"
                class="w-full border border-[#e0ddd8] rounded-[10px] px-3 py-2.5 text-[13px] text-gray-700 resize-none outline-none font-[inherit] focus:border-[#ff613c]"
              ></textarea>
            </div>

            <!-- Payment Summary card -->
            <div
              v-if="currentSubTag === 'confirm'"
              class="bg-[#fafaf8] rounded-[14px] border border-[#eeebe6] p-3.5 mb-4"
            >
              <p
                class="text-[11px] font-semibold text-[#ff613c] uppercase tracking-wide mb-2.5"
              >
                Payment Summary
              </p>

              <!-- Sub Total -->
              <div
                class="flex justify-between items-center py-[7px] border-b border-[#f0ede8] text-[13px] text-[#555]"
              >
                <span>Sub Total</span>
                <span
                  class="bg-[#f0ede8] text-[#666] text-base font-medium px-3 py-1 rounded-lg"
                >
                  ฿ {{ sub_total ?? 0 }}
                </span>
              </div>

              <!-- Discount -->
              <div
                class="flex justify-between items-center py-[7px] border-b border-[#f0ede8] text-[13px] text-[#555]"
              >
                <span>Discount</span>
                <span
                  class="bg-[#f0ede8] text-[#666] text-base font-medium px-3 py-1 rounded-lg"
                >
                  ฿ {{ sub_total_discount ?? 0 }}
                </span>
              </div>

              <!-- Total -->
              <div
                class="flex justify-between items-center py-[7px] border-b border-[#f0ede8] text-[13px] text-[#555]"
              >
                <span>Total</span>
                <span
                  class="bg-[#f0ede8] text-[#666] text-base font-medium px-3 py-1 rounded-lg"
                >
                  ฿ {{ grand_total ?? 0 }}
                </span>
              </div>

              <!-- Deposit (editable) -->
              <div
                class="flex justify-between items-center py-[7px] border-b border-[#f0ede8] text-[13px] text-[#555]"
              >
                <span>Deposit</span>
                <input
                  type="number"
                  v-model="formData.deposit"
                  placeholder="0"
                  class="w-[110px] border border-gray-300 rounded-lg px-2.5 py-1.5 text-base text-right text-gray-700 outline-none focus:border-[#ff613c]"
                />
              </div>

              <!-- Balance Due -->
              <div
                class="flex justify-between items-center py-[7px] text-[13px] text-[#555]"
              >
                <span>Balance Due</span>
                <span
                  class="bg-[#f0ede8] text-[#666] text-base font-medium px-3 py-1 rounded-lg"
                >
                  ฿ {{ balance_due ?? 0 }}
                </span>
              </div>

              <!-- Receipt upload -->
              <div
                v-if="formData.deposit > 0"
                class="flex items-center justify-between mt-2.5 pt-2.5 border-t border-[#f0ede8]"
              >
                <span class="text-[13px] text-[#555]">Receipt Image</span>
                <button
                  class="bg-[#ff613c] text-white text-base font-medium rounded-full px-4 py-[7px] border-0 cursor-pointer"
                  @click.prevent="openShowModal = true"
                >
                  + Add Slip
                </button>
              </div>

              <!-- Receipt previews -->
              <div
                v-if="featureImagePreview.length > 0"
                class="grid grid-cols-3 gap-2.5 mt-3"
              >
                <div
                  v-for="(image, index) in featureImagePreview"
                  :key="index"
                  class="relative"
                >
                  <button
                    class="absolute -top-2 -right-2 bg-white border-0 rounded-full text-red-500 cursor-pointer flex p-0"
                    @click.prevent="removeFeatureSelectImage(index)"
                  >
                    <XCircleIcon class="w-5 h-5" />
                  </button>
                  <img
                    :src="image.preview"
                    alt=""
                    class="w-full h-auto rounded-lg block"
                  />
                  <input
                    type="number"
                    v-model="formData.receipt_image[index].amount"
                    placeholder="Amount"
                    class="w-full border border-[#e0ddd8] rounded-b-lg px-2 py-1 text-[11px] text-center outline-none"
                  />
                </div>
              </div>
            </div>

            <!-- Confirm button -->
            <!-- <div v-if="currentSubTag === 'confirm'">
              <button
                v-if="allowCreate"
                class="w-full bg-[#ff613c] text-white text-[15px] font-semibold rounded-[14px] py-[15px] border-0 cursor-pointer mt-1 transition-opacity"
                @click="onSubmitHandler"
              >
                Confirm Booking
              </button>
              <button
                v-else
                class="w-full bg-gray-300 text-white text-[15px] font-semibold rounded-[14px] py-[15px] border-0 cursor-not-allowed mt-1"
                disabled
              >
                Add items to continue
              </button>
            </div> -->
          </div>
          <!-- /sheet body -->
          <div class="p-2 flex justify-between items-center gap-x-2">
            <button
              v-if="currentSubTag != 'confirm'"
              @click.self="summarySheetOpen = false"
              class="px-10 border border-[#FF613c] text-main text-[15px] font-semibold rounded-[14px] py-[15px] cursor-pointer mt-1 transition-opacity"
            >
              Close
            </button>
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
                class="w-full bg-[#ff613c] text-white text-[15px] font-semibold rounded-[14px] py-[15px] border-0 cursor-pointer mt-1 transition-opacity"
                @click="onSubmitHandler"
              >
                Confirm Booking
              </button>
              <button
                v-else
                class="w-full bg-gray-300 text-white text-[15px] font-semibold rounded-[14px] py-[15px] border-0 cursor-not-allowed mt-1"
                disabled
              >
                Add items to continue
              </button>
            </div>
          </div>
        </div>
        <!-- /sheet -->
      </div>
      <!-- /overlay -->
    </transition>

    <!-- ── MODALS (unchanged) ──────────────────────────── -->
    <ArchiveConfirmationModal
      :openModalArchive="openModalArchive"
      :formData="formData"
      :sub_total_discount="sub_total_discount"
      :grand_total_real="grand_total_real"
      :sub_total_real="sub_total_real"
      @closeModal="closeModal"
      @archiveUpdate="handleArchiveUpdate"
      @normalUpdate="handleNormalUpdate"
    />

    <!-- <Modal :isOpen="openShowModal" @closeModal="closeAction">
      <DialogPanel
        class="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-sm text-white bg-[#FF613c] font-medium leading-6 flex justify-between items-center py-2 px-4"
        >
          <p>Payment Slip Audit</p>
          <XCircleIcon class="w-5 h-5 text-white" @click="closeAction" />
        </DialogTitle>
        <CashImage
          @internal-transfer-submitted="internalTransferAction"
          @direct-banking-submitted="directAction"
        />
      </DialogPanel>
    </Modal> -->
  </div>
</template>

<style scoped>
/* Tailwind doesn't include scrollbar-hide by default — add it here */
.scrollbar-hide {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Vue transition: slide (product component switch) */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from {
  transform: translateX(100%);
}
.slide-leave-to {
  transform: translateX(-100%);
}

/* Vue transition: sheet (bottom sheet open/close) */
.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.25s ease;
}
.sheet-enter-active .bg-white,
.sheet-leave-active .bg-white {
  transition: transform 0.25s ease;
}
.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}
.sheet-enter-from .bg-white,
.sheet-leave-to .bg-white {
  transform: translateY(100%);
}
</style>
