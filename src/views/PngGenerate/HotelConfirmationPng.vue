<script setup>
import { useRoute, useRouter } from "vue-router";
import { useReservationStore } from "../../stores/reservation";
import { onMounted, ref, defineProps, watch } from "vue";
import { ArrowLeftCircleIcon } from "@heroicons/vue/24/outline";
import html2canvas from "html2canvas";
import Modal from "../../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/24/solid";
import { forEach } from "jszip";
import Swal from "sweetalert2";
import PassportAddUpdate from "./PassportAddUpdate.vue";
import logo from "../../assets/web-logo.png";
import Layout from "../Layout.vue";

const captureArea = ref(null);
const router = useRouter();
const route = useRoute();
const detail = ref("");
const getLoading = ref(true);
const reservationStore = useReservationStore();

const showFirst = ref(true);

const customer_passport_list = ref([]);
const use_ref = ref(false);
const showFailModal = ref(false);

const generateConfirmationRebuild = () => {
  if (!detail.value?.slip_code) {
    showFailModal.value = true;
  } else {
    showFirst.value = false;
  }

  showFirst.value = false;
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
    link.download = `confirmation-${detail.value.crm_id}.jpeg`; // Name of the saved file
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
    link.download = `confirmation-${detail.value.crm_id}.png`; // Name of the saved file
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
  if (detail.value && detail.value.customer_passports.length > 0) {
    for (let i = 0; i < detail.value.customer_passports.length; i++) {
      customer_passport_list.value.push({
        name: detail.value.customer_passports[i].name,
        passport_number: detail.value.customer_passports[i].passport_number,
        passport: detail.value.customer_passports[i].file,
        dob: detail.value.customer_passports[i].dob,
        id: detail.value.customer_passports[i].id,
        selected: true,
      });
    }

    console.log("====================================");
    console.log(customer_passport_list.value);
    console.log("====================================");
  }
};

const getDetailAction = async (id) => {
  getLoading.value = true;
  const res = await reservationStore.getDetailAction(id);
  detail.value = res.result;
  getLoading.value = false;
};

onMounted(async () => {
  const svgElement = captureArea.value?.querySelector("svg");
  console.log("SVG element after mount:", svgElement);
});

watch(
  () => route.query.id,
  async (newId) => {
    if (newId) {
      getDetailAction(newId);
      console.log(detail.value, "this is get detail value");
    }
  },
  { immediate: true } // This will run the watcher immediately when the component is created
);

