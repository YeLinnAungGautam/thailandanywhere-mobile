<script setup>
import {
  ref,
  defineProps,
  defineEmits,
  computed,
  onMounted,
  watchEffect,
  watch,
} from "vue";
import { XCircleIcon, TrashIcon } from "@heroicons/vue/24/outline";
import { useToastStore } from "../../stores/toast";
import { Switch } from "@headlessui/vue";
import { useReservationStore } from "../../stores/reservation";
import { useRoute, useRouter } from "vue-router";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import Swal from "sweetalert2";

const reservationStore = useReservationStore();
const toastStore = useToastStore();
const router = useRouter();
const route = useRoute();

const props = defineProps({
  main: [Object],
});

const enabled = ref(false);
const reservation_status = [
  { id: "1", name: "confirmed" },
  { id: "2", name: "awaiting" },
  { id: "3", name: "declined" },
];
const paymentArray = [
  { id: "1", name: "Bank Transfer" },
  { id: "2", name: "International Remittance" },
  { id: "3", name: "Cash" },
  { id: "4", name: "Other ..." },
];
const payment = [
  { id: "1", name: "K + " },
  { id: "2", name: "SCB " },
  { id: "3", name: "Bangkok Bank" },
  { id: "4", name: "Other Bank " },
];
const payment_status = [
  { id: "1", name: "fully_paid" },
  { id: "2", name: "not_paid" },
  { id: "3", name: "partially_paid" },
];

const formData = ref({
  route_plan: "",
  special_request: "",
  pickup_location: "",
  dropoff_location: "",
  account_holder_name: "",
  supplier_name: "",
  driver_name: "",
  driver_contact: "",
  ref_number: "",
  car_number: "",
  car_photo: "",
  receipt_image: [],
  paid_slip: [],
  reservation_status: "",
  slip_code: "",
  payment_method: "",
  bank_name: "",
  payment_status: "",
  bank_account_number: "",
  cost_price: "",
  hotalQuantity: "",
  customer_feedback: "",
  customer_name: "",
  customer_phone: "",
  customer_passport_number: "",
});

const paid_slip_image = ref([]);
const fileInput = ref(null);
const fileInputTwo = ref(null);
const fileInputThree = ref(null);
const previewImage = ref(null);
const booking_receipt = ref("");
const featureImageInput = ref(null);
const featureCusPassPreview = ref([]);
const customer_passport = ref([]);
const customer_passport_data = ref([]);

const openFileFeaturePicker = () => {
  featureImageInput.value.click();
};

const handlerCustomerPassport = (e) => {
  let selectedFile = e.target.files;

  for (let index = 0; index < selectedFile.length; index++) {
    customer_passport.value.push(selectedFile[index]);
    featureCusPassPreview.value.push(URL.createObjectURL(selectedFile[index]));
    console.log(customer_passport.value, "this is customer passport array");
  }
};

const removeCustomerPassportImage = (index) => {
  customer_passport.value.splice(index, 1);
  featureCusPassPreview.value.splice(index, 1);
  console.log(customer_passport.value, "this is remove");
};

const deleteCustomerPassport = async (id) => {
  const res = await reservationStore.deleteCustomerPassportAction(id);
  // toast.success("success delete customer passport");
  toastStore.showToast({
    icon: "success",
    title: "success delete customer passport",
  });

  router.push(`/reservation/update/${route.params.id}`);
  window.location.reload();
};

const openFilePicker = () => {
  fileInput.value.click();
};
const openFilePickerTwo = () => {
  fileInputTwo.value.click();
};
const openFilePickerThree = () => {
  fileInputThree.value.click();
};

const removeSelectedImage = () => {
  formData.value.car_photo = null;
  previewImage.value = null;
};

const expPreviewImage = ref([]);

const exphandleFileChange = (e) => {
  console.log(e.target.files);
  let selectedFile = e.target.files;
  if (selectedFile) {
    for (let index = 0; index < selectedFile.length; index++) {
      let inputValue = {
        file: selectedFile[index],
        amount: 0,
      };
      formData.value.paid_slip.push(inputValue);
      let expData = {
        file: URL.createObjectURL(selectedFile[index]),
        amount: 0,
      };
      expPreviewImage.value.push(expData);
    }
  }
  console.log(formData.value.paid_slip, "this is paid slip");
};

const expremoveSelectedImage = (index) => {
  formData.value.paid_slip.splice(index, 1);
  expPreviewImage.value.splice(index, 1);
  console.log(formData.value.paid_slip, "this is remove");
};
const expremoveSecSelectedImage = (index) => {
  formData.value.receipt_image.splice(index, 1);
  uploadRecePreview.value.splice(index, 1);
  console.log(formData.value.receipt_image, "this is remove");
};

const uploadRecePreview = ref([]);
const booking_confirm_letters = ref("");

const recehandleFileChange = (e) => {
  let selectedFile = e.target.files;
  if (selectedFile) {
    for (let index = 0; index < selectedFile.length; index++) {
      formData.value.receipt_image.push(selectedFile[index]);
      uploadRecePreview.value.push(URL.createObjectURL(selectedFile[index]));
    }
  }
  console.log(formData.value.receipt_image, "receipt");
};

const errors = ref(null);

const handlerConfirmFileChange = (e) => {
  let selectedFileCon = e.target.files[0];

  formData.value.confirmation_letter = selectedFileCon;
};

const handleFileChange = (e) => {
  let selectedFile = e.target.files[0];
  if (selectedFile) {
    formData.value.car_photo = e.target.files[0];
    previewImage.value = URL.createObjectURL(selectedFile);
  }
};

const route_plan_part = ref(false);
const routePlanHandle = () => {
  route_plan_part.value = !route_plan_part.value;
};
const other_info_part = ref(false);
const otherInfoHandle = () => {
  other_info_part.value = !other_info_part.value;
};
const car_info_sec = ref(false);
const carInfoSecHandle = () => {
  car_info_sec.value = !car_info_sec.value;
};
const reservation_info_part = ref(false);
const reservationInfoHandle = () => {
  reservation_info_part.value = !reservation_info_part.value;
};
const expen_info_part = ref(false);
const expenInfoHandle = () => {
  expen_info_part.value = !expen_info_part.value;
};
const customer_part = ref(false);
const customerPartHandle = () => {
  customer_part.value = !customer_part.value;
};

