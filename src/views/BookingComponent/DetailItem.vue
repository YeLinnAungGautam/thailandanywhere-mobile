<script setup>
import {
  BarsArrowDownIcon,
  CheckBadgeIcon,
  MagnifyingGlassIcon,
  MagnifyingGlassPlusIcon,
  ArrowsPointingOutIcon,
  PlusIcon,
  XCircleIcon,
  XMarkIcon,
  DocumentCheckIcon,
} from "@heroicons/vue/24/outline";
import { onMounted, defineProps, ref, watch } from "vue";
import Modal from "../../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import van from "../../../public/1.png";
import saloon from "../../../public/2.png";
import deluxe from "../../../public/3.png";
import { useReservationStore } from "../../stores/reservation";
import { useToast } from "vue-toastification";
import bookingInfo from "../../../public/bookingInfo.png";
import travellerInfo from "../../../public/travellerInfo.png";
import DetailitemVue from "./DetailItemView.vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const reservationStore = useReservationStore();
const toast = useToast();

const props = defineProps({
  data: Object,
  showEditPart: Function,
  uploadingAction: Function,
});
const itemList = ref([]);

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

const openModal = ref(false);
const showData = ref(null);
const editData = ref({
  id: "",
  name: "",
  passport: "",
  phone: "",
  email: "",
  customer_passport: [],
  customer_passport_have: [],
});
const addItemModal = ref(false);
const addInfoModal = ref(false);
const addTravellerModal = ref(false);
const openModalPart = ref(false);
const openModalAction = (data) => {
  openModal.value = true;
  openModalPart.value = true;
  showData.value = data;
};

const openAndAddPassport = (data) => {
  openModal.value = true;
  openModalPart.value = true;
  showData.value = data;

  goTravellerModal(data);
};

const headLabel = ref("");
const secLabel = ref("");

watch(
  [addItemModal, addInfoModal, addTravellerModal, openModalPart],
  ([itemValue, infoValue, travellerValue, openModalValue]) => {
    if (addItemModal.value == true) {
      headLabel.value = "Product Information";
      secLabel.value = "Please contact super admin for product amends";
    } else if (addInfoModal.value == true) {
      headLabel.value = "Booking Information";
      secLabel.value = "Checking your booking information";
    } else if (addTravellerModal.value == true) {
      headLabel.value = "Fill Traveller Information";
      secLabel.value =
        "To make reservation easier, please insert customer info.";
    } else if (openModalPart.value == true) {
      headLabel.value = "Chose Detail Type";
      secLabel.value = "Please choose your required detail type";
    }
  }
);

const openAddItemModalAction = () => {
  addItemModal.value = true;
  openModalPart.value = false;
  // showData.value = data;
};
const cancelAction = () => {
  showData.value = null;
  addItemModal.value = false;
  openModal.value = false;
  addInfoModal.value = false;
  addTravellerModal.value = false;
  closeTravellerModal();
};

const backAction = () => {
  addItemModal.value = false;
  openModalPart.value = true;
  addInfoModal.value = false;
  addTravellerModal.value = false;
  closeTravellerModal();
};

const goInfoModal = (data) => {
  addInfoModal.value = true;
  // showData.value = data;
  addInfoModal.value = true;
  openModalPart.value = false;
};
const closeTravellerModal = () => {
  addTravellerModal.value = false;
  // openModal.value = false;
  editData.value = {
    id: "",
    name: "",
    passport: "",
    phone: "",
    email: "",
    customer_passport: [],
    customer_passport_have: [],
  };
  featureImagePreview.value = [];
};

const featureImageInput = ref(null);

const goTravellerModal = (data) => {
  addTravellerModal.value = true;
  openModalPart.value = false;
  editData.value.id = data.reservation_id;
  editData.value.name = data.associated_customer[0]?.name
    ? data.associated_customer[0]?.name
    : "";
  editData.value.passport = data.associated_customer[0]?.passport
    ? data.associated_customer[0]?.passport
    : "";
  editData.value.phone = data.associated_customer[0]?.phone
    ? data.associated_customer[0]?.phone
    : "";
  editData.value.email = data.associated_customer[0]?.email
    ? data.associated_customer[0]?.email
    : "";
  editData.value.customer_passport_have =
    data.customer_passport.length > 0 ? data.customer_passport : [];
};

