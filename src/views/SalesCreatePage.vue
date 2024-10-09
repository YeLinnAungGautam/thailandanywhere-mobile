<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import NavbarVue from "../components/Navbar.vue";
import { Switch } from "@headlessui/vue";
import SalesItemListVue from "../components/SalesItemList.vue";
import CustomerPageVue from "../components/bookingCreate/CustomerPage.vue";
import { useCustomerStore } from "../stores/customer";
import { useAdminStore } from "../stores/admin";
import { storeToRefs } from "pinia";
import SalesInfoPageVue from "../components/bookingCreate/SalesInfoPage.vue";
import SalesInclusivePageVue from "../components/bookingCreate/SalesInclusivePage.vue";
import CreateSalesItem from "../components/bookingCreate/CreateSalesItem.vue";
import SalesListShowVue from "../components/bookingCreate/SalesListShow.vue";
import { XCircleIcon } from "@heroicons/vue/24/outline";
import { useToastStore } from "../stores/toast";
import { useBookingStore } from "../stores/booking";
import EditSaleItemVue from "../components/bookingCreate/EditSaleItem.vue";

const router = useRouter();
const enabled = ref(false);
const customerStore = useCustomerStore();
const bookingStore = useBookingStore();
const adminStore = useAdminStore();
const toastStore = useToastStore();

const { customers } = storeToRefs(customerStore);
const { admin } = storeToRefs(adminStore);

const formData = ref({
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
  confirmation_letter: [],
  due_date: "",
  deposit: 0,
  balance_due_date: "",
  past_user_id: "",
  is_past_info: "",
  past_crm_id: "",
  is_inclusive: "",
  inclusive_name: "",
  inclusive_quantity: "",
  inclusive_rate: "",
  inclusive_start_date: "",
  inclusive_end_date: "",
});

