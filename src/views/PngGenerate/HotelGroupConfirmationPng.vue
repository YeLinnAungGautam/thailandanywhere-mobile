<script setup>
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref, defineProps, watch } from "vue";
import {
  ArrowLeftCircleIcon,
  ArrowPathIcon,
  PlusCircleIcon,
  XCircleIcon,
} from "@heroicons/vue/24/outline";
import html2canvas from "html2canvas";
import Modal from "../../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/24/solid";
import { forEach } from "jszip";
import Swal from "sweetalert2";
import PassportAddUpdate from "./PassportAddUpdate.vue";
import Layout from "../Layout.vue";
import { useGroupByStore } from "../../stores/groupby";

const captureArea = ref(null);
const router = useRouter();
const route = useRoute();
const detail = ref("");
const getLoading = ref(true);
const groupbyStore = useGroupByStore();

const showFirst = ref(true);

const reload = () => {
  router.push(
    `/reservation-hotel?id=${route.query.id}&product_id=${route.query.product_id}&part=passport`
  );
};

const customer_passport_list = ref([]);
const item_list = ref([]);
const use_ref = ref(false);
const showFailModal = ref(false);
const showListModal = ref(false);

const generateConfirmationRebuild = () => {
  if (!detail.value?.booking?.items[0].slip_code) {
    showFailModal.value = true;
  } else {
    showListModal.value = false;
  }

  showListModal.value = false;
};

const nextCustomize = () => {
  showFirst.value = false;
  showListModal.value = true;
};

const saveAsJpeg = async () => {
  if (!captureArea.value) {
    console.error("Capture area not found!");
    return;
  }

  try {
    const canvas = await html2canvas(captureArea.value, {
      backgroundColor: "#fff", // Ensure a white background for the image
      useCORS: true,
      allowTaint: true,
    });

    const link = document.createElement("a");
    link.download = `confirmation-${detail.value.booking.crm_id}.jpeg`; // Name of the saved file
    link.href = canvas.toDataURL("image/jpeg");
    link.click();
  } catch (error) {
    console.error("Error capturing the view:", error);
  }
};

const saveAsPng = async () => {
  if (!captureArea.value) {
    console.error("Capture area not found!");
    return;
  }

  try {
    const canvas = await html2canvas(captureArea.value, {
      backgroundColor: "#fff", // Ensure a white background for the image
      useCORS: true,
      allowTaint: true,
    });

    const link = document.createElement("a");
    link.download = `confirmation-${detail.value.booking.crm_id}.png`; // Name of the saved file
    link.href = canvas.toDataURL("image/png");
    link.click();
  } catch (error) {
    console.error("Error capturing the view:", error);
  }
};

const goToFill = () => {
  use_ref.value = true;
  showFailModal.value = false;
  showFirst.value = false;
};

const customerListGet = () => {
  customer_passport_list.value = [];

  // Check if details and booking items exist
  if (detail.value && detail.value.booking.items.length > 0) {
    const uniquePassports = new Map();

    // Loop through all booking items
    detail.value.booking.items.forEach((item) => {
      // Check if the item has customer_passports
      if (item.customer_passports && item.customer_passports.length > 0) {
        // Process each passport in the current item
        item.customer_passports.forEach((passport) => {
          if (!uniquePassports.has(passport.passport_number)) {
            uniquePassports.set(passport.passport_number, {
              id: passport.id,
              reservation_id: item.id,
              name: passport.name,
              passport_number: passport.passport_number,
              passport: passport.file,
              dob: passport.dob,
              id: passport.id,
              selected: true,
            });
          }
        });
      }
    });

    // Convert map values to array
    customer_passport_list.value = Array.from(uniquePassports.values());

    console.log("====================================");
    console.log(customer_passport_list.value);
    console.log("====================================");
  }
};

function changeFormat(checkinDate, checkoutDate) {
  try {
    // Parse the input dates
    const checkin = new Date(checkinDate);
    const checkout = new Date(checkoutDate);

    // Format options
    const dayOptions = { day: "numeric" };
    const monthOptions = { month: "short" };
    const weekdayOptions = { weekday: "short" };

    // Get day, month, and weekday for both dates
    const checkinDay = checkin.toLocaleDateString("en-US", dayOptions);
    const checkinMonth = checkin.toLocaleDateString("en-US", monthOptions);

    const checkoutDay = checkout.toLocaleDateString("en-US", dayOptions);
    const checkoutMonth = checkout.toLocaleDateString("en-US", monthOptions);

    // Get year (last 2 digits) from checkout date
    const year = checkout.getFullYear().toString().slice(-2);

    // If same month, only show month once

    return `${checkinDay} ${checkinMonth} - ${checkoutDay} ${checkoutMonth} ${year}`;
  } catch (error) {
    console.error("Error formatting dates:", error);
    return "Invalid date format";
  }
}