watch(
  () => detail.value,
  async (newId) => {
    if (newId) {
      customerListGet();
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
                  {{ detail?.product?.name }}
                </p>
                <p class="w-[217px] text-sm text-gray-700">
                  {{ detail?.product?.official_address }}
                </p>
                <p class="text-sm text-gray-700">
                  Tel: {{ detail?.product?.official_phone_number }} Email:
                  {{ detail?.product?.official_email }}
                </p>
              </div>
              <div>
                <img
                  :src="detail?.product?.official_logo"
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
                detail?.receipt_images
                  ? detail?.receipt_images[0]?.date.split(" ")[0]
                  : ""
              }}
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
                          {{ use_ref ? detail?.crm_id : detail?.slip_code }}
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
                          Check in date:
                        </p>
                      </td>
                      <td class="p-1 border border-black">
                        <p
                          class="block text-sm font-normal pb-3 px-1 leading-normal text-blue-gray-900"
                        >
                          {{ detail?.checkin_date }}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td class="p-1 border border-black">
                        <p
                          class="block text-sm font-normal pb-3 px-1 leading-normal text-blue-gray-900"
                        >
                          Check out date:
                        </p>
                      </td>
                      <td class="p-1 border border-black">
                        <p
                          class="block text-sm font-normal pb-3 px-1 leading-normal text-blue-gray-900"
                        >
                          {{ detail?.checkout_date }}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td class="p-1 border border-black">
                        <p
                          class="block text-sm font-normal pb-3 px-1 leading-normal text-blue-gray-900"
                        >
                          Room type:
                        </p>
                      </td>
                      <td class="p-1 border border-black">
                        <p
                          class="block text-sm font-normal pb-3 px-1 leading-normal text-blue-gray-900"
                        >
                          {{ detail?.room?.name }}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td class="p-1 border border-black">
                        <p
                          class="block text-sm font-normal pb-3 px-1 leading-normal text-blue-gray-900"
                        >
                          Number of room:
                        </p>
                      </td>
                      <td class="p-1 border border-black">
                        <p
                          class="block text-sm font-normal pb-3 px-1 leading-normal text-blue-gray-900"
                        >
                          {{ detail?.quantity }}
                          {{ detail?.quantity > 1 ? "rooms" : "room" }}
                        </p>
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
                          {{ detail?.payment_status }}
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
                            detail?.product?.official_remark != "null"
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
                {{ detail?.product?.check_in }}
              </p>
              <p>
                <span
                  class="w-1.5 h-1.5 bg-black rounded-full inline-block mr-2"
                ></span>
                Check-Out time: Our check-out time is before
                {{ detail?.product?.check_out }}
              </p>
              <p>
                <span
                  class="w-1.5 h-1.5 bg-black rounded-full inline-block mr-2"
                ></span>
                Passport/ID card: Government-issued photo identification (must
                be same person on room reservation) upon check-in.
              </p>
              <p v-if="detail?.product?.cancellation_policy">
                <span
                  class="w-1.5 h-1.5 bg-black rounded-full inline-block mr-2"
                ></span>
                {{ detail?.product?.cancellation_policy }}
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
          class="w-full max-w-6xl transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
        >
          <DialogTitle
            as="div"
            class="text-lg font-medium leading-6 pb-4 text-gray-900 flex justify-between items-center"
          >
            <span class="">Customize confirmation</span>
          </DialogTitle>
          <div>
            <div class="flex justify-between items-start pb-2">
              <p>Customers Infomation</p>
            </div>
            <PassportAddUpdate
              :detail_id="detail?.id"
              :customer_passport_list="customer_passport_list"
              :getDetailAction="getDetailAction"
            />
            <div class="text-end">
              <p
                class="px-4 py-2 text-xs inline-block font-medium text-white bg-[#FF613C] border-none rounded-lg hover:bg-[#FF4A3C] focus:outline-none cursor-pointer"
                @click="generateConfirmationRebuild"
              >
                Hotel Confirmation rebuild
              </p>
            </div>
          </div>
        </DialogPanel>
      </Modal>
      <Modal :isOpen="showFailModal">
        <DialogPanel
          class="w-full max-w-sm transform overflow-hidden rounded-lg mt-10 bg-white text-left align-middle shadow-xl transition-all"
        >
          <DialogTitle
            as="div"
            class="text-sm text-white bg-[#FF613c] font-medium leading-6 flex justify-between items-start pb-20 pt-4 px-4"
          >
            <p></p>
          </DialogTitle>
          <!-- show date  -->
          <div class="relative">
            <div class="absolute -top-8 left-[43%]">
              <img
                :src="logo"
                class="w-16 h-16 bg-white rounded-full p-3"
                alt=""
              />
            </div>
            <div class="py-10 text-center space-y-4">
              <p class="font-medium text-lg text-[#FF613c]">Data Missing !</p>
              <p class="text-xs">
                Hotel booking reference is missing. Would you like to use
                Reservation ID?
              </p>
              <p
                @click="goToFill"
                class="cursor-pointer mr-2 inline-block text-white text-[10px] bg-[#FF613c] px-2 py-2 rounded-lg"
              >
                Use Reservation ID
              </p>
              <!-- <p
                @click="showFailModal = false"
                class="cursor-pointer inline-block text-[#FF613c] border border-[#FF613c] text-[10px] bg-white px-2 py-1 rounded-lg"
              >
                Cancel
              </p> -->
            </div>
          </div>
        </DialogPanel>
      </Modal>
    </div>
  </Layout>
</template>