const getData = async () => {
  if (props.main?.route_plan) {
    formData.value.route_plan = props.main?.route_plan;
  } else if (props.main?.product_type === "App\\Models\\PrivateVanTour") {
    formData.value.route_plan = props.main?.product.description;
  }
  if (props.main?.reservation_info) {
    if (props.main?.reservation_info.special_request != null) {
      formData.value.special_request =
        props.main?.reservation_info.special_request;
    }
  } else if (props.main?.special_request && !props.main?.reservation_info) {
    formData.value.special_request = props.main?.special_request;
  }
  formData.value.pickup_location = props.main?.pickup_location;
  formData.value.dropoff_location = props.main?.dropoff_location;
  if (props.main?.reservation_car_info != null) {
    formData.value.supplier_name =
      props.main?.reservation_car_info.supplier_name;
    formData.value.account_holder_name =
      props.main?.reservation_car_info.account_holder_name;
    formData.value.driver_name = props.main?.reservation_car_info.driver_name;
    formData.value.driver_contact =
      props.main?.reservation_car_info.driver_contact;

    formData.value.car_number = props.main?.reservation_car_info.car_number;
    previewImage.value = props.main?.reservation_car_info.car_photo;
  } else {
    formData.value.supplier_name = "";
    (formData.value.account_holder_name = ""),
      (formData.value.driver_name = "");
    formData.value.driver_contact = "";
    formData.value.car_number = "";
    previewImage.value = "";
  }
  formData.value.ref_number = props.main?.reservation_supplier_info?.ref_number;
  if (props.main?.reservation_status == "null") {
    formData.value.reservation_status = "";
  } else {
    formData.value.reservation_status = props.main?.reservation_status;
  }
  if (props.main?.slip_code) {
    formData.value.slip_code = props.main?.slip_code;
  } else {
    formData.value.slip_code = "-";
  }
  if (props.main?.paid_slip.length != 0) {
    paid_slip_image.value = props.main?.paid_slip;
    console.log(paid_slip_image.value, "this is paid");
    formData.value.paid_slip = [];
    console.log(formData.value.paid_slip);
  }
  if (props.main?.receipt_images) {
    booking_receipt.value = props.main?.receipt_images;
    console.log(
      booking_receipt.value,
      props.main?.receipt_images,
      "this is receipt image"
    );
  }
  if (props.main?.booking_confirm_letters) {
    booking_confirm_letters.value = props.main?.booking_confirm_letters;
  }
  if (props.main?.payment_method == null) {
    formData.value.payment_method = props.main?.product.payment_method;
  } else {
    formData.value.payment_method = props.main?.payment_method;
  }
  if (props.main?.bank_name == null) {
    formData.value.bank_name = props.main?.product.bank_name;
  } else {
    formData.value.bank_name = props.main?.bank_name;
  }
  if (props.main?.payment_status == "null") {
    formData.value.payment_status = "";
  } else {
    formData.value.payment_status = props.main?.payment_status;
  }
  if (props.main?.reservation_info?.bank_account_number == null) {
    formData.value.bank_account_number =
      props.main?.reservation_info?.bank_account_number;
  } else {
    formData.value.bank_account_number =
      props.main?.reservation_info?.bank_account_number;
  }
  // if (props.main?.cost_price == null || props.main?.cost_price == 0) {
  //   if (props.main?.room) {
  //     formData.value.cost_price = props.main?.room?.cost;
  //   }
  //   if (props.main?.variation) {
  //     formData.value.cost_price = props.main?.variation?.cost_price;
  //   }
  //   if (
  //     props.main?.car ||
  //     props.main?.product_type == "App\\Models\\GroupTour" ||
  //     props.main?.product_type == "App\\Models\\Airline"
  //   ) {
  //     formData.value.cost_price = "";
  //   }
  //   console.log(formData.value.cost_price, "this is cost");
  // } else {
  //   formData.value.cost_price = props.main?.cost_price;
  //   console.log(formData.value.cost_price, "this is final cost");
  // }
  if (
    props.main?.cost_price == null ||
    props.main?.cost_price == 0 ||
    props.main?.cost_price == "null"
  ) {
    formData.value.cost_price = 0;
  } else {
    formData.value.cost_price = props.main.cost_price;
  }
  formData.value.customer_feedback =
    props.main?.reservation_info?.customer_feedback;
  if (props.main?.is_associated == 1) {
    enabled.value = true;
    if (props.main?.associated_customer != null) {
      formData.value.customer_name = props.main?.associated_customer[0].name;
      formData.value.customer_phone = props.main?.associated_customer[0].phone;
      formData.value.customer_passport_number =
        props.main?.associated_customer[0].passport;
    }
  }
  if (props.main?.customer_passports.length > 0) {
    customer_passport_data.value = props.main?.customer_passports;
    console.log(
      customer_passport_data.value,
      "this is customer passport image"
    );
  }
};

const changeName = () => {
  if (props.main?.product_type == "App\\Models\\EntranceTicket") {
    formData.value.supplier_name = props.main?.product.name;
  }
};

const deleteImagePaid = async (id) => {
  console.log(id, "this is delete id");
  await reservationStore.deletePaidImage(id);
  // toast.success("success delete receipt paid slip");
  toastStore.showToast({
    icon: "success",
    title: "success delete receipt paid slip",
  });
  router.push(`/reservation/update/${route.params.id}`);
  window.location.reload();
};
const deleteImage = async (id) => {
  console.log(id, "this is delete id");
  await reservationStore.deleteResImage(id);
  toastStore.showToast({
    icon: "success",
    title: "success delete Image",
  });
  router.push(`/reservation/update/${route.params.id}`);
  window.location.reload();
};

const days = computed(() => {
  if (props.main?.checkin_date && props.main?.checkout_date) {
    const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    const startDateTimestamp = new Date(props.main.checkin_date).getTime();
    const endDateTimestamp = new Date(props.main.checkout_date).getTime();
    let result = Math.abs(
      Math.round((endDateTimestamp - startDateTimestamp) / oneDay)
    );
    console.log(result);
    return result;
  }
});