const roomListGet = () => {
  item_list.value = [];
  if (detail.value && detail.value.booking.items.length > 0) {
    for (let i = 0; i < detail.value.booking.items?.length; i++) {
      item_list.value.push({
        name: detail.value.booking.items[i]?.room?.name,
        id: detail.value.booking.items[i].id,
        checkin_date: detail.value.booking.items[i].checkin_date,
        checkout_date: detail.value.booking.items[i].checkout_date,
        quantity: detail.value.booking.items[i].quantity,
        selected: true,
      });
    }

    console.log("====================================");
    console.log(item_list.value);
    console.log("====================================");
  }
};

const getDetailAction = async (id, product_id) => {
  getLoading.value = true;
  detail.value = null;
  const res = await groupbyStore.ReservationHotelDetailAction(id, product_id);
  detail.value = res;
  console.log("Detail value:", res);
  customerListGet();
  roomListGet();
  getLoading.value = false;
};

onMounted(async () => {
  const svgElement = captureArea.value?.querySelector("svg");
  console.log("SVG element after mount:", svgElement);
});

watch(
  () => [route.query.id, route.query.product_id],
  async ([newId, newProductId]) => {
    if (newId || newProductId) {
      // hasRouteId.value = false;
      getDetailAction(newId, newProductId);
      // console.log(detail.value, "this is get detail value");
    }
  },
  { immediate: true } // This will run the watcher immediately when the component is created
);
</script>