const enabledIn = ref(false);
const showInclusivePart = ref(false);

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
  if (formData.value.is_inclusive != 1) {
    let totalsub = 0;
    for (let i = 0; i < formData.value.items.length; i++) {
      // if (!formData.value.items[i].is_inclusive) {
      //   totalsub = totalsub + formData.value.items[i].total_amount;
      // }
      totalsub = totalsub + formData.value.items[i].total_amount;
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
        if (formData.value.items[i].product_type != "7") {
          totalsub = totalsub + formData.value.items[i].total_amount;
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
const changesSalesInclusive = (message) => {
  if (message == "changes") {
    showInclusivePart.value = false;
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
const formitem = ref({});
const changeGetItem = (data) => {
  console.log(data);
  if (formData.value.is_inclusive == 1) {
    formitem.value.is_inclusive = 1;
  } else {
    formitem.value.is_inclusive = "";
  }
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
  if (formData.value.is_inclusive == 1) {
    formData.value.items[editListId.value].is_inclusive = 1;
  } else {
    formData.value.items[editListId.value].is_inclusive = "";
  }
  formData.value.items[editListId.value] = data;
  editListId.value = "";
};

const addNewitem = () => {
  formData.value.items.push(formitem.value);
};

const customerId = (data) => {
  console.log(data);
  formData.value.customer_id = data;
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

const allowCreate = computed(() => {
  if (
    formData.value.items.length != 0 &&
    formData.value.deposit != 0 &&
    formData.value.receipt_image.length != 0
  ) {
    return true;
  } else if (formData.value.items.length != 0 && formData.value.deposit == 0) {
    return true;
  } else {
    return false;
  }
});

const errors = ref(null);
const onSubmitHandler = async () => {
  if (sub_total_real.value != NaN || sub_total_real.value != null) {
    const frmData = new FormData();
    frmData.append("customer_id", formData.value.customer_id);
    frmData.append("payment_notes", formData.value.payment_notes);
    frmData.append("sold_from", formData.value.sold_from);
    frmData.append("payment_method", formData.value.payment_method);
    frmData.append("bank_name", formData.value.bank_name);

    frmData.append("is_past_info", formData.value.is_past_info);
    formData.value.past_crm_id
      ? frmData.append("past_crm_id", formData.value.past_crm_id)
      : "";
    formData.value.past_user_id
      ? frmData.append("past_user_id", formData.value.past_user_id)
      : "";

    frmData.append("payment_status", formData.value.payment_status);
    frmData.append("booking_date", formData.value.booking_date);
    if (formData.value.money_exchange_rate) {
      frmData.append("money_exchange_rate", formData.value.money_exchange_rate);
    } else {
      frmData.append("money_exchange_rate", 0);
    }

    // if (formData.value.discount == "" || formData.value.discount == 0) {
    //   frmData.append("discount", 0);
    // } else {
    //   frmData.append("discount", percentageValue.value);
    // }
    frmData.append("discount", sub_total_discount.value);

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

    frmData.append("sub_total", sub_total_real.value);
    frmData.append("exclude_amount", sub_total_airline.value);
    frmData.append("grand_total", grand_total_real.value);
    frmData.append("deposit", formData.value.deposit);
    frmData.append("payment_currency", formData.value.payment_currency);
    frmData.append("balance_due", balance_due_real.value);
    frmData.append("balance_due_date", formData.value.balance_due_date);

    if (formData.value.confirmation_letter.length > 0) {
      for (let i = 0; i < formData.value.confirmation_letter.length; i++) {
        let file = formData.value.confirmation_letter[i];
        frmData.append("items[" + i + "][confirmation_letter]", file);
      }
    }
    for (var x = 0; x < formData.value.items.length; x++) {
      if (formData.value.items[x].product_type == "1") {
        frmData.append(
          "items[" + x + "][product_type]",
          `App\\Models\\PrivateVanTour`
        );
      } else if (formData.value.items[x].product_type == "2") {
        frmData.append(
          "items[" + x + "][product_type]",
          `App\\Models\\GroupTour`
        );
      } else if (formData.value.items[x].product_type == "3") {
        frmData.append(
          "items[" + x + "][product_type]",
          `App\\Models\\AirportPickup`
        );
      } else if (formData.value.items[x].product_type == "4") {
        frmData.append(
          "items[" + x + "][product_type]",
          `App\\Models\\EntranceTicket`
        );
      } else if (formData.value.items[x].product_type == "5") {
        frmData.append(
          "items[" + x + "][product_type]",
          `App\\Models\\Inclusive`
        );
      } else if (formData.value.items[x].product_type == "6") {
        frmData.append("items[" + x + "][product_type]", `App\\Models\\Hotel`);
      } else if (formData.value.items[x].product_type == "7") {
        frmData.append(
          "items[" + x + "][product_type]",
          `App\\Models\\Airline`
        );
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
      frmData.append(
        "items[" + x + "][product_id]",
        formData.value.items[x].product_id
      );
      if (formData.value.items[x].is_inclusive) {
        frmData.append(
          "items[" + x + "][is_inclusive]",
          formData.value.items[x].is_inclusive
        );
      }

      if (formData.value.items[x].product_type != "6") {
        frmData.append(
          "items[" + x + "][amount]",
          formData.value.items[x].selling_price *
            formData.value.items[x].quantity -
            formData.value.items[x].discount
        );
      } else if (formData.value.items[x].product_type == "6") {
        frmData.append(
          "items[" + x + "][amount]",
          formData.value.items[x].selling_price *
            formData.value.items[x].quantity *
            formData.value.items[x].days -
            formData.value.items[x].discount
        );
      }

      formData.value.items[x].pickup_location
        ? frmData.append(
            "items[" + x + "][pickup_location]",
            formData.value.items[x].pickup_location
          )
        : "";

      if (formData.value.items[x].pickup_time) {
        frmData.append(
          "items[" + x + "][pickup_time]",
          formData.value.items[x].pickup_time
        );
      }
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
      // add new cost price & total_cost_price
      if (formData.value.items[x].cost_price) {
        frmData.append(
          "items[" + x + "][cost_price]",
          formData.value.items[x].cost_price
        );
      }

      if (formData.value.items[x].discount) {
        frmData.append(
          "items[" + x + "][discount]",
          formData.value.items[x].discount
        );
      } else {
        frmData.append("items[" + x + "][discount]", 0);
      }

      if (
        formData.value.items[x].cost_price &&
        formData.value.items[x].quantity
      ) {
        if (formData.value.items[x].product_type != "6") {
          frmData.append(
            "items[" + x + "][total_cost_price]",
            formData.value.items[x].cost_price *
              formData.value.items[x].quantity
          );
        } else {
          "items[" + x + "][total_cost_price]",
            formData.value.items[x].cost_price *
              formData.value.items[x].quantity *
              formData.value.items[x].days;
        }
      }
      if (formData.value.items[x].dropoff_location) {
        frmData.append(
          "items[" + x + "][dropoff_location]",
          formData.value.items[x].dropoff_location
        );
      }
      if (formData.value.items[x].checkin_date) {
        frmData.append(
          "items[" + x + "][checkin_date]",
          formData.value.items[x].checkin_date
        );
      }
      if (formData.value.items[x].room_number) {
        frmData.append(
          "items[" + x + "][room_number]",
          formData.value.items[x].room_number
        );
      }
      if (formData.value.items[x].checkout_date) {
        frmData.append(
          "items[" + x + "][checkout_date]",
          formData.value.items[x].checkout_date
        );
      }
      if (formData.value.items[x].route_plan) {
        frmData.append(
          "items[" + x + "][route_plan]",
          formData.value.items[x].route_plan
        );
      }

      if (
        formData.value.items[x].product_type === "6" &&
        formData.value.items[x].room_id
      ) {
        frmData.append(
          "items[" + x + "][room_id]",
          formData.value.items[x].room_id
        );
      }
      if (
        formData.value.items[x].product_type != "4" &&
        formData.value.items[x].product_type != "7"
      ) {
        if (formData.value.items[x].car_id) {
          frmData.append(
            "items[" + x + "][car_id]",
            formData.value.items[x].car_id
          );
        }
      } else if (formData.value.items[x].product_type == "4") {
        frmData.append(
          "items[" + x + "][variation_id]",
          formData.value.items[x].car_id
        );
      } else if (formData.value.items[x].product_type == "7") {
        frmData.append(
          "items[" + x + "][ticket_id]",
          formData.value.items[x].car_id
        );
      }
      frmData.append(
        "items[" + x + "][service_date]",
        formData.value.items[x].service_date
      );
      frmData.append(
        "items[" + x + "][quantity]",
        formData.value.items[x].quantity
      );
      formData.value.days
        ? frmData.append("items[" + x + "][days]", formData.value.items[x].days)
        : "";
      if (formData.value.items[x].duration) {
        frmData.append(
          "items[" + x + "][duration]",
          formData.value.items[x].duration
        );
      }
      if (formData.value.items[x].special_request) {
        frmData.append(
          "items[" + x + "][special_request]",
          formData.value.items[x].special_request
        );
      }
      frmData.append(
        "items[" + x + "][selling_price]",
        formData.value.items[x].selling_price
      );
      if (formData.value.items[x].comment) {
        frmData.append(
          "items[" + x + "][comment]",
          formData.value.items[x].comment
        );
      }
      // console.log(formData.value.items[x].comment, "this is comment");
      frmData.append(
        "items[" + x + "][reservation_status]",
        formData.value.items[x].reservation_status
      );
      frmData.append(
        "items[" + x + "][payment_method]",
        formData.value.items[x].payment_method
      );
      formData.value.items[x].payment_status
        ? frmData.append(
            "items[" + x + "][payment_status]",
            formData.value.items[x].payment_status
          )
        : "";
      // frmData.append(
      //   "items[" + x + "][exchange_rate]",
      //   formData.value.items[x].exchange_rate
      // );
      formData.value.items[x].exchange_rate
        ? frmData.append(
            "items[" + x + "][exchange_rate]",
            formData.value.items[x].exchange_rate
          )
        : "";
    }

    try {
      const response = await bookingStore.addNewAction(frmData);
      console.log(response, "create response");
      formData.value = {
        customer_id: "",
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
        is_past_info: "",
        past_crm_id: "",
      };

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

onMounted(async () => {
  // await customerStore.getSimpleListAction();
  // await adminStore.getSimpleListAction();
  // console.log(customers.value);
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

        <p class="text-main text-xl font-semibold w-full text-center">
          Sales Create
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
          <div class="text-main" v-if="formData.customer_id != ''">
            <div v-for="customer in customers?.data" :key="customer.id">
              <p v-if="customer.id == formData.customer_id" class=" ">
                {{ customer.name }}
              </p>
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
                <p class="">Create Sale</p>
              </div>
            </div>
          </div>
          <div>
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
                <p class="">Need to add Data</p>
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
          :is_inclusive="formData.is_inclusive"
          @change="changesEditSale"
          @remove="removeItemList"
          @formData="changeItemList"
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