const onSubmitHandler = async () => {
  const frmData = new FormData();
  frmData.append("_method", "PUT");
  if (props.main?.duration) {
    frmData.append("duration", props.main?.duration);
  }
  formData.value.payment_method &&
    frmData.append("payment_method", formData.value.payment_method);
  formData.value.payment_status &&
    frmData.append("payment_status", formData.value.payment_status);

  frmData.append("product_type", props.main?.product_type);
  formData.value.cost_price &&
    frmData.append("cost_price", formData.value.cost_price);
  formData.value.reservation_status &&
    frmData.append("reservation_status", formData.value.reservation_status);
  props.main?.service_date &&
    frmData.append("service_date", props.main?.service_date);
  formData.value.slip_code &&
    frmData.append("slip_code", formData.value.slip_code);

  if (customer_passport.value.length != 0) {
    if (customer_passport.value.length > 0) {
      for (let i = 0; i < customer_passport.value.length; i++) {
        let file = customer_passport.value[i];
        frmData.append("customer_passport[" + i + "]", file);
      }
    }
  }

  try {
    const response = await reservationStore.updateAction(
      frmData,
      route.params.id
    );
    if (response.status) {
      const secfrm = new FormData();
      secfrm.append("_method", "PUT");
      if (formData.value.customer_feedback) {
        secfrm.append("customer_feedback", formData.value.customer_feedback);
      }

      if (formData.value.bank_name) {
        secfrm.append("bank_name", formData.value.bank_name);
      }
      if (formData.value.bank_account_number) {
        secfrm.append(
          "bank_account_number",
          formData.value.bank_account_number
        );
      }
      if (formData.value.customer_name) {
        secfrm.append("customer_name", formData.value.customer_name);
      }
      if (formData.value.customer_phone) {
        secfrm.append("customer_phone", formData.value.customer_phone);
      }
      if (formData.value.customer_passport_number) {
        secfrm.append(
          "customer_passport_number",
          formData.value.customer_passport_number
        );
      }
      if (enabled.value == true) {
        secfrm.append("is_associated", 1);
      } else {
        secfrm.append("is_associated", 0);
      }

      // secfrm.append("expense_amount", expense_amount.value);
      if (formData.value.receipt_image.length != 0) {
        if (formData.value.receipt_image.length > 0) {
          for (let i = 0; i < formData.value.receipt_image.length; i++) {
            let file = formData.value.receipt_image[i];
            secfrm.append("receipt_image[" + i + "]", file);
          }
        }
      }
      if (formData.value.paid_slip.length != 0) {
        if (formData.value.paid_slip.length > 0) {
          for (let i = 0; i < formData.value.paid_slip.length; i++) {
            // let file = formData.value.paid_slip[i];
            // secfrm.append("paid_slip[" + i + "]", file);
            let file = formData.value.paid_slip[i].file;
            let amount = formData.value.paid_slip[i].amount;
            secfrm.append("paid_slip[" + i + "][file]", file);
            secfrm.append("paid_slip[" + i + "][amount]", amount);
          }
        }
      }
      if (formData.value.cost) {
        secfrm.append("cost", props.main?.cost);
      }
      if (formData.value.ref_number) {
        secfrm.append("ref_number", formData.value.ref_number);
      }
      secfrm.append("special_request", formData.value.special_request);
      if (formData.value.pickup_location) {
        secfrm.append("pickup_location", formData.value.pickup_location);
      }
      if (formData.value.dropoff_location) {
        secfrm.append("dropoff_location", formData.value.dropoff_location);
      }
      if (formData.value.route_plan) {
        secfrm.append("route_plan", formData.value.route_plan);
      }
      if (formData.value.supplier_name) {
        secfrm.append("supplier_name", formData.value.supplier_name);
      }
      if (formData.value.account_holder_name) {
        secfrm.append(
          "account_holder_name",
          formData.value.account_holder_name
        );
      }
      if (formData.value.driver_name) {
        secfrm.append("driver_name", formData.value.driver_name);
      }
      if (formData.value.driver_contact) {
        secfrm.append("driver_contact", formData.value.driver_contact);
      }
      if (formData.value.car_number) {
        secfrm.append("car_number", formData.value.car_number);
      }
      if (formData.value.car_photo) {
        if (
          props.main?.product_type == "App\\Models\\EntranceTicket" ||
          props.main?.product_type == "App\\Models\\Hotel"
        ) {
          secfrm.append("booking_confirm_letter", formData.value.car_photo);
        } else {
          secfrm.append("car_photo", formData.value.car_photo);
        }
      }
      await reservationStore.updateInfoAction(secfrm, route.params.id);
    }
    formData.value = {
      route_plan: "",
      special_request: "",
      pickup_location: "",
      dropoff_location: "",
      account_holder_name: "",
      supplier_name: "",
      driver_name: "",
      driver_contact: "",
      ref_number: "",
      car_number: "",
      car_photo: "",
      receipt_image: [],
      paid_slip: [],
      reservation_status: "",
      slip_code: "",
      payment_method: "",
      bank_name: "",
      payment_status: "",
      bank_account_number: "",
      cost_price: "",
      customer_feedback: "",
      customer_name: "",
      customer_phone: "",
      customer_passport_number: "",
    };

    errors.value = null;
    expPreviewImage.value = [];
    uploadRecePreview.value = [];
    // toast.success(response.message);
    toastStore.showToast({
      icon: "success",
      title: response.message,
    });
    router.push(`/reservation/update/${route.params.id}`);
    window.location.reload();
  } catch (error) {
    console.log(error);
    toastStore.showToast({
      icon: "error",
      title: "have error",
    });
    // toast.error(error.response.data.message);
  }
};

const email_info_part = ref(false);
const emailInfoHandle = () => {
  email_info_part.value = !email_info_part.value;
};

const cancelEmailFunction = () => {
  emailData.value = {
    mail_subject: "",
    mail_to: "",
    send_to_default: false,
    attachments: [],
  };
};

