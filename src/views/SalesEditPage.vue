<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import NavbarVue from "../components/Navbar.vue";
import { Switch } from "@headlessui/vue";
import SalesItemListVue from "../components/SalesItemList.vue";
import CustomerPageVue from "../components/bookingCreate/CustomerPage.vue";
import { useCustomerStore } from "../stores/customer";
import { useAdminStore } from "../stores/admin";
import { storeToRefs } from "pinia";
import SalesInfoPageVue from "../components/bookingCreate/SalesInfoPage.vue";
import CreateSalesItem from "../components/bookingCreate/CreateSalesItem.vue";
import SalesListShowVue from "../components/bookingCreate/SalesListShow.vue";
import { XCircleIcon } from "@heroicons/vue/24/outline";
import { useToastStore } from "../stores/toast";
import { useBookingStore } from "../stores/booking";
import EditSaleItemVue from "../components/bookingCreate/EditSaleItem.vue";
import { useAuthStore } from "../stores/auth";
import SalesInclusivePageVue from "../components/bookingCreate/SalesInclusivePage.vue";

const router = useRouter();
const route = useRoute();
const enabled = ref(false);
const customerStore = useCustomerStore();
const bookingStore = useBookingStore();
const adminStore = useAdminStore();
const toastStore = useToastStore();
const authStore = useAuthStore();

const { customers } = storeToRefs(customerStore);
const { admin } = storeToRefs(adminStore);

const formData = ref({
  id: "",
  payment_notes: "",
  customer_id: "",
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
});

const showCustomer = ref(false);
const showInfo = ref(false);
const showCreateSale = ref(false);
const showEditSale = ref(false);
const editListId = ref("");

const editValue = ref({});
const saleEditPage = (i, index) => {
  console.log(i);
  editListId.value = index;
  console.log(editListId.value);
  showEditSale.value = true;
  editValue.value = i;
};

const sub_total = computed(() => {
  if (formData.value.is_inclusive == 1) {
    return formData.value.inclusive_quantity * formData.value.inclusive_rate;
  } else {
    let totalsub = 0;

    for (let i = 0; i < formData.value.items.length; i++) {
      totalsub = totalsub + formData.value.items[i].total_amount;
      console.log("====================================");
      console.log(
        formData.value.items[i].total_amount,
        i,
        "this is total amount"
      );
      console.log("====================================");
    }
    return totalsub + sub_total_discount.value * 1;
  }
});