const featureImagePreview = ref([]);
const handlerFeatureFileChange = (e) => {
  let selectedFile = e.target.files;

  for (let index = 0; index < selectedFile.length; index++) {
    editData.value.customer_passport.push(selectedFile[index]);
    featureImagePreview.value.push(URL.createObjectURL(selectedFile[index]));
  }
};

const openFileFeaturePicker = () => {
  featureImageInput.value.click();
};

const removeFeatureSelectImage = (index) => {
  editData.value.customer_passport.splice(index, 1);
  featureImagePreview.value.splice(index, 1);
  // console.log(editData.value.customer_passport, "this is remove");
};

const removeFeatureDeleteImage = async (index, id) => {
  const res = await reservationStore.deleteTravellerImageAction(id);
  if (res) {
    editData.value.customer_passport_have.splice(index, 1);
    // featureImagePreview.value.splice(index, 1);
  }
  // console.log(editData.value.customer_passport, "this is remove");
};

const addTravellerAction = async () => {
  props.uploadingAction();
  addTravellerModal.value = false;
  const frmData = new FormData();
  frmData.append("name", editData.value.name ? editData.value.name : "-");
  frmData.append(
    "passport",
    editData.value.passport ? editData.value.passport : "-"
  );
  frmData.append("phone", editData.value.phone ? editData.value.phone : "09");
  editData.value.email && frmData.append("email", editData.value.email);
  if (editData.value.customer_passport.length != 0) {
    for (let x = 0; x < editData.value.customer_passport.length; x++) {
      frmData.append(
        "customer_passport[" + x + "]",
        editData.value.customer_passport[x]
      );
    }
  }

  const res = await reservationStore.updateTravellerAction(
    frmData,
    editData.value.id
  );

  console.log(res, "this is res");
  if (res.message == "success") {
    toast.success(res.message);
  } else {
    toast.error(res.message);
  }
  // closeTravellerModal();

  setTimeout(() => {
    props.uploadingAction();
    window.location.reload();
  }, 1000);
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

const queryCrmId = ref("");

onMounted(async () => {
  if (props.data) {
    itemList.value = props.data.items;
  }
  queryCrmId.value = route.query.crm_id;

  // Trigger modal logic after mounting if `crm_id` exists
  checkAndOpenModal(queryCrmId.value);
});

watch([queryCrmId, itemList], ([newCrmId, newItemList]) => {
  if (newCrmId && newItemList.length) {
    checkAndOpenModal(newCrmId);
  }
});

// Function to check and open the modal
function checkAndOpenModal(crmId) {
  if (!crmId) return;

  const matchingItem = itemList.value.find((item) => item.crm_id === crmId);
  if (matchingItem) {
    openAndAddPassport(matchingItem);
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <h1 class="text-sm font-medium">All Items</h1>
      <div
        @click="showEditPart"
        class="bg-blue-500 p-2 rounded-xl flex justify-end items-center gap-x-2"
      >
        <!-- filter icon -->
        <PlusIcon class="w-4 h-4 text-white" />
        <p class="text-white text-xs pr-3">Add new items</p>
      </div>
    </div>
    <!-- search part -->
    <div
      class="flex justify-start items-center gap-x-2 flex-nowrap relative mr-2"
    >
      <div class="relative w-full">
        <input
          type="text"
          name=""
          class="bg-white w-full px-8 py-2.5 rounded-lg focus:outline-none text-xs"
          placeholder="Search items here !"
          id=""
        />

        <MagnifyingGlassPlusIcon
          class="w-4 h-4 absolute text-[#ff613c] top-2.5 left-2"
        />
      </div>
      <div class="bg-[#ff613c] p-2 rounded-full">
        <!-- filter icon -->
        <BarsArrowDownIcon class="w-4 h-4 text-white" />
      </div>

      <div
        class="bg-[#ff613c] py-2 px-4 cursor-pointer text-xs text-white rounded-xl"
      >
        Search
      </div>
    </div>

    <!-- list  -->
    <div
      class="grid grid-cols-3 gap-3 max-h-[60vh] overflow-y-scroll no-sidebar-container"
      v-if="itemList?.length > 0"
    >
      <div
        v-for="i in itemList ?? []"
        :key="i"
        class="p-2 rounded-xl bg-white"
        :class="i?.product_type != undefined ? '' : 'hidden'"
      >
        <div class="flex justify-start items-start gap-x-2">
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
            </div>
            <p class="text-[10px] line-clamp-1">{{ i?.item_name }}</p>
            <div class="flex justify-between items-center">
              <p class="text-[10px]">{{ i?.service_date }}</p>
              <!-- <p class="text-[10px]">
                  Discount :
                  <span class="font-medium text-xs">{{ i?.discount }} ฿</span>
                </p> -->
            </div>
          </div>
        </div>
        <div
          v-if="i?.crm_id"
          class="flex justify-between items-center pt-2"
          @click="
            router.push(`/reservation/update/${i?.reservation_id}/${i?.crm_id}`)
          "
        >
          <p
            class="text-[10px] font-medium px-2 py-0.5 rounded-full"
            :class="i?.is_inclusive == 1 ? 'bg-yellow-300' : 'bg-gray-100'"
          >
            {{ i?.crm_id }}
          </p>
          <DocumentCheckIcon
            class="w-5 h-5 text-[#ff613c] shadow-lg bg-white p-0.5 rounded-full"
          />
        </div>
        <div class="space-y-1 py-2">
          <div
            class="flex justify-between items-center"
            v-if="i?.product_type != 1"
          >
            <p class="text-[10px] font-medium">Expense Status :</p>
            <CheckBadgeIcon
              class="w-4 h-4 text-green-600"
              v-if="i?.payment_status == 'fully_paid'"
            />
            <XMarkIcon
              class="w-4 h-4 text-red-600"
              v-if="i?.payment_status != 'fully_paid'"
            />
          </div>
          <div
            class="flex justify-between items-center"
            v-if="i?.product_type != 1"
          >
            <p class="text-[10px] font-medium">Passport Info :</p>
            <CheckBadgeIcon
              class="w-4 h-4 text-green-600"
              v-if="i?.associated_customer?.length > 0"
            />
            <XMarkIcon
              class="w-4 h-4 text-red-600"
              v-if="i?.associated_customer?.length == 0"
            />
          </div>
          <div
            class="flex justify-between items-center"
            v-if="i?.product_type != 1"
          >
            <p class="text-[10px] font-medium">Confirmation :</p>
            <CheckBadgeIcon
              class="w-4 h-4 text-green-600"
              v-if="i?.reservation_status == 'confirmed'"
            />
            <XMarkIcon
              class="w-4 h-4 text-red-600"
              v-if="i?.reservation_status != 'confirmed'"
            />
          </div>
          <div
            class="flex justify-between items-center"
            v-if="i?.product_type == 1"
          >
            <p class="text-[10px] font-medium">Driver Collect :</p>
            <CheckBadgeIcon
              class="w-4 h-4 text-green-600"
              v-if="i?.is_driver_collect"
            />
            <XMarkIcon
              class="w-4 h-4 text-red-600"
              v-if="!i?.is_driver_collect"
            />
          </div>
          <div
            class="flex justify-between items-center"
            v-if="i?.product_type == 1"
          >
            <p class="text-[10px] font-medium">Route Plan :</p>
            <CheckBadgeIcon
              class="w-4 h-4 text-green-600"
              v-if="i?.route_plan != ''"
            />
            <XMarkIcon
              class="w-4 h-4 text-red-600"
              v-if="i?.route_plan == ''"
            />
          </div>
          <div
            class="flex justify-between items-center"
            v-if="i?.product_type == 1"
          >
            <p class="text-[10px] font-medium">Pick-up details :</p>
            <CheckBadgeIcon
              class="w-4 h-4 text-green-600"
              v-if="i?.pickup_time != '' && i?.pickup_location != ''"
            />
            <XMarkIcon
              class="w-4 h-4 text-red-600"
              v-if="i?.pickup_time == '' || i?.pickup_location == ''"
            />
          </div>
        </div>
        <div class="flex justify-between items-center">
          <p class="text-base font-medium">{{ i?.total_amount }} thb</p>
          <p
            v-if="i?.reservation_id"
            @click="openModalAction(i)"
            class="bg-blue-500 text-white text-[10px] px-3 py-1.5 rounded-full cursor-pointer"
          >
            Add Detail
          </p>
        </div>
      </div>
    </div>
    <Modal :isOpen="openModal" @closeModal="cancelAction">
      <DialogPanel
        class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h3"
          class="text-lg font-medium leading-6 text-gray-900 mb-1"
        >
          {{ headLabel }}
        </DialogTitle>
        <div class="space-y-2.5 pb-3 border-b border-gray-300">
          <p class="text-xs text-gray-500">
            {{ secLabel }}
          </p>
        </div>
        <!-- view type -->
        <div class="" v-if="openModalPart">
          <div class="h-[300px] overflow-y-scroll">
            <div
              class="bg-white p-2 rounded-xl border mt-2 shadow-sm space-y-2"
            >
              <div class="flex justify-start items-start gap-x-2">
                <img
                  :src="
                    showData?.product_image
                      ? showData?.product_image
                      : 'https://placehold.co/400'
                  "
                  class="w-16 h-16 rounded-lg"
                  alt=""
                />

                <div class="w-full">
                  <p
                    class="text-sm font-medium pb-1 text-[#ff613c] line-clamp-1"
                  >
                    {{ showData?.product_name }}
                    <!-- View type -->
                  </p>
                  <p class="text-xs">{{ showData?.item_name }}</p>
                  <div class="flex justify-between items-center">
                    <p class="text-xs">{{ showData?.quantity }} Qty</p>
                    <div
                      class="flex justify-end items-center"
                      v-if="
                        showData?.product_type != 1 &&
                        showData?.product_type != 7
                      "
                    >
                      <p
                        @click="openAddItemModalAction(showData)"
                        class="text-xs font-medium bg-[#ff613c] rounded-lg px-4 py-1 text-white"
                      >
                        View
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="bg-white p-2 rounded-xl border mt-2 shadow-sm space-y-2"
            >
              <div class="flex justify-start items-start gap-x-2">
                <img :src="bookingInfo" class="w-16 h-16 rounded-lg" alt="" />

                <div class="w-full">
                  <p class="text-sm font-medium pb-1 line-clamp-1">
                    Booking information
                  </p>
                  <p class="text-xs">{{ showData?.service_date }}</p>
                  <div class="flex justify-between items-center">
                    <p class="text-xs">
                      {{
                        showData?.is_driver_collect ? "collect" : "bank tranfer"
                      }}
                    </p>
                    <div class="flex justify-end items-center">
                      <p
                        @click="goInfoModal(showData)"
                        class="text-xs font-medium bg-[#ff613c] rounded-lg px-4 py-1 text-white"
                      >
                        View
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="bg-white p-2 rounded-xl border mt-2 shadow-sm space-y-2"
              v-if="showData?.product_type != 1 && showData?.product_type != 7"
            >
              <div class="flex justify-start items-start gap-x-2">
                <img :src="travellerInfo" class="w-16 h-16 rounded-lg" alt="" />

                <div class="w-full">
                  <p class="text-sm font-medium pb-1 line-clamp-1">
                    Traveller information
                  </p>
                  <p class="text-xs">
                    {{
                      showData?.customer_passport != undefined
                        ? showData?.customer_passport.length
                        : "-"
                    }}
                    Passports
                  </p>
                  <div class="flex justify-between items-center">
                    <p class="text-xs">
                      {{
                        showData?.associated_customer[0]?.name
                          ? showData?.associated_customer[0]?.name
                          : "-"
                      }}
                    </p>
                    <div class="flex justify-end items-center">
                      <p
                        @click="goTravellerModal(showData)"
                        class="text-xs font-medium bg-[#ff613c] rounded-lg px-4 py-1 text-white cursor-pointer"
                      >
                        Edit Detail
                      </p>
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
          </div>
        </div>
        <!-- view detail -->
        <div v-if="addItemModal == true">
          <div class="h-[600px] overflow-y-scroll pr-2">
            <!-- {{ showData.product_id }} -->
            <DetailitemVue
              :id="showData?.car_id"
              :type="showData?.product_type"
            />
          </div>
          <div class="flex justify-end items-center gap-x-2 pt-2">
            <button
              @click="backAction"
              class="bg-white border border-gray-300 px-3 py-2.5 rounded-lg text-xs"
            >
              Back
            </button>
            <button
              @click="cancelAction"
              class="bg-white border border-gray-300 px-3 py-2.5 rounded-lg text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
        <!-- view info -->
        <div v-if="addInfoModal == true">
          <div class="h-[450px] overflow-y-scroll py-2 space-y-2 pr-1">
            <div v-if="showData?.product_type != 6" class="space-y-2">
              <div class="grid grid-cols-2 gap-x-2">
                <div class="space-y-1" v-if="showData?.product_type == 1">
                  <label for="" class="text-[12px] text-gray-500"
                    >Pick up time</label
                  >
                  <input
                    type="time"
                    :value="showData?.pickup_time"
                    name=""
                    disabled
                    class="border border-gray-300 bg-gray-100 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                    id=""
                  />
                </div>
                <div class="space-y-1">
                  <label for="" class="text-[12px] text-gray-500"
                    >Service date</label
                  >
                  <input
                    type="date"
                    :value="showData?.service_date"
                    name=""
                    disabled
                    class="border border-gray-300 bg-gray-100 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                    id=""
                  />
                </div>
              </div>
              <div class="space-y-1" v-if="showData?.product_type == 1">
                <label for="" class="text-[12px] text-gray-500"
                  >Pick up location</label
                >
                <input
                  type="text"
                  :value="showData?.pickup_location"
                  name=""
                  disabled
                  class="border bg-gray-100 border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                  id=""
                />
              </div>
              <div class="grid grid-cols-2 gap-x-2">
                <div class="space-y-1" v-if="showData?.product_type == 1">
                  <label for="" class="text-[12px] text-gray-500"
                    >Payment Method</label
                  >
                  <div class="flex justify-start items-center gap-x-2">
                    <input
                      type="checkbox"
                      name=""
                      disabled
                      :value="showData?.is_driver_collect"
                      class="px-4 w-6 bg-gray-100 h-6 py-4 text-sm border border-gray-300 rounded-sm focus:outline-none"
                      id=""
                    />
                    <p class="text-xs">Is Driver Collect ?</p>
                  </div>
                </div>
                <div class="space-y-1">
                  <label for="" class="text-[12px] text-gray-500">Qty</label>
                  <input
                    type="number"
                    :value="showData?.quantity"
                    name=""
                    disabled
                    class="border border-gray-300 bg-gray-100 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                    id=""
                  />
                </div>
              </div>
            </div>
            <div
              class="grid grid-cols-2 gap-2"
              v-if="showData?.product_type == 6"
            >
              <div class="space-y-1">
                <label for="" class="text-[12px] text-gray-500"
                  >Check in date</label
                >
                <input
                  type="date"
                  :value="showData?.service_date"
                  name=""
                  disabled
                  class="border w-full bg-gray-100 border-gray-300 px-2 py-2 rounded-lg text-xs focus:outline-none"
                  id=""
                />
              </div>
              <div class="space-y-1">
                <label for="" class="text-[12px] text-gray-500"
                  >Check out date</label
                >
                <input
                  type="date"
                  :value="showData?.checkout_date"
                  name=""
                  disabled
                  class="border w-full bg-gray-100 px-2 py-2 rounded-lg text-xs focus:outline-none"
                  id=""
                />
              </div>
              <div class="space-y-1">
                <label for="" class="text-[12px] text-gray-500"
                  >Total Rooms</label
                >
                <input
                  type="number"
                  :value="showData?.quantity"
                  disabled
                  name=""
                  class="border bg-gray-100 border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                  id=""
                />
              </div>
              <div class="space-y-1">
                <label for="" class="text-[12px] text-gray-500">Qty</label>
                <p
                  class="border border-gray-300 bg-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                >
                  {{ showData?.days }} Night x {{ showData?.quantity }} Rooms
                </p>
              </div>
            </div>
            <div class="space-y-1">
              <label for="" class="text-[12px] text-gray-500">Discount</label>
              <input
                type="number"
                :value="showData?.discount"
                disabled
                name=""
                class="border border-gray-300 bg-gray-100 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                id=""
              />
            </div>
            <div class="space-y-1" v-if="showData?.product_type == 1">
              <label for="" class="text-[12px] text-gray-500">Route Plan</label>
              <textarea
                name=""
                :value="showData?.route_plan"
                disabled
                class="border bg-gray-100 border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                id=""
              ></textarea>
            </div>
            <div class="space-y-1">
              <label for="" class="text-[12px] text-gray-500"
                >Special Request</label
              >
              <textarea
                name=""
                disabled
                :value="showData?.special_request"
                class="border bg-gray-100 border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                id=""
              ></textarea>
            </div>
            <div class="space-y-1">
              <label for="" class="text-[12px] text-gray-500"
                >Description</label
              >
              <textarea
                name=""
                :value="showData?.comment"
                disabled
                class="border bg-gray-100 border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                id=""
              ></textarea>
            </div>
          </div>
          <div class="flex justify-end items-center gap-x-2 pt-2">
            <button
              @click="backAction"
              class="bg-white border border-gray-300 px-3 py-2.5 rounded-lg text-xs"
            >
              Back
            </button>
            <button
              @click="cancelAction"
              class="bg-white border border-gray-300 px-3 py-2.5 rounded-lg text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
        <!-- view traveller modal -->
        <div v-if="addTravellerModal">
          <div class="h-[450px] overflow-y-scroll py-2 space-y-2 pr-1">
            <div class="grid grid-cols-2 gap-2">
              <div class="col-span-2 pb-2">
                <div class="text-xs font-medium text-black space-y-1">
                  <p>
                    <span
                      class="w-1.5 h-1.5 inline-block bg-black rounded-full mr-2 mb-0.5"
                    ></span
                    >{{ showData?.product_name }}
                  </p>

                  <p class="text-black/60 text-[10px]">
                    <span
                      class="w-1.5 h-1.5 inline-block bg-black rounded-full mr-2 mb-0.5"
                    ></span
                    >{{ showData?.item_name }}
                  </p>
                </div>
              </div>

              <div class="space-y-1">
                <label for="" class="text-[12px] text-gray-500"
                  >Full Name</label
                >
                <input
                  type="text"
                  v-model="editData.name"
                  name=""
                  class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                  id=""
                />
              </div>
              <div class="space-y-1">
                <label for="" class="text-[12px] text-gray-500"
                  >Passport or ID Number</label
                >
                <input
                  type="text"
                  v-model="editData.passport"
                  name=""
                  class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                  id=""
                />
              </div>
              <div class="space-y-1">
                <label for="" class="text-[12px] text-gray-500"
                  >Phone Number</label
                >
                <input
                  type="text"
                  v-model="editData.phone"
                  name=""
                  class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                  id=""
                />
              </div>
              <div class="space-y-1">
                <label for="" class="text-[12px] text-gray-500">Email</label>
                <input
                  type="text"
                  v-model="editData.email"
                  name=""
                  class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                  id=""
                />
              </div>
              <div class="space-y-1 col-span-2">
                <label for="" class="text-[12px] text-gray-500"
                  >Add Passports</label
                >
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
                <div
                  class="cursor-pointer mt-2 w-full h-[80px] border-2 border-dashed border-gray-300 rounded flex justify-center items-center"
                  @click.prevent="openFileFeaturePicker"
                >
                  <span class="text-xs"
                    ><i
                      class="px-2 py-1 text-sm font-semibold text-white bg-[#ff613c] rounded-full shadow fa-solid fa-plus"
                    ></i
                  ></span>
                </div>
              </div>
              <div class="grid grid-cols-3 col-span-2 gap-3 mt-4">
                <div
                  class="relative"
                  v-for="(image, index) in featureImagePreview"
                  :key="index"
                >
                  <button
                    @click.prevent="removeFeatureSelectImage(index)"
                    class="rounded-full text-sm text-red-600 items-center justify-center flex absolute top-[-0.9rem] right-[-0.7rem]"
                  >
                    <XCircleIcon class="w-8 h-8 font-semibold" />
                  </button>

                  <img class="h-auto w-full rounded" :src="image" alt="" />
                </div>
              </div>
              <div class="grid grid-cols-3 col-span-2 gap-3 mt-4">
                <div
                  class="relative"
                  v-for="(image, index) in editData.customer_passport_have"
                  :key="index"
                >
                  <button
                    @click.prevent="removeFeatureDeleteImage(index, image.id)"
                    class="rounded-full text-sm text-red-600 items-center justify-center flex absolute top-[-0.9rem] right-[-0.7rem]"
                  >
                    <XCircleIcon class="w-8 h-8 font-semibold" />
                  </button>
                  <img class="h-auto w-full rounded" :src="image.file" alt="" />
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-end items-center gap-x-2 pt-2">
            <button
              @click="backAction"
              class="bg-white border border-gray-300 px-3 py-2.5 rounded-lg text-xs"
            >
              Back
            </button>
            <button
              @click="closeTravellerModal"
              class="bg-white border border-gray-300 px-3 py-2.5 rounded-lg text-xs"
            >
              Cancel
            </button>
            <button
              @click="addTravellerAction"
              class="bg-[#ff613c] text-white border border-gray-300 px-3 py-2.5 rounded-lg text-xs"
            >
              Add Traveller
            </button>
          </div>
        </div>
      </DialogPanel>
    </Modal>
  </div>
</template>

<style></style>