<template>
  <Layout>
    <div class="">
      <div class="flex justify-end items-center pb-5 px-10">
        <div class="flex justify-center items-center gap-x-3">
          <button
            @click="saveAsJpeg()"
            class="py-2 px-4 mt-4 rounded-lg text-white bg-[#FF613c] hover:bg-[#ff613c]/70 text-xs font-medium"
          >
            Save as JPEG
          </button>
          <button
            @click="saveAsPng()"
            class="py-2 px-4 mt-4 rounded-lg text-white bg-[#FF613c] hover:bg-[#ff613c]/70 text-xs font-medium"
          >
            Save as PNG
          </button>
          <button
            @click="showFirst = !showFirst"
            class="py-2 px-4 mt-4 rounded-lg text-white bg-[#FF613c] hover:bg-[#ff613c]/70 text-xs font-medium"
          >
            Customize
          </button>
        </div>
      </div>

      <div class="mx-auto">
        <div
          class="w-[794px] h-[1123px] p-12 mx-auto bg-white shadow"
          ref="captureArea"
        >
          <p class="w-full h-3 bg-black"></p>
          <div class="p-6">
            <div class="flex justify-between items-start">
              <div class="space-y-2">
                <p class="text-lg font-medium text-black">
                  {{ detail?.booking?.items[0]?.product?.name }}
                </p>
                <p class="w-[217px] text-sm text-gray-700">
                  {{ detail?.booking?.items[0]?.product?.official_address }}
                </p>
                <p class="text-sm text-gray-700">
                  Tel:
                  {{
                    detail?.booking?.items[0]?.product?.official_phone_number
                  }}
                  Email:
                  {{ detail?.booking?.items[0]?.product?.official_email }}
                </p>
              </div>
              <div>
                <img
                  :src="detail?.booking?.items[0]?.product?.official_logo"
                  class="w-[100px]"
                  alt=""
                />
              </div>
            </div>
            <p class="text-xl text-black pt-2 pb-2 font-bold">
              Hotel Confirmation Letter
            </p>
            <p class="font-semibold text-red-500 pb-5">
              Submitted on
              {{
                detail?.booking?.items[0]?.receipt_images?.[0]?.date
                  ? detail?.booking?.items[0]?.receipt_images[0].date.split(
                      " "
                    )[0]
                  : new Date().toLocaleDateString("en-GB")
              }}
              ; Agent TH ANYWHERE CO.,LTD.
            </p>
            <div class="">
              <div class="relative flex flex-col w-full h-full">
                <table class="w-full text-left">
                  <thead>
                    <tr>
                      <th class="p-1 border border-black">
                        <p class="block whitespace-nowrap pb-3 px-1 w-2/5">
                          Hotel Confirmation
                        </p>
                      </th>
                      <th class="p-1 border border-black w-3/5">
                        <p class="block pb-3 px-1">
                          {{
                            use_ref
                              ? detail?.booking?.crm_id
                              : detail?.booking?.items[0]?.slip_code
                          }}
                        </p>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="p-1 border border-black">
                        <p
                          class="block text-sm pb-3 px-1 font-normal leading-normal text-blue-gray-900"
                        >
                          Guest name:
                        </p>
                      </td>
                      <td class="p-1 border border-black">
                        <div
                          class="block text-sm font-normal pb-3 px-1 leading-normal text-blue-gray-900"
                        >
                          <p
                            v-for="(i, index) in customer_passport_list"
                            :key="index"
                            :class="i.selected == true ? '' : 'hidden'"
                          >
                            {{ index + 1 }}. {{ i.name }}
                            <span v-if="i?.passport_number != '-'"
                              >({{ i.passport_number }})</span
                            >
                          </p>
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td class="p-1 border border-black">
                        <p
                          class="block text-sm font-normal pb-3 px-1 leading-normal text-blue-gray-900"
                        >
                          Room type<span class="text-xs"> (in - out)</span>:
                        </p>
                      </td>
                      <td class="p-1 border border-black">
                        <div
                          class="block text-sm font-normal felx pb-3 px-1 leading-normal text-blue-gray-900"
                        >
                          <p
                            v-for="(i, index) in item_list"
                            :key="index"
                            class="flex justify-start items-end"
                            :class="i.selected == true ? '' : 'hidden'"
                          >
                            <span
                              class="w-1 h-1 flex mr-2 justify-end items-end bg-black rounded-full"
                            ></span
                            >{{ i.quantity }} x {{ i.name }}(
                            {{ changeFormat(i.checkin_date, i.checkout_date) }}
                            )
                          </p>
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td class="p-1 border border-black">
                        <p
                          class="block text-sm font-normal pb-3 px-1 leading-normal text-blue-gray-900"
                        >
                          Payment detail:
                        </p>
                      </td>
                      <td class="p-1 border border-black">
                        <p
                          class="block text-sm font-normal pb-3 px-1 leading-normal text-blue-gray-900"
                        >
                          {{ detail?.booking?.payment_status }}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td class="p-1 border border-black">
                        <p
                          class="block text-sm font-normal pb-3 px-1 leading-normal text-blue-gray-900"
                        >
                          Remark:
                        </p>
                      </td>
                      <td class="p-1 border border-black w-full">
                        <p
                          class="block text-sm font-normal pb-3 px-1 leading-normal text-blue-gray-900"
                        >
                          {{
                            detail?.booking?.items[0]?.product
                              ?.official_remark != "null"
                              ? detail.product?.official_remark
                              : ""
                          }}
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="space-y-2 text-sm py-3">
              <p>We are pleased to inform you as following:</p>
              <p>
                <span
                  class="w-1.5 h-1.5 bg-black rounded-full inline-block mr-2"
                ></span>
                Check-In time: Our check-in time is from
                {{ detail?.booking?.items[0]?.product?.check_in }}
              </p>
              <p>
                <span
                  class="w-1.5 h-1.5 bg-black rounded-full inline-block mr-2"
                ></span>
                Check-Out time: Our check-out time is before
                {{ detail?.booking?.items[0]?.product?.check_out }}
              </p>
              <p>
                <span
                  class="w-1.5 h-1.5 bg-black rounded-full inline-block mr-2"
                ></span>
                Passport/ID card: Government-issued photo identification (must
                be same person on room reservation) upon check-in.
              </p>
              <p v-if="detail?.booking?.items[0]?.product?.cancellation_policy">
                <span
                  class="w-1.5 h-1.5 bg-black rounded-full inline-block mr-2"
                ></span>
                {{ detail?.booking?.items[0]?.product?.cancellation_policy }}
              </p>
              <p>We look forward to welcoming you soon.</p>
              <p>
                Should there be any further assistance or more information you
                require, please do not hesitate to contact
              </p>
            </div>

            <p class="text-sm">Yours faithfully,</p>
            <p class="text-sm font-semibold pt-2 italic">Reservation Teams.</p>
          </div>
        </div>
      </div>
      <Modal :isOpen="showFirst">
        <DialogPanel
          class="w-full max-w-6xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all"
        >
          <DialogTitle
            as="div"
            class="font-medium bg-[#FF613C] leading-6 px-4 py-4 text-white flex justify-between items-center"
          >
            <span class="text-lg pl-6"
              >Step 1: ဖော်ပြလိုသော Passport များအမှန်ခြစ်ပြီး ရွေးချယ်ပါ။</span
            >
            <div
              class="flex justify-end items-center gap-x-3 cursor-pointer"
              @click="reload"
            >
              <PlusCircleIcon class="w-5 h-5 text-white" />Add Passport
            </div>
          </DialogTitle>
          <div class="p-10">
            <!-- <div class="flex justify-between items-start pb-2">
              <p class="text-sm pb-2">Customers Infomation</p>
            </div> -->
            <PassportAddUpdate
              :detail_id="item_list"
              :customer_passport_list="customer_passport_list"
              :getDetailAction="getDetailAction"
            />
            <div class="text-end space-x-4 pt-4">
              <p
                class="px-4 py-2 inline-block font-medium text-[#FF613C] bg-white border border-[#FF613c] rounded-lg focus:outline-none cursor-pointer"
                @click="showFirst = false"
              >
                Cancel
              </p>
              <p
                class="px-4 py-2 inline-block font-medium text-white bg-[#FF613C] border-none rounded-lg hover:bg-[#FF4A3C] focus:outline-none cursor-pointer"
                @click="nextCustomize"
              >
                Next: Step 2
              </p>
            </div>
          </div>
        </DialogPanel>
      </Modal>
      <Modal :isOpen="showListModal">
        <DialogPanel
          class="w-full max-w-6xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all"
        >
          <DialogTitle
            as="div"
            class="font-medium bg-[#FF613C] leading-6 px-4 py-4 text-white flex justify-between items-center"
          >
            <span class="text-lg pl-5"
              >Step 2: ဖော်ပြလိုသော Room များအမှန်ခြစ်ပြီး ရွေးချယ်ပါ။</span
            >
          </DialogTitle>
          <div class="p-8">
            <div v-for="(i, index) in item_list" :key="index" class="">
              <div
                class="flex justify-between px-5 items-center py-2 border-b border-gray-200"
              >
                <p class="">
                  <input
                    type="checkbox"
                    name=""
                    class="w-6 h-6"
                    v-model="i.selected"
                    id=""
                  />
                </p>
                <p class="w-[500px]">{{ i.name }}</p>
                <p>{{ i.checkin_date }}</p>
                <p>{{ i.checkout_date }}</p>
                <p>{{ i.quantity }}</p>
              </div>
            </div>
            <div class="text-end pt-8 space-x-4">
              <p
                class="px-4 py-2 inline-block font-medium text-[#FF613C] bg-white border border-[#FF613c] rounded-lg focus:outline-none cursor-pointer"
                @click="
                  () => {
                    showListModal = false;
                    showFirst = true;
                  }
                "
              >
                Back
              </p>
              <p
                class="px-4 py-2 inline-block font-medium text-white bg-[#FF613C] border-none rounded-lg hover:bg-[#FF4A3C] focus:outline-none cursor-pointer"
                @click="generateConfirmationRebuild"
              >
                Next: Step 3
              </p>
            </div>
          </div>
        </DialogPanel>
      </Modal>
      <Modal :isOpen="showFailModal">
        <DialogPanel
          class="w-full max-w-6xl transform overflow-hidden rounded-lg mt-10 bg-white text-left align-middle shadow-xl transition-all"
        >
          <DialogTitle
            as="div"
            class="font-medium bg-[#FF613C] leading-6 px-4 py-4 text-white flex justify-between items-center"
          >
            <span class="text-lg pl-5"
              >Step 3: Refference No. ရွေးချယ်ခြင်း</span
            >
          </DialogTitle>
          <!-- show date  -->
          <div class="relative">
            <div class="py-10 text-center space-y-4">
              <p class="font-medium text-lg text-[#FF613c]">
                Booking ၏ Reference No. မရှိနေပါ။
              </p>
              <p class="text-base">
                Hotel Booking ၏ Reference No. မရှိနေသောကြောင့် CRM Id ကို
                အသုံးပြုလိုပါသလား။
              </p>
              <p
                @click="goToFill"
                class="px-4 py-2 inline-block font-medium text-white bg-[#FF613C] border-none rounded-lg hover:bg-[#FF4A3C] focus:outline-none cursor-pointer"
              >
                အသုံးပြုပါမည် : {{ detail?.booking?.crm_id }}
              </p>
              <p
                @click="showFailModal = false"
                class="px-4 py-2 ml-4 inline-block font-medium text-[#FF613C] bg-white border border-[#FF613c] rounded-lg focus:outline-none cursor-pointer"
              >
                Cancel
              </p>
            </div>
          </div>
        </DialogPanel>
      </Modal>
    </div>
  </Layout>
</template>