const emailLoading = ref(false);
const sendEmailFunction = async () => {
  Swal.fire({
    title: "Are you sure ?",
    text: `Send email to ${emailData.value.mail_to} `,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#FF6300",
    cancelButtonColor: "#C69B92",
    confirmButtonText: "Send",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        emailLoading.value = true;
        console.log(emailData.value);
        const frmData = new FormData();
        frmData.append("mail_to", emailData.value.mail_to);
        frmData.append("mail_subject", emailData.value.mail_subject);
        frmData.append("mail_body", emailData.value.mail_body);
        frmData.append("send_to_default", emailData.value.send_to_default);
        // frmData.append("attachments", emailData.value.attachments);
        if (emailData.value.attachments.length > 0) {
          for (let i = 0; i < emailData.value.attachments.length; i++) {
            let file = emailData.value.attachments[i];
            frmData.append("attachments[" + i + "]", file);
          }
        }
        const res = await reservationStore.emailSendReservation(
          route.params.id,
          frmData
        );
        if (res.data.status) {
          emailLoading.value = false;
          emailData.value = {
            mail_subject: "",
            mail_to: "",
            send_to_default: false,
            attachments: [],
          };
          toastStore.showToast({
            icon: "success",
            title: res.data.message,
          });
        }
      } catch (error) {
        emailLoading.value = false;
        toastStore.showToast({
          icon: "error",
          title: error.response.data.message,
        });
      }
    }
  });
};

const emailData = ref({
  mail_subject: "",
  mail_to: "",
  send_to_default: false,
  mail_body: "",
  attachments: [],
});

const addAttracted = (e) => {
  for (let i = 0; i < e.target.files.length; i++) {
    emailData.value.attachments.push(e.target.files[i]);
    console.log(e.target.files[i], "this is att");
  }
};

const editorOptions = {
  placeholder: "Write an awesome mail here ...",
};

const mailBodyChange = () => {
  if (props.main?.product_type == "App\\Models\\EntranceTicket") {
    emailData.value.mail_body = `<p>Dear Reservation Manager<b> of ${props.main?.product?.name}</b>,</p><p>Greetings from Thailand Anywhere travel and tour.</p><p>We are pleased to book the tickets for our customers as per following description ka.</p>
    <p>Date :<b>${props.main?.service_date}</b></p><p>Ticket :<b>${props.main?.variation?.name}</b></p><p>Total :<b>${props.main?.quantity}</b></p><p>Name :<b>${props.main?.customer_info?.name}</b></p>
    <p>Passport and payment slips are attached with this email .</p><b><em>Please kindly arrange and invoice & voucher for our clients accordingly .</em></b><p>Should there be anything more required you can call us at +66983498197 and LINE ID 58858380 .</p>`;
  } else if (props.main?.product_type == "App\\Models\\Hotel") {
    emailData.value.mail_body = `<p>Dear Reservation Manager<b> of ${
      props.main?.product?.name
    }</b>,</p><p>Greetings from Thailand Anywhere travel and tour. Good day to you ka.</p><p>We are pleased to book the room for our customers as per following description checks availability by phone.</p>
    <p>Check In :<strong>${
      props.main?.checkin_date
    }</strong></p><p>Check Out :<strong>${
      props.main?.checkout_date
    }</strong></p><p>Total :<strong>${
      props.main?.quantity
    } rooms & ${daysBetween(
      props.main?.checkin_date,
      props.main?.checkout_date
    )} nights</strong></p><p>Name :<strong>${
      props.main?.customer_info?.name
    } & ${
      props.main?.customer_passports?.length
    } passports</strong></p><p>Room Type :<strong>${
      props.main?.room?.name
    }</strong></p><p>Special Request :<strong>${
      props.main?.special_request
    }</strong></p>
    <p>Passport and payment slips are attached with this email .</p><b><em>Please arrange the invoice and confirmation letter ka.</em></b><p>Should there be anything more required you can call us at +66983498197 and LINE ID 58858380 .</p>`;
  }
};

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

