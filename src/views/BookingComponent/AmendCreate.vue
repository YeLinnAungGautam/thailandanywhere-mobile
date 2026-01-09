<template>
  <div class="relative">
    <div class="absolute -top-12 right-0">
      <button
        @click="amendRequestDelete"
        class="bg-red-600 text-white px-4 py-2.5 rounded-lg text-xs"
      >
        Amend Delete Request
      </button>
    </div>
    <div class="grid grid-cols-1 gap-1">
      <div class="space-y-1" v-if="amendData != null">
        <!-- Service Date -->
        <div class="grid grid-cols-9 gap-x-4 py-1 pt-3">
          <div
            class="col-span-4 border border-gray-200 rounded-lg flex justify-between items-center px-4 py-3"
          >
            <label
              class="text-[12px] text-[#FF613c] font-semibold flex justify-start items-center"
              ><CalendarIcon class="w-4 h-4 mr-2" /> Service date
              <span class="text-red-800">*</span></label
            >
            <p class="font-medium text-sm py-1">{{ amendData.service_date }}</p>
          </div>
          <div class="flex justify-center items-center">
            <ArrowRightCircleIcon
              class="w-7 h-7"
              :class="
                amendData.service_date != amendChangesData.service_date
                  ? 'text-red-600'
                  : 'text-gray-400'
              "
            />
          </div>
          <div
            class="col-span-4 border border-gray-200 rounded-lg flex justify-between items-center px-4 py-2"
          >
            <label
              class="text-[12px] text-[#FF613c] font-semibold flex justify-start items-center"
              ><CalendarIcon class="w-4 h-4 mr-2" /> Service date
              <span class="text-red-800">*</span></label
            >
            <input
              type="date"
              v-model="amendChangesData.service_date"
              class="border border-blue-600 w-[150px] px-2 py-2 rounded-lg text-xs focus:outline-none"
            />
          </div>
        </div>

        <!-- Quantity -->
        <div
          class="grid grid-cols-9 gap-x-4 py-1"
          v-if="amendData.product_type != 7 && amendData.product_type != 6"
        >
          <div
            class="col-span-4 border border-gray-200 rounded-lg flex justify-between items-center px-4 py-3"
          >
            <label
              class="text-[12px] text-[#FF613c] font-semibold flex justify-start items-center"
              ><CalculatorIcon class="w-4 h-4 mr-2" />Quantity
              <span class="text-red-800">*</span></label
            >
            <p class="text-sm py-1 font-medium">{{ amendData.quantity }}</p>
          </div>
          <div class="flex justify-center items-center">
            <ArrowRightCircleIcon
              class="w-7 h-7"
              :class="
                amendData.quantity != amendChangesData.quantity
                  ? 'text-red-600'
                  : 'text-gray-400'
              "
            />
          </div>
          <div
            class="col-span-4 border border-gray-200 rounded-lg flex justify-between items-center px-4 py-2"
          >
            <label
              class="text-[12px] text-[#FF613c] font-semibold flex justify-start items-center"
              ><CalculatorIcon class="w-4 h-4 mr-2" />Quantity
              <span class="text-red-800">*</span></label
            >
            <input
              type="number"
              v-model="amendChangesData.quantity"
              class="border border-blue-600 w-[150px] px-2 py-2 rounded-lg text-xs focus:outline-none"
            />
          </div>
        </div>

        <!-- Child Quantity -->
        <div
          class="grid grid-cols-9 gap-x-4 py-2"
          v-for="i in amendData.child_info ?? []"
          :key="i"
        >
          <div
            class="col-span-4 border border-gray-200 rounded-lg flex justify-between items-center px-4 py-3 relative"
          >
            <div class="flex justify-between items-center">
              <label
                class="text-xs text-[#FF613c] relative flex justify-start items-center"
                ><CalculatorIcon class="w-4 h-4 mr-2" /> Qty - selling :
                {{ i.child_price }}<span class="text-red-800">*</span></label
              >
            </div>
            <p class="text-sm py-1 font-medium">
              {{ amendData.individual_pricing.child.quantity }}
            </p>
          </div>
          <div class="flex justify-center items-center">
            <ArrowRightCircleIcon
              class="w-7 h-7"
              :class="
                amendData.individual_pricing.child.quantity !=
                amendChangesData.child_quantity
                  ? 'text-red-600'
                  : 'text-gray-400'
              "
            />
          </div>
          <div
            class="col-span-4 border border-gray-200 rounded-lg flex justify-between items-center px-4 py-2"
          >
            <label
              class="text-xs text-[#FF613c] relative flex justify-start items-center"
              ><CalculatorIcon class="w-4 h-4 mr-2" /> Qty</label
            >
            <input
              type="number"
              v-model="amendChangesData.child_quantity"
              class="border border-blue-600 w-[150px] px-2 py-2 rounded-lg text-xs focus:outline-none"
            />
          </div>
        </div>

        <!-- Hotel Specific Fields -->
        <div v-if="amendData.product_type == 6">
          <!-- Check in date -->
          <div class="grid grid-cols-9 gap-x-4 py-1">
            <div
              class="col-span-4 border border-gray-200 rounded-lg flex justify-between items-center px-4 py-3"
            >
              <label
                class="text-[12px] text-[#FF613c] font-semibold flex justify-start items-center"
                ><CalendarIcon class="w-4 h-4 mr-2" />Check in date
                <span class="text-red-800">*</span></label
              >
              <p class="text-sm py-1 font-medium">
                {{ amendData.service_date }}
              </p>
            </div>
            <div class="flex justify-center items-center">
              <ArrowRightCircleIcon
                class="w-7 h-7"
                :class="
                  amendData.service_date != amendChangesData.service_date
                    ? 'text-red-600'
                    : 'text-gray-400'
                "
              />
            </div>
            <div
              class="col-span-4 border border-gray-200 rounded-lg flex justify-between items-center px-4 py-2"
            >
              <label
                class="text-[12px] text-[#FF613c] font-semibold flex justify-start items-center"
                ><CalendarIcon class="w-4 h-4 mr-2" />Check in date
                <span class="text-red-800">*</span></label
              >
              <input
                type="date"
                v-model="amendChangesData.service_date"
                class="border border-blue-600 w-[150px] px-2 py-2 rounded-lg text-xs focus:outline-none"
              />
            </div>
          </div>

          <!-- Check out date -->
          <div class="grid grid-cols-9 gap-x-4 py-2">
            <div
              class="col-span-4 border border-gray-200 rounded-lg flex justify-between items-center px-4 py-3"
            >
              <label
                class="text-[12px] text-[#FF613c] font-semibold flex justify-start items-center"
                ><CalendarIcon class="w-4 h-4 mr-2" />Check out date
                <span class="text-red-800">*</span></label
              >
              <p class="text-sm py-1 font-medium">
                {{ amendData.checkout_date }}
              </p>
            </div>
            <div class="flex justify-center items-center">
              <ArrowRightCircleIcon
                class="w-7 h-7"
                :class="
                  amendData.checkout_date != amendChangesData.checkout_date
                    ? 'text-red-600'
                    : 'text-gray-400'
                "
              />
            </div>
            <div
              class="col-span-4 border border-gray-200 rounded-lg flex justify-between items-center px-4 py-2"
            >
              <label
                class="text-[12px] text-[#FF613c] font-semibold flex justify-start items-center"
                ><CalendarIcon class="w-4 h-4 mr-2" />Check out date
                <span class="text-red-800">*</span></label
              >
              <input
                type="date"
                v-model="amendChangesData.checkout_date"
                class="border border-blue-600 w-[150px] px-2 py-2 rounded-lg text-xs focus:outline-none"
              />
            </div>
          </div>

          <!-- Total Rooms -->
          <div class="grid grid-cols-9 gap-x-4 py-1">
            <div
              class="col-span-4 border border-gray-200 rounded-lg flex justify-between items-center px-4 py-3"
            >
              <label
                class="text-[12px] text-[#FF613c] font-semibold flex justify-start items-center"
                ><CalculatorIcon class="w-4 h-4 mr-2" />Total Rooms
                <span class="text-red-800">*</span></label
              >
              <p class="text-sm py-1 font-medium">{{ amendData.quantity }}</p>
            </div>
            <div class="flex justify-center items-center">
              <ArrowRightCircleIcon
                class="w-7 h-7"
                :class="
                  amendData.quantity != amendChangesData.quantity
                    ? 'text-red-600'
                    : 'text-gray-400'
                "
              />
            </div>
            <div
              class="col-span-4 border border-gray-200 rounded-lg flex justify-between items-center px-4 py-2"
            >
              <label
                class="text-[12px] text-[#FF613c] font-semibold flex justify-start items-center"
                ><CalculatorIcon class="w-4 h-4 mr-2" />Total Rooms
                <span class="text-red-800">*</span></label
              >
              <input
                type="number"
                v-model="amendChangesData.quantity"
                class="border border-blue-600 w-[150px] px-2 py-2 rounded-lg text-xs focus:outline-none"
              />
            </div>
          </div>

          <!-- Duration -->
          <div class="grid grid-cols-9 gap-x-4 py-2">
            <div
              class="col-span-4 border border-gray-200 rounded-lg flex justify-between items-center px-4 py-3"
            >
              <label
                class="text-[12px] text-[#FF613c] font-semibold flex justify-start items-center"
                ><ClockIcon class="w-4 h-4 mr-2" />Duration
                <span class="text-red-800">*</span></label
              >
              <p class="text-sm py-1 font-medium">
                {{ amendData.days }} Night x {{ amendData.quantity }} Rooms
              </p>
            </div>
            <div class="flex justify-center items-center">
              <ArrowRightCircleIcon class="w-7 h-7" />
            </div>
            <div
              class="col-span-4 border border-gray-200 rounded-lg w-full flex justify-between items-center px-4 py-2"
            >
              <label
                class="text-[12px] text-[#FF613c] font-semibold flex justify-start items-center"
                ><ClockIcon class="w-4 h-4 mr-2" />Duration
                <span class="text-red-800">*</span></label
              >
              <p class="bg-gray-300 w-[150px] px-2 py-2 rounded-lg text-xs">
                {{
                  daysBetween(
                    amendChangesData.service_date,
                    amendChangesData.checkout_date
                  )
                }}
                Night x {{ amendChangesData.quantity }} Rooms
              </p>
            </div>
          </div>
        </div>

        <!-- Variation Selection -->
        <div
          class="grid grid-cols-9 gap-x-4 py-1"
          v-if="amendData.car_list && amendData.car_list.length > 0"
        >
          <div
            class="col-span-4 border border-gray-200 rounded-lg flex justify-between items-center px-4 py-3"
          >
            <label
              class="text-[12px] text-[#FF613c] font-semibold flex justify-start items-center"
              ><ArrowPathIcon class="w-4 h-4 mr-2" />Variation
              <span class="text-red-800">*</span></label
            >
            <p class="text-sm py-1 font-medium text-end">
              {{ amendData.item_name }}
            </p>
          </div>
          <div class="flex justify-center items-center">
            <ArrowRightCircleIcon
              class="w-7 h-7"
              :class="
                amendData.car_id != amendChangesData.variation_id
                  ? 'text-red-600'
                  : 'text-gray-400'
              "
            />
          </div>
          <div
            class="col-span-4 border border-gray-200 rounded-lg flex justify-between items-center px-4 py-2"
          >
            <select
              v-model="amendChangesData.variation_id"
              class="border border-blue-600 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
              @change="onVariationChange"
            >
              <option
                v-for="car in amendData.car_list"
                :key="car.id"
                :value="car.id"
              >
                {{ car.name }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-end items-center gap-x-2 pt-4">
      <button
        @click="amendRequestCreate"
        class="bg-[#ff613c] text-white border border-[#FF613c] px-4 py-2.5 rounded-lg text-xs"
      >
        Amend Request Create
      </button>

      <button
        @click="amendCloseAction"
        class="bg-white text-[#FF613c] border border-[#FF613c] px-4 py-2.5 rounded-lg text-xs"
      >
        Cancel
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { daysBetween } from "../help/DateBetween";
import Swal from "sweetalert2";
import { useAmendStore } from "../../stores/amend";
// import { useToast } from "vue-toastification";
import {
  ArrowPathIcon,
  ArrowRightCircleIcon,
  CalculatorIcon,
  CalendarIcon,
  ClockIcon,
} from "@heroicons/vue/24/outline";

const amendStore = useAmendStore();
const toast = useToast();

const props = defineProps({
  amendData: {
    type: Object,
    default: null,
  },
  amendCloseAction: {
    type: Function,
    default: () => {},
  },
});
const emit = defineEmits(["amendCloseAction"]);

const amendChangesData = ref({
  variation_id: null,
  current_variation_id: null,
  variation_name: null,
  current_variation_name: null,
  service_date: null,
  current_service_date: null,
  quantity: null,
  current_quantity: null,
  child_quantity: null,
  current_child_quantity: null,
  checkout_date: null,
  current_checkout_date: null,
});

const onVariationChange = () => {
  // Find the selected variation's name
  if (props.amendData && props.amendData.car_list) {
    const selectedCar = props.amendData.car_list.find(
      (car) => car.id === amendChangesData.value.variation_id
    );
    if (selectedCar) {
      amendChangesData.value.variation_name = selectedCar.name;
    }
  }
};

const amendHistoryData = computed(() => {
  let changes = [];

  // Check for variation change
  if (
    amendChangesData.value.variation_id !== null &&
    amendChangesData.value.variation_id !==
      amendChangesData.value.current_variation_id
  ) {
    changes.push(
      `Variation: <span class="old-value">${
        amendChangesData.value.current_variation_name || "N/A"
      }</span> → <span class="new-value">${
        amendChangesData.value.variation_name || "N/A"
      }</span>`
    );
  }

  // Check for service date change
  if (
    amendChangesData.value.service_date !== null &&
    amendChangesData.value.service_date !==
      amendChangesData.value.current_service_date
  ) {
    changes.push(
      `Service date: <span class="old-value">${
        amendChangesData.value.current_service_date || "N/A"
      }</span> → <span class="new-value">${
        amendChangesData.value.service_date || "N/A"
      }</span>`
    );
  }

  // Check for quantity change
  if (
    amendChangesData.value.quantity !== null &&
    amendChangesData.value.quantity !== amendChangesData.value.current_quantity
  ) {
    changes.push(
      `Quantity: <span class="old-value">${
        amendChangesData.value.current_quantity || "N/A"
      }</span> → <span class="new-value">${
        amendChangesData.value.quantity || "N/A"
      }</span>`
    );
  }

  // Check for child quantity change
  if (
    amendChangesData.value.child_quantity !== null &&
    amendChangesData.value.child_quantity !==
      amendChangesData.value.current_child_quantity
  ) {
    changes.push(
      `Child quantity: <span class="old-value">${
        amendChangesData.value.current_child_quantity || "N/A"
      }</span> → <span class="new-value">${
        amendChangesData.value.child_quantity || "N/A"
      }</span>`
    );
  }

  // Check for checkout date change
  if (
    amendChangesData.value.checkout_date !== null &&
    amendChangesData.value.checkout_date !==
      amendChangesData.value.current_checkout_date
  ) {
    changes.push(
      `Checkout date: <span class="old-value">${
        amendChangesData.value.current_checkout_date || "N/A"
      }</span> → <span class="new-value">${
        amendChangesData.value.checkout_date || "N/A"
      }</span>`
    );
  }

  if (changes.length === 0) {
    return "";
  }

  // Convert array of changes to an HTML list with Poppins font styling
  return `
    <ul style="font-family: 'Poppins', sans-serif; text-align: left; list-style-type: none; padding-left: 0;">
      ${changes
        .map(
          (
            change
          ) => `<li style="margin-bottom: 8px; padding-left: 20px; position: relative;">
        <span style="position: absolute; left: 0; top: 2px; color: #FF613C;">•</span>
        ${change}
      </li>`
        )
        .join("")}
    </ul>
    <style>
      .old-value { color: #D1D5DB; text-decoration: line-through; }
      .new-value { color: #FF613C; font-weight: 500; }
    </style>
  `;
});

const amendRequestCreate = () => {
  // Check if any changes were actually made
  const changesHTML = amendHistoryData.value;

  if (!changesHTML) {
    Swal.fire({
      title: "No changes detected",
      text: "Please make some changes before submitting an amendment request.",
      icon: "info",
    });
    return;
  }

  Swal.fire({
    title: "Are you sure?",
    html: `
      <div style="font-family: 'Poppins', sans-serif;">
        <p style="margin-bottom: 12px;">Do you want to apply these changes?</p>
        ${changesHTML}
      </div>
    `,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#2463EB",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, create it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        let changes = {};

        if (amendChangesData.value.variation_id) {
          changes.variation_id = amendChangesData.value.variation_id;
        }
        if (amendChangesData.value.current_variation_id) {
          changes.current_variation_id =
            amendChangesData.value.current_variation_id;
        }
        if (amendChangesData.value.variation_name) {
          changes.variation_name = amendChangesData.value.variation_name;
        }
        if (amendChangesData.value.current_variation_name) {
          changes.current_variation_name =
            amendChangesData.value.current_variation_name;
        }
        if (amendChangesData.value.service_date) {
          changes.service_date = amendChangesData.value.service_date;
        }
        if (amendChangesData.value.current_service_date) {
          changes.current_service_date =
            amendChangesData.value.current_service_date;
        }
        if (amendChangesData.value.quantity) {
          changes.quantity = amendChangesData.value.quantity;
        }
        if (amendChangesData.value.current_quantity) {
          changes.current_quantity = amendChangesData.value.current_quantity;
        }
        if (amendChangesData.value.child_quantity) {
          changes.child_quantity = amendChangesData.value.child_quantity;
        }
        if (amendChangesData.value.current_child_quantity) {
          changes.current_child_quantity =
            amendChangesData.value.current_child_quantity;
        }
        if (amendChangesData.value.checkout_date) {
          changes.checkout_date = amendChangesData.value.checkout_date;
        }
        if (amendChangesData.value.current_checkout_date) {
          changes.current_checkout_date =
            amendChangesData.value.current_checkout_date;
        }

        const frmData = new FormData();
        frmData.append("booking_item_id", props.amendData.reservation_id);
        frmData.append("changes", JSON.stringify(changes));

        const res = await amendStore.addNewAction(frmData);
        if (res.status == 1) {
          toast.success("Amend request created successfully.");
          props.amendCloseAction();
        } else {
          toast.error("Failed to create amend request.");
        }
      } catch (error) {
        console.error("Error creating amend request:", error);
        toast.error("An error occurred while creating the amend request.");
      }
    }
  });
};