const sub_total_real = computed(() => {
  if (formData.value.is_inclusive != 1) {
    let totalsub = 0;
    for (let i = 0; i < formData.value.items.length; i++) {
      if (!formData.value.items[i].is_inclusive) {
        if (
          formData.value.items[i].product_type != "7" &&
          formData.value.items[i].product_type != "App\\Models\\Airline"
        ) {
          totalsub =
            totalsub +
            formData.value.items[i].total_amount +
            formData.value.items[i].discount * 1;
        }
      }
    }
    return totalsub;
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

const sub_total_airline = computed(() => {
  if (formData.value.is_inclusive != 1) {
    let totalsub = 0;
    for (let i = 0; i < formData.value.items.length; i++) {
      if (!formData.value.items[i].is_inclusive) {
        if (
          formData.value.items[i].product_type == "7" ||
          formData.value.items[i].product_type == "App\\Models\\Airline"
        ) {
          totalsub = totalsub + formData.value.items[i].total_amount;
        }
      }
    }
    return totalsub;
  } else {
    return 0;
  }
});

const grand_total_real = computed(() => {
  // console.log(sub_total.value, formData.value.discount);
  // if (formData.value.discount.trim().endsWith("%")) {
  //   let remove = parseFloat(formData.value.discount);
  //   let calculate = (sub_total.value * remove) / 100;
  //   percentageValue.value = calculate;
  //   let final = sub_total_real.value - calculate;
  //   return final;
  // } else {
  //   let final = sub_total_real.value - formData.value.discount;
  //   percentageValue.value = formData.value.discount;
  //   return final;
  // }
  let final = sub_total_real.value - sub_total_discount.value * 1;
  return final;
});

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

const percentageValue = ref("");
const grand_total = computed(() => {
  // console.log(sub_total.value, formData.value.discount);
  // if (formData.value.discount.trim().endsWith("%")) {
  //   let remove = parseFloat(formData.value.discount);
  //   let calculate = (sub_total.value * remove) / 100;
  //   percentageValue.value = calculate;
  //   let final = sub_total.value - calculate;
  //   return final;
  // } else {
  //   let final = sub_total.value - formData.value.discount;
  //   percentageValue.value = formData.value.discount;
  //   return final;
  // }
  let final = sub_total.value - sub_total_discount.value * 1;
  return final;
});
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

const changesCustomerShow = (message) => {
  if (message == "changes") {
    showCustomer.value = false;
  }
};
const changesSalesInfo = (message) => {
  if (message == "changes") {
    showInfo.value = false;
  }
};
const changesCreateSale = (message) => {
  if (message == "changes") {
    showCreateSale.value = false;
  }
};
const changesEditSale = (message) => {
  if (message == "changes") {
    showEditSale.value = false;
    editValue.value = {};
    editListId.value = "";
  }
};
const removeItemList = (message) => {
  if (message == "remove") {
    showEditSale.value = false;
    formData.value.items.splice(editListId.value, 1);
    editValue.value = {};
    editListId.value = "";
  }
};
const showInclusivePart = ref(false);
const changesSalesInclusive = (message) => {
  if (message == "changes") {
    showInclusivePart.value = false;
  }
};
const changeGetInclusiveForm = (data) => {
  console.log(data);
  formData.value.is_inclusive = data.is_inclusive;
  formData.value.inclusive_name = data.inclusive_name;
  formData.value.inclusive_quantity = data.inclusive_quantity;
  formData.value.inclusive_rate = data.inclusive_rate;
  formData.value.inclusive_start_date = data.inclusive_start_date;
  formData.value.inclusive_end_date = data.inclusive_end_date;
  showInclusivePart.value = false;
};

const changeGetForm = (data) => {
  console.log(data);
  formData.value.balance_due_date = data.balance_due_date;
  formData.value.booking_date = data.booking_date;
  formData.value.money_exchange_rate = data.money_exchange_rate;
  formData.value.payment_currency = data.payment_currency;
  formData.value.payment_method = data.payment_method;
  formData.value.sold_from = data.sold_from;
  formData.value.bank_name = data.bank_name;
  formData.value.is_past_info = data.is_past_info;
  formData.value.past_crm_id = data.past_crm_id;
  formData.value.past_user_id = data.past_user_id;
  showInfo.value = false;
};
const formitem = ref({});
const changeGetItem = (data) => {
  console.log(data);
  formitem.value = data;
  addNewitem();
  formitem.value = {};
  console.log(formData.value.items, "this is push items");
  showCreateSale.value = false;
};
const changeItemList = (data) => {
  console.log(data, "this is change item value");
  showEditSale.value = false;
  editValue.value = {};
  formData.value.items[editListId.value] = data;
  editListId.value = "";
};

const addNewitem = () => {
  formData.value.items.push(formitem.value);
};

const customerId = (data) => {
  console.log(data);
  formData.value.customer_id = data;
  customer_name.value = "";
};

const getDeleteFunction = (id) => {
  formData.value.items.splice(id, 1);
};

const goBack = () => {
  router.go(-1);
};

const featureImageInput = ref(null);
const featureImagePreview = ref([]);

const openFileFeaturePicker = () => {
  featureImageInput.value.click();
};

const handlerFeatureFileChange = (e) => {
  let selectedFile = e.target.files;

  for (let index = 0; index < selectedFile.length; index++) {
    formData.value.receipt_image.push(selectedFile[index]);
    featureImagePreview.value.push(URL.createObjectURL(selectedFile[index]));
  }
};

const removeFeatureSelectImage = (index) => {
  formData.value.receipt_image.splice(index, 1);
  featureImagePreview.value.splice(index, 1);
  console.log(formData.value.receipt_image, "this is remove");
};

const checkCondition = ref(false);

const allowCreate = computed(() => {
  console.log(checkCondition.value, "this is check");
  if (
    formData.value.items.length != 0 &&
    formData.value.deposit != 0 &&
    formData.value.receipt_image.length != 0
  ) {
    return true;
  } else if (formData.value.items.length != 0 && formData.value.deposit == 0) {
    return true;
  } else if (formData.value.items.length != 0 && checkCondition.value) {
    return true;
  } else {
    return false;
  }
});

const errors = ref(null);

const onSubmitHandler = async () => {
  if (sub_total_real.value != NaN || sub_total_real.value != null) {
    const frmData = new FormData();
    frmData.append("_method", "PUT");
    formData.value.payment_notes &&
      frmData.append("payment_notes", formData.value.payment_notes);
    formData.value.customer_id &&
      frmData.append("customer_id", formData.value.customer_id);
    formData.value.sold_from &&
      frmData.append("sold_from", formData.value.sold_from);
    formData.value.payment_method &&
      frmData.append("payment_method", formData.value.payment_method);
    formData.value.bank_name &&
      frmData.append("bank_name", formData.value.bank_name);
    console.log(enabled, "this is status");
    // if (enabled.value == true) {
    //   frmData.append("is_past_info", "1");
    //   frmData.append("past_user_id", formData.value.past_user_id);
    //   frmData.append("past_crm_id", formData.value.past_crm_id);
    // } else {
    //   frmData.append("is_past_info", "0");
    // }
    if (formData.value.is_inclusive == 1) {
      frmData.append("is_inclusive", formData.value.is_inclusive);
      frmData.append("inclusive_name", formData.value.inclusive_name);
      frmData.append("inclusive_quantity", formData.value.inclusive_quantity);
      frmData.append("inclusive_rate", formData.value.inclusive_rate);
      frmData.append(
        "inclusive_start_date",
        formData.value.inclusive_start_date
      );
      frmData.append("inclusive_end_date", formData.value.inclusive_end_date);
    }

    formData.value.payment_status &&
      frmData.append("payment_status", formData.value.payment_status);
    formData.value.booking_date &&
      frmData.append("booking_date", formData.value.booking_date);
    formData.value.money_exchange_rate &&
      frmData.append("money_exchange_rate", formData.value.money_exchange_rate);
    console.log(formData.value.money_exchange_rate, "this is ex money");
    // frmData.append("crm_id", formData.value.crm_id);

    // if (formData.value.discount == "" || formData.value.discount == 0) {
    //   frmData.append("discount", 0);
    // } else {
    //   frmData.append("discount", percentageValue.value);
    // }
    sub_total_discount.value &&
      frmData.append("discount", sub_total_discount.value);
    formData.value.comment && frmData.append("comment", formData.value.comment);
    // frmData.append("receipt_image", formData.value.receipt_image);
    sub_total_real.value && frmData.append("sub_total", sub_total_real.value);
    sub_total_airline.value &&
      frmData.append("exclude_amount", sub_total_airline.value);
    grand_total_real.value &&
      frmData.append("grand_total", grand_total_real.value);
    formData.value.deposit && frmData.append("deposit", formData.value.deposit);
    formData.value.payment_currency &&
      frmData.append("payment_currency", formData.value.payment_currency);
    if (balance_due.value) {
      frmData.append("balance_due", balance_due_real.value);
    } else {
      frmData.append("balance_due", 0);
    }
    formData.value.balance_due_date &&
      frmData.append("balance_due_date", formData.value.balance_due_date);

    if (formData.value.confirmation_letter.length > 0) {
      for (let i = 0; i < formData.value.confirmation_letter.length; i++) {
        let file = formData.value.confirmation_letter[i];
        frmData.append("items[" + i + "][confirmation_letter]", file);
      }
    }
    if (formData.value.receipt_image.length != 0) {
      for (let x = 0; x < formData.value.receipt_image.length; x++) {
        frmData.append(
          "receipt_image[" + x + "]",
          formData.value.receipt_image[x]
        );
      }
    }
    for (var x = 0; x < formData.value.items.length; x++) {
      if (
        formData.value.items[x].product_type == "1" ||
        formData.value.items[x].product_type == "App\\Models\\PrivateVanTour"
      ) {
        frmData.append(
          "items[" + x + "][product_type]",
          `App\\Models\\PrivateVanTour`
        );
      } else if (
        formData.value.items[x].product_type == "2" ||
        formData.value.items[x].product_type == "App\\Models\\GroupTour"
      ) {
        frmData.append(
          "items[" + x + "][product_type]",
          `App\\Models\\GroupTour`
        );
      } else if (
        formData.value.items[x].product_type == "3" ||
        formData.value.items[x].product_type == "App\\Models\\AirportPickup"
      ) {
        frmData.append(
          "items[" + x + "][product_type]",
          `App\\Models\\AirportPickup`
        );
      } else if (
        formData.value.items[x].product_type == "4" ||
        formData.value.items[x].product_type == "App\\Models\\EntranceTicket"
      ) {
        frmData.append(
          "items[" + x + "][product_type]",
          `App\\Models\\EntranceTicket`
        );
      } else if (
        formData.value.items[x].product_type == "5" ||
        formData.value.items[x].product_type == "App\\Models\\Inclusive"
      ) {
        frmData.append(
          "items[" + x + "][product_type]",
          `App\\Models\\Inclusive`
        );
      } else if (
        formData.value.items[x].product_type == "6" ||
        formData.value.items[x].product_type == "App\\Models\\Hotel"
      ) {
        frmData.append("items[" + x + "][product_type]", `App\\Models\\Hotel`);
      } else if (
        formData.value.items[x].product_type == "7" ||
        formData.value.items[x].product_type == "App\\Models\\Airline"
      ) {
        frmData.append(
          "items[" + x + "][product_type]",
          `App\\Models\\Airline`
        );
      }
    }
    for (var x = 0; x < formData.value.items.length; x++) {
      frmData.append(
        "items[" + x + "][product_id]",
        formData.value.items[x].product_id
      );
      if (
        !formData.value.items[x].days ||
        formData.value.items[x].days == undefined
      ) {
        frmData.append(
          "items[" + x + "][amount]",
          formData.value.items[x].selling_price *
            formData.value.items[x].quantity -
            formData.value.items[x].discount
        );
      } else if (
        formData.value.items[x].days ||
        formData.value.items[x].days != undefined
      ) {
        frmData.append(
          "items[" + x + "][amount]",
          formData.value.items[x].selling_price *
            formData.value.items[x].quantity *
            formData.value.items[x].days -
            formData.value.items[x].discount
        );
      }
    }
    for (var x = 0; x < formData.value.items.length; x++) {
      if (
        formData.value.items[x].product_type == "7" ||
        formData.value.items[x].product_type == "App\\Models\\Airline"
      ) {
        if (
          !formData.value.items[x].ticket_id ||
          formData.value.items[x].ticket_id == ""
        ) {
          frmData.append(
            "items[" + x + "][ticket_id]",
            formData.value.items[x].car_id
          );
        } else {
          frmData.append(
            "items[" + x + "][ticket_id]",
            formData.value.items[x].ticket_id
          );
        }
      } else if (
        formData.value.items[x].product_type == "6" ||
        formData.value.items[x].product_type == "App\\Models\\Hotel"
      ) {
        if (!formData.value.items[x].room_id) {
          frmData.append(
            "items[" + x + "][room_id]",
            formData.value.items[x].car_id
          );
        } else {
          frmData.append(
            "items[" + x + "][room_id]",
            formData.value.items[x].room_id
          );
        }
      } else if (
        formData.value.items[x].product_type == "4" ||
        formData.value.items[x].product_type == "App\\Models\\EntranceTicket"
      ) {
        if (!formData.value.items[x].variation_id) {
          frmData.append(
            "items[" + x + "][variation_id]",
            formData.value.items[x].car_id
          );
        } else {
          frmData.append(
            "items[" + x + "][variation_id]",
            formData.value.items[x].variation_id
          );
        }
      } else if (
        formData.value.items[x].product_type == "2" ||
        formData.value.items[x].product_type == "App\\Models\\GroupTour"
      ) {
        frmData.append(
          "items[" + x + "][car_id]",
          formData.value.items[x].car_id
        );
      } else if (
        formData.value.items[x].product_type == "1" ||
        formData.value.items[x].product_type == "App\\Models\\PrivateVanTour"
      ) {
        if (!formData.value.items[x].car_id) {
          frmData.append(
            "items[" + x + "][car_id]",
            formData.value.items[x].car_id
          );
        } else {
          frmData.append(
            "items[" + x + "][car_id]",
            formData.value.items[x].car_id
          );
        }
      }
    }

    for (var x = 0; x < formData.value.items.length; x++) {
      formData.value.items[x].service_date &&
        frmData.append(
          "items[" + x + "][service_date]",
          formData.value.items[x].service_date
        );
    }
    for (var x = 0; x < formData.value.items.length; x++) {
      formData.value.items[x].quantity &&
        frmData.append(
          "items[" + x + "][quantity]",
          formData.value.items[x].quantity
        );
      // formData.value.items[x].cost_price
      //   ? frmData.append(
      //       "items[" + x + "][cost_price]",
      //       formData.value.items[x].cost_price
      //     )
      //   : "";
    }
    for (var x = 0; x < formData.value.items.length; x++) {
      formData.value.items[x].days &&
        frmData.append("items[" + x + "][days]", formData.value.items[x].days);
    }
    for (var x = 0; x < formData.value.items.length; x++) {
      formData.value.items[x].pickup_location &&
        frmData.append(
          "items[" + x + "][pickup_location]",
          formData.value.items[x].pickup_location
        );
    }
    for (var x = 0; x < formData.value.items.length; x++) {
      formData.value.items[x].checkin_date &&
        frmData.append(
          "items[" + x + "][checkin_date]",
          formData.value.items[x].checkin_date
        );
      formData.value.items[x].room_number &&
        frmData.append(
          "items[" + x + "][room_number]",
          formData.value.items[x].room_number
        );
    }
    for (var x = 0; x < formData.value.items.length; x++) {
      formData.value.items[x].checkout_date &&
        frmData.append(
          "items[" + x + "][checkout_date]",
          formData.value.items[x].checkout_date
        );
    }
    for (var x = 0; x < formData.value.items.length; x++) {
      formData.value.items[x].pickup_time &&
        frmData.append(
          "items[" + x + "][pickup_time]",
          formData.value.items[x].pickup_time
        );
      frmData.append(
        "items[" + x + "][is_driver_collect]",
        formData.value.items[x].is_driver_collect ? 1 : 0
      );
      if (formData.value.items[x].customer_attachment) {
        frmData.append(
          "items[" + x + "][customer_attachment]",
          formData.value.items[x].customer_attachment
        );
      }
      if (formData.value.items[x].is_inclusive) {
        frmData.append(
          "items[" + x + "][is_inclusive]",
          formData.value.items[x].is_inclusive
        );
      }
      if (formData.value.items[x].reservation_id) {
        frmData.append(
          "items[" + x + "][reservation_id]",
          formData.value.items[x].reservation_id
        );
      } else {
        frmData.append("items[" + x + "][reservation_id]", null);
      }
      formData.value.items[x].dropoff_location &&
        frmData.append(
          "items[" + x + "][dropoff_location]",
          formData.value.items[x].dropoff_location
        );
      formData.value.items[x].route_plan &&
        frmData.append(
          "items[" + x + "][route_plan]",
          formData.value.items[x].route_plan
        );
      formData.value.items[x].duration &&
        frmData.append(
          "items[" + x + "][duration]",
          formData.value.items[x].duration
        );
      formData.value.items[x].special_request &&
        frmData.append(
          "items[" + x + "][special_request]",
          formData.value.items[x].special_request
        );
      formData.value.items[x].comment &&
        frmData.append(
          "items[" + x + "][comment]",
          formData.value.items[x].comment
        );
      formData.value.items[x].selling_price &&
        frmData.append(
          "items[" + x + "][selling_price]",
          formData.value.items[x].selling_price
        );
      formData.value.items[x].exchange_rate &&
        frmData.append(
          "items[" + x + "][exchange_rate]",
          formData.value.items[x].exchange_rate
        );
      frmData.append("items[" + x + "][individual_pricing]", null);
      formData.value.items[x].cost_price &&
        frmData.append(
          "items[" + x + "][cost_price]",
          formData.value.items[x].cost_price
        );
      if (formData.value.items[x].discount) {
        frmData.append(
          "items[" + x + "][discount]",
          formData.value.items[x].discount
        );
      } else {
        frmData.append("items[" + x + "][discount]", 0);
      }
    }

    for (var x = 0; x < formData.value.items.length; x++) {
      formData.value.items[x].reservation_status &&
        frmData.append(
          "items[" + x + "][reservation_status]",
          formData.value.items[x].reservation_status
        );
    }
    for (var x = 0; x < formData.value.items.length; x++) {
      formData.value.items[x].payment_method &&
        frmData.append(
          "items[" + x + "][payment_method]",
          formData.value.items[x].payment_method
        );
    }
    for (var x = 0; x < formData.value.items.length; x++) {
      formData.value.items[x].payment_status &&
        frmData.append(
          "items[" + x + "][payment_status]",
          formData.value.items[x].payment_status
        );
    }

    try {
      const response = await bookingStore.updateAction(
        frmData,
        route.params.id
      );
      formData.value = {
        customer_id: "",
        sold_from: "",
        payment_method: "",
        payment_status: "",
        booking_date: "",
        items: [],
        reciept_image: [],
        money_exchange_rate: "",
        crm_id: "",
        car_name: "",
        discount: "",
        comment: "",
        receipt_image: [],
        confirmation_letter: [],
        due_date: "",
        deposit: 0,
        balance_due_date: "",
        special_request: "",
        past_user_id: "",
        is_past_info: "",
        past_crm_id: "",
      };
      balance_due.value = "";
      featureImagePreview.value = [];

      errors.value = null;
      toastStore.showToast({
        icon: "success",
        title: response.message,
      });
      goBack();
      // bookings/update/65/edit
    } catch (error) {
      if (error.response) {
        toastStore.showToast({
          icon: "error",
          title: error.response.data.message,
        });
      }
    }
  } else {
    toastStore.showToast({
      icon: "error",
      title: "please check again , item have issue !",
    });
  }
};

const checkType = (product) => {
  if (product?.cars) {
    return product.cars;
  }
  if (product?.variations) {
    return product.variations;
  }
  if (product?.rooms) {
    return product.rooms;
  }
  if (product?.tickets) {
    return product.tickets;
  }
};

const depositStoreValue = ref("");
const allowImage = ref(true);
const allowDeposite = computed(() => {
  if (formData.value.deposit == 0) {
    return false;
  } else if (
    formData.value.deposit == depositStoreValue.value &&
    formData.value.deposit != 0
  ) {
    console.log("this is true");
    allowImage.value = false;
    return true;
  } else {
    allowImage.value = true;
    return false;
  }
});

const daysBetween = (a, b) => {
  console.log(a, b);
  if (a && b) {
    const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    const startDateTimestamp = new Date(a).getTime();
    const endDateTimestamp = new Date(b).getTime();
    let result = Math.abs(
      Math.round((endDateTimestamp - startDateTimestamp) / oneDay)
    );
    console.log(formData.value.checkin_date, result, "this is result");
    return result;
  }
};
const choiceProductType = (type) => {
  console.log(type);
  if (type == "App\\Models\\PrivateVanTour") {
    return "1";
  }
  if (type == "App\\Models\\GroupTour") {
    return "2";
  }
  if (type == "App\\Models\\AirportPickup") {
    return "3";
  }
  if (type == "App\\Models\\EntranceTicket") {
    return "4";
  }
  if (type == "App\\Models\\Hotel") {
    return "6";
  }
  if (type == "App\\Models\\Airline") {
    return "7";
  }
};
const totalAmountCheck = (q, s, d, discount) => {
  let totalsub = 0;
  totalsub = q * s * d - discount;
  console.log(q, s, d, discount, "this is total amount");
  return totalsub;
};

const paymentStatus = ref("");
const customer_name = ref("");
const getDetail = async () => {
  try {
    const response = await bookingStore.getDetailAction(route.params.id);
    console.log(response, "this is response get");
    formData.value.id = response.result.id;
    formData.value.customer_id = response.result.customer.id;
    customer_name.value = response.result.customer.name;
    formData.value.payment_notes = response.result.payment_notes;
    formData.value.sold_from = response.result.sold_from;
    formData.value.payment_method = response.result.payment_method;
    formData.value.bank_name = response.result.bank_name;

    formData.value.payment_status = response.result.payment_status;
    paymentStatus.value = response.result.payment_status;
    formData.value.payment_currency = response.result.payment_currency;
    formData.value.booking_date = response.result.booking_date;
    formData.value.money_exchange_rate = response.result.money_exchange_rate;
    formData.value.crm_id = response.result.crm_id;
    formData.value.comment = response.result.comment;
    formData.value.is_inclusive = response.result.is_inclusive;
    formData.value.inclusive_name = response.result.inclusive_name;
    formData.value.inclusive_quantity = response.result.inclusive_quantity;
    formData.value.inclusive_rate = response.result.inclusive_rate;
    formData.value.inclusive_start_date = response.result.inclusive_start_date;
    formData.value.inclusive_end_date = response.result.inclusive_end_date;

    formData.value.past_user_id = response.result.past_user_id
      ? response.result.past_user_id
      : "";
    formData.value.past_crm_id = response.result.past_crm_id
      ? response.result.past_crm_id
      : "";
    formData.value.is_past_info = response.result.is_past_info
      ? response.result.is_past_info
      : "";
    enabled.value = response.result.is_past_info == 1 ? true : false;
    console.log(enabled.value, formData.value.is_past_info, "this is shit");
    formData.value.special_request = response.result.special_request;
    depositStoreValue.value = response.result.deposit;
    if (formData.value.discount != "" || formData.value.discount != null) {
      formData.value.discount = response.result.discount;
    } else {
      formData.value.discount = 0;
    }
    formData.value.balance_due_date = response.result.balance_due_date;
    formData.value.deposit = response.result.deposit;

    for (let i = 0; i < response.result.receipts.length; i++) {
      let data = {
        id: response.result.receipts[i].id,
        // image:
        //   import.meta.env.VITE_API_URL_IMAGE +
        //   response.result.receipts[i].image,
        image: response.result.receipts[i].image,
      };
      formData.value.receipt_images.push(data);
    }
    console.log(formData.value.receipt_images, "this is image");
    for (const x in response.result.items) {
      const itemData = {
        reservation_id: response.result.items[x].id,
        product_type: choiceProductType(response.result.items[x].product_type),
        crm_id: response.result.items[x].crm_id,
        product_id: response.result.items[x].product_id,
        product_name: response.result.items[x].product?.name,
        service_date: response.result.items[x].service_date,
        is_inclusive: response.result.items[x].is_inclusive,
        discount: response.result.items[x].discount,
        quantity: response.result.items[x].quantity,
        days: response.result.items[x].days
          ? response.result.items[x].days
          : "",
        duration: response.result.items[x].duration,
        selling_price: response.result.items[x].selling_price,
        comment:
          response.result.items[x].comment != "null"
            ? response.result.items[x].comment
            : "",
        special_request:
          response.result.items[x].special_request != "null"
            ? response.result.items[x].special_request
            : "",
        reservation_status: response.result.items[x].reservation_status,
        payment_method: response.result.items[x].payment_method,
        payment_status: response.result.items[x].payment_status,
        exchange_rate: response.result.items[x].exchange_rate,
        cost_price: response.result.items[x].cost_price,
        pickup_location:
          response.result.items[x].pickup_location != "null"
            ? response.result.items[x].pickup_location
            : "",
        pickup_time:
          response.result.items[x].pickup_time != "null"
            ? response.result.items[x].pickup_time
            : "",
        is_driver_collect:
          response.result.items[x].is_driver_collect == 1 ? true : false,
        dropoff_location:
          response.result.items[x].dropoff_location != "null"
            ? response.result.items[x].dropoff_location
            : "",
        route_plan:
          response.result.items[x].route_plan != "null"
            ? response.result.items[x].route_plan
            : "",
        car_id: response.result.items[x].car
          ? response.result.items[x].car.id
          : "",
        variation_id: response.result.items[x].variation
          ? response.result.items[x].variation.id
          : "",
        car_name: response.result.items[x].car
          ? response.result.items[x].car.name
          : "",
        variation_name: response.result.items[x].variation
          ? response.result.items[x].variation.name
          : "",
        room_name: response.result.items[x].room
          ? response.result.items[x].room.name
          : "",
        room_id: response.result.items[x].room
          ? response.result.items[x].room.id
          : "",
        ticket_id:
          response.result.items[x].ticket == null &&
          response.result.items[x].product_type == "App\\Models\\Airline"
            ? response.result.items[x].product?.tickets[0]?.id
            : response.result.items[x].ticket?.id || "",
        variation_type: checkType(response.result.items[x].product),
        checkin_date: response.result.items[x].checkin_date
          ? response.result.items[x].checkin_date
          : "",
        room_number: response.result.items[x].room_number
          ? response.result.items[x].room_number
          : "",
        checkout_date: response.result.items[x].checkout_date
          ? response.result.items[x].checkout_date
          : "",
        days: daysBetween(
          response.result.items[x].checkin_date,
          response.result.items[x].checkout_date
        ),

        total_amount: response.result.items[x].checkin_date
          ? totalAmountCheck(
              response.result.items[x].quantity,
              response.result.items[x].selling_price,
              daysBetween(
                response.result.items[x].checkin_date,
                response.result.items[x].checkout_date
              ),
              response.result.items[x].discount
            )
          : response.result.items[x].selling_price *
              response.result.items[x].quantity -
            response.result.items[x].discount,
      };
      formData.value.items.push(itemData);
      console.log(itemData.ticket_id, "this is id");
    }

    console.log(formData.value.items, "this is formData");
  } catch (error) {
    console.log(error);
  }
};

const deleteImage = async (id) => {
  await bookingStore.deleteBookingImage(id);
  toastStore.showToast({
    icon: "success",
    title: "success delete receipt",
  });
  window.location.reload();
  await getDetail();
};

const openPaid = () => {
  window.open(
    import.meta.env.VITE_API_URL +
      "/bookings/" +
      route.params.id +
      "/receipt?paid=1"
  );
};

onMounted(async () => {
  // await customerStore.getSimpleListAction();
  // await adminStore.getSimpleListAction();
  await getDetail();
  console.log(customers.value);
});
</script>

<template>
  <div>
    <NavbarVue />
    <div class="py-5 px-4 space-y-4 bg-black/5 min-h-screen">
      <div class="relative">
        <div
          class="flex justify-start items-center gap-2 text-main absolute top-1"
          @click="goBack"
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
        <div
          @click="openPaid()"
          class="flex justify-start items-center gap-2 text-white bg-main px-2 py-1 rounded absolute top-0 right-0"
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
              d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z"
            />
          </svg>

          Print
        </div>

        <p class="text-main text-xl font-semibold w-full text-center">
          Sales Edit
        </p>
      </div>
      <div class="space-y-5 pt-3 text-sm">
        <div
          class="flex justify-between items-center bg-white px-4 py-2"
          @click="showCustomer = true"
        >
          <p class="text-main" v-if="formData.customer_id == ''">
            customer select
          </p>
          <p class="text-main" v-if="customer_name != ''">
            {{ customer_name }}
          </p>
          <div v-if="!customer_name && formData.customer_id">
            <div class="text-main" v-if="formData.customer_id != ''">
              <div v-for="customer in customers?.data" :key="customer.id">
                <p v-if="customer.id == formData.customer_id" class=" ">
                  {{ customer.name }}
                </p>
              </div>
            </div>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6 text-main"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </div>
        <div class="text-sm">
          <div
            @click="showInfo = true"
            class="flex justify-between items-center text-sm bg-white px-4 py-2"
          >
            <p class="text-main text-sm">Booking Information Add & Detail</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6 text-main"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </div>
          <div class="grid grid-cols-2 gap-3 bg-white pl-4 pr-6 pt-2 pb-4">
            <p>Sale Date</p>
            <p>{{ formData.booking_date }}</p>
            <p>Balance Due Date</p>
            <p>{{ formData.balance_due_date }}</p>
            <p>Sold From</p>
            <p>{{ formData.sold_from }}</p>
            <p>Payment Currency</p>
            <p>{{ formData.payment_currency }}</p>
            <p>Bank Name</p>
            <p>{{ formData.bank_name }}</p>
            <p>Payment Method</p>
            <p>{{ formData.payment_method }}</p>
            <p>Exchange Rate</p>
            <p>{{ formData.money_exchange_rate }}</p>
            <p v-if="formData.is_past_info == 1">Past User ID</p>
            <div class="" v-if="formData.is_past_info == 1">
              <div v-for="a in admin?.data" :key="a.id">
                <p v-if="a.id == formData.past_user_id" class=" ">
                  {{ a.name }}
                </p>
              </div>
            </div>
            <p v-if="formData.is_past_info == 1">Past Crm ID</p>
            <p v-if="formData.is_past_info == 1">{{ formData.past_crm_id }}</p>
          </div>
        </div>
        <div class="text-sm">
          <div
            @click="showInclusivePart = true"
            class="flex justify-between items-center text-sm bg-white px-4 py-2"
          >
            <p class="text-main text-sm">Booking Inclusive Part</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6 text-main"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </div>
          <div class="grid grid-cols-2 gap-3 bg-white pl-4 pr-6 pt-2 pb-4">
            <p>Is Inclusive</p>
            <div>
              <p
                class="px-2 py-1 inline-block rounded text-white float-right"
                :class="formData.is_inclusive == 1 ? 'bg-green' : 'bg-main'"
              >
                {{ formData.is_inclusive == 1 ? "Yes" : "No" }}
              </p>
            </div>
            <p v-if="formData.is_inclusive == 1">Inclusive Name</p>
            <p v-if="formData.is_inclusive == 1">
              {{ formData.inclusive_name }}
            </p>
            <p v-if="formData.is_inclusive == 1">Inclusive Quantity</p>
            <p v-if="formData.is_inclusive == 1">
              {{ formData.inclusive_quantity }}
            </p>
            <p v-if="formData.is_inclusive == 1">Inclusive Rate</p>
            <p v-if="formData.is_inclusive == 1">
              {{ formData.inclusive_rate }}
            </p>
            <p v-if="formData.is_inclusive == 1">Inclusive Start Date</p>
            <p v-if="formData.is_inclusive == 1">
              {{ formData.inclusive_start_date }}
            </p>
            <p v-if="formData.is_inclusive == 1">Inclusive End Date</p>
            <p v-if="formData.is_inclusive == 1">
              {{ formData.inclusive_end_date }}
            </p>
          </div>
        </div>
        <div v-for="(i, index) in formData.items" :key="index">
          <SalesListShowVue
            :id="index"
            :productType="i.product_type"
            :productName="i.product_id"
            :productShowName="i.product_name ? i.product_name : 'null'"
            :serviceDate="i.service_date"
            :quantity="i.quantity"
            :selling="i.selling_price"
            :totalAmount="i.total_amount"
            @click="saleEditPage(i, index)"
          />
        </div>
        <div
          class="flex justify-start space-x-3 items-center px-4 py-2"
          @click="showCreateSale = true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6 text-main"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          <p class="text-main">Add Booking Sales List</p>
        </div>
        <div>
          <div
            class="flex justify-between items-center bg-transparent px-4 py-2"
          >
            <p class="">Subtotal</p>
            <p class="text-base font-semibold">THB {{ sub_total }}</p>
          </div>
          <div
            class="flex justify-between items-center border-b border-black/10 bg-white px-4 py-2"
          >
            <p class="">Discount</p>
            <!-- <p class="text-base font-semibold">0</p> -->
            <input
              type="text"
              disabled
              v-model="sub_total_discount"
              class="max-w-[80px] bg-white focus:ring-0 focus:border-0 px-2 py-1 border-main border text-xs"
            />
          </div>
          <div class="flex justify-between items-center bg-white px-4 py-2">
            <p class="">Tax</p>
            <p class="">Tax out of scope</p>
            <p></p>
          </div>
          <div
            class="flex justify-between items-start bg-transparent px-4 py-2"
          >
            <p class="">Total</p>
            <div class="text-end">
              <p class="text-base font-semibold">THB {{ grand_total }}</p>
              <small class="">( 1 THB = 1.00 THB )</small>
            </div>
          </div>
          <div
            class="flex justify-between items-center border-b border-black/10 bg-white px-4 py-2"
          >
            <p class="">Deposit</p>
            <input
              type="text"
              v-model="formData.deposit"
              class="max-w-[80px] bg-white focus:ring-0 focus:border-0 px-2 py-1 border-main border text-xs"
            />
          </div>
          <div
            class="flex justify-between items-center bg-transparent px-4 py-2"
          >
            <p class="">Balance Due</p>
            <p class="text-base font-semibold">THB {{ balance_due }}</p>
          </div>
          <div class="grid grid-cols-2 gap-4" v-if="formData.deposit > 0">
            <div class="relative">
              <p class="pl-4 mt-3 mb-2 text-sm text-gray-800 text-start">
                Reciept Image
              </p>
              <input
                type="file"
                ref="featureImageInput"
                multiple
                class="hidden"
                @change="handlerFeatureFileChange"
                accept="image/*"
              />
              <button
                @click.prevent="openFileFeaturePicker"
                class="text-sm text-[#ff613c]"
              ></button>
              <!-- <button
                v-else
                @click.prevent="removeFeatureSelectImage"
                class="rounded-full text-sm text-red-600 absolute top-[4px] right-[-33px]"
              >
                <XCircleIcon class="w-8 h-8 font-semibold" />
              </button> -->
            </div>
            <div
              @click.prevent="openFileFeaturePicker"
              class="cursor-pointer mt-2 w-full h-[100px] border-2 border-dashed border-main rounded flex justify-center items-center"
            >
              <span class="text-xs">click</span>
            </div>

            <div class="grid grid-cols-3 col-span-2 gap-3 mt-4 pb-4">
              <div
                class="relative"
                v-for="(image, index) in featureImagePreview"
                :key="index"
              >
                <button
                  @click.prevent="removeFeatureSelectImage(index)"
                  class="rounded-full text-sm text-red-600 items-center justify-center flex absolute top-[-0.9rem] right-[-0.7rem]"
                >
                  <XCircleIcon class="w-6 h-6 font-semibold text-main" />
                </button>

                <img class="h-auto w-full rounded" :src="image" alt="" />
              </div>
            </div>
          </div>
          <div class="">
            <textarea
              name=""
              id=""
              class="w-full text-sm px-4 py-2 text-gray-900 rounded shadow-sm bg-white focus:outline-none focus:border-gray-300"
              cols="30"
              rows="5"
              v-model="formData.payment_notes"
              placeholder="enter payment notes here ..."
            ></textarea>
          </div>
          <div class="mt-4 space-y-2">
            <div v-for="(image, index) in formData.receipt_images" :key="index">
              <div class="flex justify-between items-center">
                <p class="mb-2 text-sm">Receipt Image {{ index + 1 }}</p>
                <!-- <i
                  v-if="authStore.isSuperAdmin"
                  class="fa-solid fa-trash-can text-lg text-red-500"
                  @click="deleteImage(image.id)"
                ></i> -->
                <XCircleIcon
                  class="w-6 h-6 text-red"
                  @click="deleteImage(image.id)"
                />
              </div>
              <a :href="image.image" target="_blink">
                <img :src="image.image" alt="" />
              </a>
            </div>
          </div>
          <div
            v-if="allowDeposite"
            class="flex items-center justify-end mt-4 mb-4 space-x-3 flex-nowrap"
          >
            <input
              type="checkbox"
              name=""
              id=""
              v-model="checkCondition"
              class="w-6 h-6 bg-[#ff613c] border-gray-300 rounded-md"
            />
            <p class="text-xs">click want update when deposit not change</p>
          </div>
          <div>
            <div
              class="flex justify-end items-center py-4"
              v-show="allowCreate"
            >
              <div
                class="space-x-4 flex justify-center items-center gap-2 px-4 py-2 rounded border-main bg-main text-white border"
                @click="onSubmitHandler"
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
                <p class="">Update Sale</p>
              </div>
            </div>
            <div
              class="flex justify-end items-center py-4"
              v-show="!allowCreate"
            >
              <div
                class="space-x-4 flex justify-center items-center gap-2 px-4 py-2 rounded border-black/50 bg-black/50 text-white border"
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
                <p class="">Can't Update Now , Need to fill data</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="absolute top-[44px] left-0 w-screen h-full overflow-scroll bg-gray z-10 animate__animated animate__fadeIn"
        v-if="showCustomer"
      >
        <CustomerPageVue
          @change="changesCustomerShow"
          @checked="customerId"
          :customerId="formData.customer_id"
        />
      </div>
      <div
        class="absolute top-[44px] left-0 w-screen h-full overflow-scroll bg-gray z-10 animate__animated animate__fadeIn"
        v-if="showInfo"
      >
        <SalesInfoPageVue
          @change="changesSalesInfo"
          @formData="changeGetForm"
          :data="formData"
        />
      </div>
      <div
        class="absolute top-[44px] left-0 w-screen min-h-full overflow-scroll bg-gray z-10 animate__animated animate__fadeIn"
        v-if="showCreateSale"
      >
        <CreateSalesItem
          @change="changesCreateSale"
          @formData="changeGetItem"
          :is_inclusive="formData.is_inclusive"
        />
      </div>
      <div
        class="absolute top-[44px] left-0 w-screen min-h-full overflow-scroll bg-gray z-10 animate__animated animate__fadeIn"
        v-if="showEditSale"
      >
        <EditSaleItemVue
          :data="editValue"
          @change="changesEditSale"
          @remove="removeItemList"
          @formData="changeItemList"
          :is_inclusive="formData.is_inclusive"
        />
      </div>
      <div
        class="absolute top-[44px] left-0 w-screen min-h-full overflow-scroll bg-gray z-10 animate__animated animate__fadeIn"
        v-if="showInclusivePart"
      >
        <SalesInclusivePageVue
          @change="changesSalesInclusive"
          @formData="changeGetInclusiveForm"
          :data="formData"
        />
      </div>
    </div>
  </div>
</template>