onMounted(() => {
  watch(
    () => props.main,
    (newMain, oldMain) => {
      // This callback will be executed whenever props.main changes
      if (newMain) {
        // Assuming getData and changeName are asynchronous functions
        getData().then(() => {
          changeName();
          console.log(props.main, "this is main");

          mailBodyChange();
          console.log(emailData.value.mail_body, "this is mail body");
        });
      }
    }
  );
});
</script>
<template>
  <div>
    <!-- asso customer -->
    <div
      class="flex justify-start items-center px-4 py-2 shadow bg-white space-x-4 text-xs border-b border-main cursor-pointer"
      v-if="
        main?.product_type != 'App\\Models\\EntranceTicket' ||
        main?.product_type != 'App\\Models\\Hotel' ||
        main?.product_type != 'App\\Models\\Airline'
      "
      @click="customerPartHandle"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        data-slot="icon"
        class="w-6 h-6"
        v-if="!customer_part"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m19.5 8.25-7.5 7.5-7.5-7.5"
        />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        data-slot="icon"
        class="w-6 h-6"
        v-if="customer_part"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m4.5 15.75 7.5-7.5 7.5 7.5"
        />
      </svg>
      <p>IS ASSOCIATE CUSTOMER ?</p>
    </div>
    <div
      class="bg-black/5 p-2"
      v-if="
        customer_part &&
        (main?.product_type != 'App\\Models\\EntranceTicket' ||
          main?.product_type != 'App\\Models\\Hotel' ||
          main?.product_type != 'App\\Models\\Airline')
      "
    >
      <div class="col-span-2 grid grid-cols-2 gap-4">
        <div class="space-y-1 px-4">
          <p class="text-xs text-main">Is Associated ?</p>
          <p class="text-gray-400 text-xs">
            <Switch
              v-model="enabled"
              :class="enabled ? ' bg-main' : 'bg-black'"
              class="relative inline-flex h-[28px] w-[64px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
            >
              <span class="sr-only">Use setting</span>
              <span
                aria-hidden="true"
                :class="enabled ? 'translate-x-9' : 'translate-x-0'"
                class="pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
              />
            </Switch>
          </p>
        </div>
        <div class="space-y-1 pr-4" v-if="enabled">
          <p class="text-xs text-main">Ass Cus Name</p>
          <input
            type="text"
            name=""
            v-model="formData.customer_name"
            class="h-8 w-full font-semibold bg-white border border-main shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-main text-xs"
            id=""
          />
        </div>
        <div class="space-y-1 px-4" v-if="enabled">
          <p class="text-xs text-main">Ass Cus Phone</p>
          <input
            type="number"
            v-model="formData.customer_phone"
            name=""
            class="h-8 w-full font-semibold bg-white border border-main shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-main text-xs"
            id=""
          />
        </div>
        <div class="space-y-1 pr-4" v-if="enabled">
          <p class="text-xs text-main">Ass Cus Passport</p>
          <input
            type="text"
            v-model="formData.customer_passport_number"
            name=""
            class="h-8 w-full font-semibold bg-white border border-main shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-main text-xs"
            id=""
          />
        </div>

        <div class="space-y-1 col-span-2 px-4">
          <input
            type="file"
            ref="featureImageInput"
            multiple
            class="hidden"
            @change="handlerCustomerPassport"
            accept="image/*"
          />
          <p
            class="text-white text-xs inline-block cursor-pointer bg-[#ff613c] rounded-sm px-2 py-1.5"
            @click.prevent="openFileFeaturePicker"
          >
            Add New Customer Passport multiple
          </p>
        </div>
        <div class="px-4 space-y-2 col-span-2">
          <p
            class="text-gray-400 text-xs"
            v-if="featureCusPassPreview.length > 0"
          >
            Preview Images for Customer Passport
          </p>
          <div
            v-if="featureCusPassPreview.length > 0"
            class="grid grid-cols-3 gap-2"
          >
            <div
              v-for="(img, index) in featureCusPassPreview"
              :key="index"
              class="relative"
            >
              <img :src="img" alt="" />
              <span
                class="absolute top-[-10px] right-0"
                @click="removeCustomerPassportImage(index)"
              >
                <XCircleIcon class="w-6 h-6 text-red" />
              </span>
            </div>
          </div>
          <p
            class="text-gray-400 text-xs"
            v-if="customer_passport_data.length > 0"
          >
            Customer Passports
          </p>
          <div
            v-if="customer_passport_data.length > 0"
            class="grid grid-cols-2 gap-2"
          >
            <div
              v-for="(img, index) in customer_passport_data"
              :key="index"
              class="relative"
            >
              <a :href="img.file">
                <img :src="img.file" alt="" />
              </a>
              <span
                class="absolute top-[-10px] right-0"
                @click="deleteCustomerPassport(img.id)"
              >
                <TrashIcon class="w-6 h-6 text-red" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- route plan -->
    <div
      class="flex justify-start items-center px-4 py-2 shadow bg-white space-x-4 text-xs border-b border-main cursor-pointer"
      v-if="
        main?.product_type != 'App\\Models\\EntranceTicket' &&
        main?.product_type != 'App\\Models\\Hotel' &&
        main?.product_type != 'App\\Models\\Airline'
      "
      @click="routePlanHandle"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        data-slot="icon"
        class="w-6 h-6"
        v-if="!route_plan_part"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m19.5 8.25-7.5 7.5-7.5-7.5"
        />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        data-slot="icon"
        class="w-6 h-6"
        v-if="route_plan_part"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m4.5 15.75 7.5-7.5 7.5 7.5"
        />
      </svg>
      <p>ROUTE PLAN</p>
    </div>
    <div
      class="bg-black/5 p-2"
      v-if="
        route_plan_part &&
        main?.product_type != 'App\\Models\\EntranceTicket' &&
        main?.product_type != 'App\\Models\\Hotel' &&
        main?.product_type != 'App\\Models\\Airline'
      "
    >
      <div class="space-y-2 p-2 bg-transparent">
        <textarea
          class="w-full bg-transparent font-semibold shadow-sm px-4 py-2 text-gray-900 focus:outline-none text-xs border border-main rounded-sm h-auto"
          placeholder="enter like one, two, three"
          cols="4"
          v-model="formData.route_plan"
        ></textarea>
      </div>
    </div>

    <!-- other info -->
    <div
      class="flex justify-start items-center px-4 py-2 shadow bg-white space-x-4 text-xs border-b border-main cursor-pointer"
      @click="otherInfoHandle"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        data-slot="icon"
        class="w-6 h-6"
        v-if="!other_info_part"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m19.5 8.25-7.5 7.5-7.5-7.5"
        />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        data-slot="icon"
        class="w-6 h-6"
        v-if="other_info_part"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m4.5 15.75 7.5-7.5 7.5 7.5"
        />
      </svg>
      <p>OTHER INFORMATION</p>
    </div>
    <div class="bg-black/5 py-2 space-y-2" v-if="other_info_part">
      <div class="px-4 space-y-2">
        <p class="text-main text-xs">Special Requests</p>
        <textarea
          class="w-full bg-white border font-semibold border-main shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-main text-xs"
          cols="4"
          v-model="formData.special_request"
        ></textarea>
      </div>

      <div
        class="px-4 space-y-2"
        v-if="
          main?.product_type != 'App\\Models\\EntranceTicket' &&
          main?.product_type != 'App\\Models\\Hotel' &&
          main?.product_type != 'App\\Models\\Airline'
        "
      >
        <p class="text-main text-xs">Pickup Location</p>
        <textarea
          class="w-full bg-white border font-semibold border-main shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-main text-xs"
          cols="4"
          v-model="formData.pickup_location"
        ></textarea>
      </div>
      <div
        class="px-4 space-y-2"
        v-if="
          main?.product_type != 'App\\Models\\EntranceTicket' &&
          main?.product_type != 'App\\Models\\Hotel' &&
          main?.product_type != 'App\\Models\\Airline'
        "
      >
        <p class="text-main text-xs">Dropoff Location</p>
        <textarea
          class="w-full bg-white border font-semibold border-main shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-main text-xs"
          cols="4"
          v-model="formData.dropoff_location"
        ></textarea>
      </div>
    </div>

    <!-- car info -->
    <div
      v-if="main?.product_type != 'App\\Models\\Airline'"
      class="flex justify-start items-center px-4 py-2 shadow bg-white space-x-4 text-xs border-b border-main cursor-pointer"
      @click="carInfoSecHandle"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        data-slot="icon"
        class="w-6 h-6"
        v-if="!car_info_sec"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m19.5 8.25-7.5 7.5-7.5-7.5"
        />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        data-slot="icon"
        class="w-6 h-6"
        v-if="car_info_sec"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m4.5 15.75 7.5-7.5 7.5 7.5"
        />
      </svg>
      <p
        v-if="
          main?.product_type == 'App\\Models\\EntranceTicket' ||
          main?.product_type == 'App\\Models\\Hotel'
        "
      >
        SUPPLIER INFORMAION
      </p>
      <p v-if="main?.product_type == 'App\\Models\\AirportPickup'">
        ASSIGN DRIVER
      </p>
      <p
        v-if="
          main?.product_type != 'App\\Models\\EntranceTicket' &&
          main?.product_type != 'App\\Models\\Hotel' &&
          main?.product_type != 'App\\Models\\AirportPickup'
        "
      >
        CAR INFORMATION
      </p>
    </div>
    <div
      class="bg-black/5 px-3 py-3 space-y-1"
      v-if="car_info_sec && main?.product_type != 'App\\Models\\Airline'"
    >
      <div
        class="px-2 space-y-1"
        v-if="
          main?.product_type != 'App\\Models\\EntranceTicket' &&
          main?.product_type != 'App\\Models\\Hotel' &&
          main?.product_type != 'App\\Models\\AirportPickup'
        "
      >
        <p class="text-main text-xs">Account Holder Name</p>
        <input
          v-model="formData.account_holder_name"
          type="text"
          id="title"
          class="h-8 w-full font-semibold bg-white border border-main shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-main text-xs"
        />
      </div>
      <div class="px-2 space-y-1">
        <p class="text-main text-xs">Supplier Name</p>
        <input
          v-model="formData.supplier_name"
          type="text"
          id="title"
          class="h-8 w-full font-semibold bg-white border border-main shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-main text-xs"
        />
      </div>
      <div
        class="px-2 space-y-1"
        v-if="
          main?.product_type != 'App\\Models\\EntranceTicket' &&
          main?.product_type != 'App\\Models\\Hotel'
        "
      >
        <p class="text-main text-xs">Driver Name</p>
        <input
          v-model="formData.driver_name"
          type="text"
          id="title"
          class="h-8 w-full font-semibold bg-white border border-main shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-main text-xs"
        />
      </div>
      <div
        class="px-2 space-y-1"
        v-if="
          main?.product_type != 'App\\Models\\EntranceTicket' &&
          main?.product_type != 'App\\Models\\Hotel'
        "
      >
        <p class="text-main text-xs">Driver Contact</p>
        <input
          v-model="formData.driver_contact"
          type="text"
          id="title"
          class="h-8 w-full font-semibold bg-white border border-main shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-main text-xs"
        />
      </div>
      <div
        class="px-2 space-y-1"
        v-if="
          main?.product_type == 'App\\Models\\EntranceTicket' ||
          main?.product_type == 'App\\Models\\Hotel'
        "
      >
        <p class="text-main text-xs">Reference Number</p>
        <input
          v-model="formData.ref_number"
          type="text"
          id="title"
          class="h-8 w-full font-semibold bg-white border border-main shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-main text-xs"
        />
      </div>
      <div
        class="px-2 space-y-1"
        v-if="
          main?.product_type != 'App\\Models\\EntranceTicket' &&
          main?.product_type != 'App\\Models\\Hotel'
        "
      >
        <p class="text-main text-xs">Car Number</p>

        <input
          v-model="formData.car_number"
          type="text"
          id="title"
          class="h-8 w-full font-semibold bg-white border border-main shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-main text-xs"
        />
      </div>
      <div class="px-2 space-y-1">
        <p
          class="text-main text-xs"
          v-if="
            main?.product_type == 'App\\Models\\EntranceTicket' ||
            main?.product_type == 'App\\Models\\Hotel'
          "
        >
          Booking Confirmation Letter
        </p>
        <p class="text-main text-xs" v-else>Car Photos</p>

        <div class="space-y-1 mb-2">
          <label for="image" class="text-gray-800 text-sm relative">
            <span
              v-if="previewImage"
              @click.prevent="removeSelectedImage"
              class="text-red-400 text-xs cursor-pointer font-semibold underline absolute top-0 left-0"
              ><XCircleIcon class="w-6 h-6 text-black" /></span
          ></label>
          <input
            type="file"
            id="image"
            ref="fileInput"
            class="hidden"
            @change="handleFileChange"
            accept="image/*"
          />
          <div v-if="previewImage" class="w-full h-auto">
            <img
              :src="previewImage"
              alt="Image preview"
              class="rounded w-full h-auto"
            />
          </div>
          <div
            v-else
            @click.prevent="openFilePicker"
            class="font-semibold py-4 px-4 flex justify-center items-center text-xs border border-main border-dashed"
          >
            <span class="text-xs">Click & Drops</span>
          </div>
        </div>
        <div
          class="grid grid-cols-3 gap-4 bg-gray-200/50"
          v-if="booking_confirm_letters.length != 0"
        >
          <div v-for="(image, index) in booking_confirm_letters" :key="index">
            <p class="text-[12px] mb-2 mt-2 text-main">
              Booking Confirm {{ index + 1 }}
            </p>
            <a :href="image.file" target="_blink">
              <img :src="image.file" alt="" />
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- reservation info -->
    <div
      class="flex justify-start items-center px-4 py-2 shadow bg-white space-x-4 text-xs border-b border-main cursor-pointer"
      @click="reservationInfoHandle"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        data-slot="icon"
        class="w-6 h-6"
        v-if="!reservation_info_part"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m19.5 8.25-7.5 7.5-7.5-7.5"
        />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        data-slot="icon"
        class="w-6 h-6"
        v-if="reservation_info_part"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m4.5 15.75 7.5-7.5 7.5 7.5"
        />
      </svg>

      <p>RESERVATION INFORMATION</p>
    </div>
    <div class="bg-black/5 py-3 space-y-2" v-if="reservation_info_part">
      <div class="space-y-2">
        <div class="px-5 space-y-1">
          <p class="text-main text-xs">Reservation Status</p>
          <v-select
            v-model="formData.reservation_status"
            class="style-chooser bg-white text-main border-main border"
            :options="reservation_status"
            label="name"
            :clearable="false"
            :reduce="(d) => d.name"
            placeholder="choose status"
          ></v-select>
        </div>
        <div class="px-5 space-y-1">
          <p class="text-main text-xs">Reservation Slip Code</p>
          <input
            v-model="formData.slip_code"
            type="title"
            id="title"
            class="h-8 w-full font-semibold bg-white border border-main shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-main text-xs"
          />
        </div>

        <div class="px-5 space-y-1">
          <p
            class="text-main text-xs"
            v-if="main?.product_type == 'App\\Models\\Hotel'"
          >
            Hotel Confirmation Receipt
          </p>
          <p class="text-main text-xs" v-else>Reservation Slip</p>
          <div class="space-y-4 mb-2">
            <input
              type="file"
              id="image"
              ref="fileInputTwo"
              multiple
              class="hidden"
              @change="exphandleFileChange"
              accept="image/*"
            />
            <div
              @click.prevent="openFilePickerTwo"
              class="font-semibold py-4 px-4 flex justify-center items-center text-xs border border-main border-dashed"
            >
              <span class="text-xs">Click & Drops</span>
            </div>

            <div class="grid grid-cols-3 gap-3 mt-4">
              <div
                class="relative"
                v-for="(image, index) in expPreviewImage"
                :key="index"
              >
                <button
                  @click.prevent="expremoveSelectedImage(index)"
                  class="rounded-full text-sm text-red-600 items-center justify-center flex absolute top-[-0.9rem] right-[-0.7rem]"
                >
                  <XCircleIcon class="w-6 h-6 font-semibold" />
                </button>

                <img class="h-auto w-full rounded" :src="image.file" alt="" />
                <input
                  type="number"
                  name="amount"
                  v-model="formData.paid_slip[index].amount"
                  id=""
                  class="w-full h-8 bg-white border border-gray-300 shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
                />
              </div>
            </div>
            <div
              class="grid grid-cols-2 gap-4 bg-gray-200/50"
              v-if="paid_slip_image.length != 0"
            >
              <div v-for="(image, index) in paid_slip_image" :key="index">
                <p class="text-xs mb-2">
                  <span class="flex justify-start gap-2 items-center">
                    <TrashIcon
                      class="w-6 h-6 text-red font-semibold"
                      @click="deleteImagePaid(image.id)"
                    />
                    paid slip {{ index + 1 }}
                  </span>
                  <a
                    :href="image.file"
                    target="_blink"
                    class="text-xs text-blue-700 cursor-pointer"
                  >
                    <img :src="image.file" alt="" />
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- expense info -->
    <div
      class="flex justify-start items-center px-4 py-2 shadow bg-white space-x-4 text-xs border-b border-main cursor-pointer"
      @click="expenInfoHandle"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        data-slot="icon"
        class="w-6 h-6"
        v-if="!expen_info_part"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m19.5 8.25-7.5 7.5-7.5-7.5"
        />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        data-slot="icon"
        class="w-6 h-6"
        v-if="expen_info_part"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m4.5 15.75 7.5-7.5 7.5 7.5"
        />
      </svg>

      <p>EXPENSE INFORMAION</p>
    </div>

    <div class="bg-black/5 py-5 space-y-2" v-if="expen_info_part">
      <div class="px-5 space-y-2">
        <p class="text-main text-xs">Payment Method:</p>

        <v-select
          v-model="formData.payment_method"
          class="style-chooser bg-white text-main border-main border"
          :options="paymentArray"
          label="name"
          :clearable="false"
          :reduce="(d) => d.name"
          placeholder="payment method"
        ></v-select>
      </div>
      <div class="px-5 space-y-2">
        <p class="text-main text-xs">Bank Name:</p>

        <v-select
          v-model="formData.bank_name"
          class="style-chooser bg-white text-main border-main border"
          :options="payment"
          label="name"
          :clearable="false"
          :reduce="(d) => d.name"
          placeholder=" bank name"
        ></v-select>
      </div>
      <div class="px-5 space-y-2">
        <p class="text-main text-xs">Payment Status</p>
        <v-select
          v-model="formData.payment_status"
          class="style-chooser bg-white text-main border-main border"
          :options="payment_status"
          label="name"
          :clearable="false"
          :reduce="(d) => d.name"
          placeholder=" payment status"
        ></v-select>
      </div>
      <div class="px-5 space-y-2">
        <p class="text-main text-xs">Bank Account Number</p>
        <input
          v-model="formData.bank_account_number"
          type="number"
          id="title"
          class="h-8 w-full font-semibold bg-white border border-main shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-main text-xs"
        />
      </div>
      <div class="px-5 space-y-2">
        <p class="text-main text-xs">Unit Cost</p>
        <input
          v-model="formData.cost_price"
          type="text"
          id="title"
          class="h-8 w-full font-semibold bg-white border border-main shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-main text-xs"
        />
      </div>
      <div
        class="space-y-2"
        v-if="
          main?.product_type == 'App\\Models\\EntranceTicket' ||
          main?.product_type == 'App\\Models\\Hotel' ||
          main?.product_type == 'App\\Models\\PrivateVanTour' ||
          main?.product_type == 'App\\Models\\GroupTour' ||
          main?.product_type == 'App\\Models\\Airline'
        "
      >
        <div class="px-5 space-y-2">
          <p class="text-main text-xs">Total Cost</p>
          <p
            class="h-8 w-full font-semibold bg-white border border-main shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-main text-xs"
            v-if="!main?.checkin_date"
          >
            {{ formData.cost_price * main?.quantity }}
          </p>
          <p
            class="h-8 w-full font-semibold bg-white border border-main shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-main text-xs"
            v-if="main?.checkin_date"
          >
            {{ formData.cost_price * main?.quantity * days }}
          </p>
        </div>

        <div class="px-5 space-y-2">
          <p class="text-main text-xs">Receipt</p>
          <div class="space-y-4 mb-2">
            <input
              type="file"
              id="image"
              ref="fileInputThree"
              multiple
              class="hidden"
              @change="recehandleFileChange"
              accept="image/*"
            />
            <div
              @click.prevent="openFilePickerThree"
              class="font-semibold py-4 px-4 flex justify-center items-center text-xs border border-main border-dashed"
            >
              Click & Drops
            </div>

            <div class="grid grid-cols-3 gap-3 mt-4">
              <div
                class="relative"
                v-for="(image, index) in uploadRecePreview"
                :key="index"
              >
                <button
                  @click.prevent="expremoveSecSelectedImage(index)"
                  class="rounded-full text-sm text-red-600 items-center justify-center flex absolute top-[-0.9rem] right-[-0.7rem]"
                >
                  <XCircleIcon class="w-8 h-8 font-semibold" />
                </button>

                <img class="h-auto w-full rounded" :src="image" alt="" />
              </div>
            </div>

            <div
              class="grid grid-cols-2 gap-4 bg-gray-200/50"
              v-if="booking_receipt.length != 0"
            >
              <div v-for="(image, index) in booking_receipt" :key="index">
                <!-- <span
                  ><i
                    class="fa-solid fa-trash-can text-lg text-red-500"
                    @click="deleteImage(image.id)"
                  ></i
                ></span> -->
                <span>
                  <TrashIcon
                    @click="deleteImage(image.id)"
                    class="h-6 w-6 text-red"
                  />
                </span>
                <a :href="image.file" target="_blink">
                  <img :src="image.file" alt="" />
                </a>
              </div>
            </div>
            <div class="space-y-2">
              <p class="text-main text-xs font">Expense Comment</p>

              <textarea
                class="w-full bg-white border border-main shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-main font-semibold text-xs"
                cols="4"
                v-model="formData.customer_feedback"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- mail info -->
    <div
      class="flex justify-start items-center px-4 py-2 shadow bg-white space-x-4 text-xs border-b border-main cursor-pointer"
      @click="emailInfoHandle"
      v-if="
        main?.product_type == 'App\\Models\\EntranceTicket' ||
        main?.product_type == 'App\\Models\\Hotel'
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        data-slot="icon"
        class="w-6 h-6"
        v-if="!email_info_part"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m19.5 8.25-7.5 7.5-7.5-7.5"
        />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        data-slot="icon"
        class="w-6 h-6"
        v-if="email_info_part"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m4.5 15.75 7.5-7.5 7.5 7.5"
        />
      </svg>
      <div>
        <p v-if="main?.product_type == 'App\\Models\\EntranceTicket'" class="">
          TICKET EMAIL PREVIEW INFORMAION
        </p>
        <p v-if="main?.product_type == 'App\\Models\\Hotel'" class="">
          HOTEL EMAIL PREVIEW INFORMAION
        </p>
      </div>
    </div>
    <div
      class="grid grid-cols-1 gap-4 bg-black/5 py-4 overflow-hidden"
      v-if="email_info_part"
    >
      <div class="w-[95%] mx-auto flex justify-end items-center">
        <div class="space-x-2 pr-3">
          <button
            class="text-xs px-4 py-2 border border-[#FF6300] bg-[#FF6300] text-white"
            @click="cancelEmailFunction"
          >
            Clear Email
          </button>
          <button
            class="text-xs px-4 py-2 border border-[#FF6300] bg-white"
            v-if="
              main?.payment_status == 'fully_paid' ||
              main?.booking?.payment_method == 'Cash'
            "
            @click="sendEmailFunction"
          >
            Send Email
          </button>
          <button
            v-if="
              main?.payment_status != 'fully_paid' &&
              main?.booking?.payment_method != 'Cash'
            "
            class="text-xs px-4 py-2 border border-[#FF6300] bg-black/40"
          >
            Send Email
          </button>
        </div>
      </div>
      <div class="text-center" v-if="emailLoading">
        Email sending , Please wait loading .....
      </div>
      <div
        class="w-[95%] mx-auto shadow p-3 rounded bg-white mb-4 space-y-3 text-xs"
      >
        <div class="space-y-4">
          <div>
            <input
              type="email"
              v-model="emailData.mail_to"
              class="border-[#FF6300] px-4 py-2 border text-xs w-full"
              placeholder="Sender Email"
            />
          </div>

          <div>
            <input
              type="text"
              v-model="emailData.mail_subject"
              class="border-[#FF6300] px-4 py-2 border text-xs w-full"
              placeholder="Subject"
            />
          </div>

          <div class="flex justify-start items-center gap-2">
            <input
              type="checkbox"
              v-model="emailData.send_to_default"
              name=""
              id=""
              class="w-6 h-6 border border-[#FF6300]"
            />
            <p class="text-xs">default email send ?</p>
          </div>
          <div class="">
            <QuillEditor
              ref="textEditor"
              :options="editorOptions"
              theme="snow"
              class="!bg-white/50 !border-1 !border-[#FF6300] !rounded-bl-md !rounded-br-md !shadow-sm !text-xs !text-gray-900 !h-[350px]"
              toolbar="essential"
              contentType="html"
              v-model:content="emailData.mail_body"
            />
          </div>
          <div class="space-y-2">
            <p class="text-xs text-[#FF6300]">
              Attachment Files must be under 25mb .
            </p>
            <input
              type="file"
              multiple
              @change="addAttracted"
              class="border-[#FF6300] px-4 py-2 border text-xs w-full"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- update -->
    <div class="flex justify-end pr-4 items-center">
      <button
        v-if="
          main?.product_type == 'App\\Models\\EntranceTicket' ||
          main?.product_type == 'App\\Models\\Hotel' ||
          main?.product_type == 'App\\Models\\PrivateVanTour' ||
          main?.product_type == 'App\\Models\\GroupTour' ||
          main?.product_type == 'App\\Models\\Airline'
        "
        @click.prevent="onSubmitHandler"
        class="mb-2 mt-4 px-4 py-2 bg-[#ff613c] text-white hover:bg-blue-600 shadow"
      >
        Update Reservation
      </button>

      <!-- <button
        v-if="
          main?.product_type != 'App\\Models\\EntranceTicket' &&
          main?.product_type != 'App\\Models\\Hotel' &&
          main?.product_type != 'App\\Models\\PrivateVanTour' &&
          main?.product_type != 'App\\Models\\GroupTour' &&
          main?.product_type != 'App\\Models\\Airline'
        "
        @click.prevent="onSubmitHandler"
        class="mb-2 mt-4 px-4 py-2 bg-[#ff613c] text-white hover:bg-blue-600 shadow"
      >
        Update Reservation
      </button> -->
    </div>
  </div>
</template>