const amendRequestDelete = () => {
  Swal.fire({
    title: "Are you sure?",
    html: `
      <div style="font-family: 'Poppins', sans-serif;">
        <p style="margin-bottom: 12px;">Do you wanna remove this reservation?</p>
        <p style="margin-bottom: 12px;">Please confirm to proceed.</p>
      </div>
    `,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#2463EB",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, create it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        let changes = {};
        changes.delete = true;

        const frmData = new FormData();
        frmData.append("booking_item_id", props.amendData.reservation_id);
        frmData.append("changes", JSON.stringify(changes));

        const res = await amendStore.addNewAction(frmData);
        if (res.status == 1) {
          toast.success("Amend request created successfully.");
          props.amendCloseAction();
        } else {
          toast.error("Failed to create amend request.");
        }
      } catch (error) {
        console.error("Error creating amend request:", error);
        toast.error("An error occurred while creating the amend request.");
      }
    }
  });
};

// Add a watch on props.amendData to set current values
watch(
  () => props.amendData,
  (newData) => {
    if (newData) {
      amendChangesData.value.current_variation_id = newData.car_id;
      amendChangesData.value.current_variation_name = newData.item_name;
      amendChangesData.value.current_service_date = newData.service_date;
      amendChangesData.value.current_quantity = newData.quantity;
      amendChangesData.value.current_child_quantity =
        newData.individual_pricing?.child?.quantity || 0;
      amendChangesData.value.current_checkout_date = newData.checkout_date;

      // Set initial values for the form fields
      amendChangesData.value.service_date = newData.service_date;
      amendChangesData.value.quantity = newData.quantity;
      amendChangesData.value.child_quantity =
        newData.individual_pricing?.child?.quantity || 0;
      amendChangesData.value.checkout_date = newData.checkout_date;
      amendChangesData.value.variation_id = newData.car_id;
      amendChangesData.value.variation_name = newData.item_name;
    }
  },
  { immediate: true }
);

onMounted(() => {
  console.log("Amend Data: ", props.amendData);
});
</script>
