<template>
  <Modal :isOpen="openModalArchive" @closeModal="closeArchiveModal">
    <DialogPanel
      class="w-full max-w-3xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all"
    >
      <DialogTitle
        as="div"
        class="text-lg font-medium leading-6 text-gray-900 mb-5 flex justify-between items-center"
      >
        ⚠️ Archive Confirmation
        <button
          type="button"
          class="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          @click="closeArchiveModal"
        >
          <XMarkIcon class="w-6 h-6 text-black cursor-pointer" />
          <span class="sr-only">Close</span>
        </button>
      </DialogTitle>

      <div class="space-y-4">
        <p class="text-sm font-medium">
          Review all items before archiving this invoice
        </p>

        <!-- Items validation section -->
        <div class="max-h-96 overflow-y-auto border rounded-lg p-4">
          <div
            v-if="validationStatus.basic"
            class="flex items-center mb-3 text-sm"
          >
            <CheckCircleIcon class="w-5 h-5 text-green-600 mr-2" />
            <span>Basic information validated successfully</span>
          </div>
          <div v-else class="flex items-center mb-3 text-sm">
            <ExclamationCircleIcon class="w-5 h-5 text-orange-500 mr-2" />
            <span>Validating basic information...</span>
          </div>

          <!-- Items list -->
          <div
            v-for="(item, index) in formData.items"
            :key="index"
            class="mb-4 border-b pb-3"
          >
            <!-- Special handling for items with defined product_type -->
            <div v-if="item.product_type !== undefined">
              <div class="flex justify-between items-center">
                <div class="font-medium">
                  Item #{{ index + 1 }}:
                  {{ getProductTypeName(item.product_type) }}
                </div>
                <div
                  v-if="validationStatus.items[index]"
                  class="flex items-center text-green-600"
                >
                  <CheckCircleIcon class="w-5 h-5 mr-1" />
                  <span class="text-xs">Validated</span>
                </div>
                <div v-else class="flex items-center text-orange-500">
                  <ExclamationCircleIcon class="w-5 h-5 mr-1" />
                  <span class="text-xs">Validation Failed</span>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2 mt-2 text-xs">
                <div class="flex">
                  <span class="font-medium mr-1">Amount:</span>
                  <span>{{ item.total_amount }}</span>
                </div>
                <div class="flex">
                  <span class="font-medium mr-1">Price:</span>
                  <span>{{ item.selling_price }}</span>
                </div>
                <div class="flex">
                  <span class="font-medium mr-1">Service Date:</span>
                  <span>{{ item.service_date || "N/A" }}</span>
                  <ExclamationCircleIcon
                    v-if="
                      !item.service_date && needsServiceDate(item.product_type)
                    "
                    class="w-4 h-4 text-red-500 ml-1"
                  />
                </div>
                <div class="flex" v-if="item.product_type != 4">
                  <span class="font-medium mr-1">Quantity:</span>
                  <span>{{ item.quantity || "N/A" }}</span>
                  <ExclamationCircleIcon
                    v-if="!item.quantity && needsQuantity(item.product_type)"
                    class="w-4 h-4 text-red-500 ml-1"
                  />
                </div>

                <!-- Additional fields for product-specific validation -->
                <div v-if="item.product_type == '1'" class="flex">
                  <span class="font-medium mr-1">Car ID:</span>
                  <span>{{ item.car_id || "N/A" }}</span>
                  <ExclamationCircleIcon
                    v-if="!item.car_id"
                    class="w-4 h-4 text-red-500 ml-1"
                  />
                </div>

                <div v-if="item.product_type == '4'" class="flex">
                  <span class="font-medium mr-1">Variation:</span>
                  <span>{{ item.car_id || "N/A" }}</span>
                  <ExclamationCircleIcon
                    v-if="!item.car_id"
                    class="w-4 h-4 text-red-500 ml-1"
                  />
                </div>

                <div v-if="item.product_type == '6'" class="flex">
                  <span class="font-medium mr-1">Room Type:</span>
                  <span>{{ item.car_id || "N/A" }}</span>
                  <ExclamationCircleIcon
                    v-if="!item.car_id"
                    class="w-4 h-4 text-red-500 ml-1"
                  />
                </div>

                <div v-if="item.product_type == '7'" class="flex">
                  <span class="font-medium mr-1">Ticket Type:</span>
                  <span>{{ item.car_id || "N/A" }}</span>
                  <ExclamationCircleIcon
                    v-if="!item.car_id"
                    class="w-4 h-4 text-red-500 ml-1"
                  />
                </div>

                <!-- Group Tour specific fields -->
                <template v-if="item.product_type == '4'">
                  <div class="flex">
                    <span class="font-medium mr-1">Adults:</span>
                    <span>{{ item.quantity || "0" }}</span>
                  </div>
                  <div class="flex">
                    <span class="font-medium mr-1">Children:</span>
                    <span>{{
                      item.individual_pricing?.child?.quantity || "0"
                    }}</span>
                  </div>
                  <div
                    v-if="
                      !item.quantity &&
                      !item.individual_pricing?.child?.quantity
                    "
                    class="col-span-2 text-red-500 text-xs"
                  >
                    <ExclamationCircleIcon class="w-4 h-4 inline mr-1" />
                    At least one adult or child required
                  </div>
                </template>

                <!-- Hotel specific fields -->
                <template v-if="item.product_type == '6'">
                  <div class="flex">
                    <span class="font-medium mr-1">Check-in:</span>
                    <span>{{ item.checkin_date || "N/A" }}</span>
                    <ExclamationCircleIcon
                      v-if="!item.checkin_date"
                      class="w-4 h-4 text-red-500 ml-1"
                    />
                  </div>
                  <div class="flex">
                    <span class="font-medium mr-1">Check-out:</span>
                    <span>{{ item.checkout_date || "N/A" }}</span>
                    <ExclamationCircleIcon
                      v-if="!item.checkout_date"
                      class="w-4 h-4 text-red-500 ml-1"
                    />
                  </div>
                </template>
              </div>

              <!-- Display validation errors if any -->
              <div
                v-if="!validationStatus.items[index]"
                class="mt-2 text-xs text-red-500"
              >
                <div
                  v-for="(error, errorIndex) in getItemValidationErrors(item)"
                  :key="errorIndex"
                >
                  <ExclamationCircleIcon class="w-4 h-4 inline mr-1" />
                  {{ error }}
                </div>
              </div>
            </div>

            <!-- Special handling for items with undefined product_type -->
            <div v-else class="flex justify-between items-center">
              <div class="font-medium">
                Item #{{ index + 1 }}:
                <span class="text-gray-500">Additional Item</span>
              </div>
              <div class="flex items-center text-blue-500">
                <InformationCircleIcon class="w-5 h-5 mr-1" />
                <span class="text-xs">No Validation Required</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Summary validation section -->
        <div class="border rounded-lg p-4 space-y-2">
          <h3 class="font-medium text-sm">Payment & Totals Validation</h3>

          <div class="grid grid-cols-2 gap-y-2 text-sm">
            <div class="flex items-center">
              <div
                v-if="validationStatus.payment"
                class="bg-green-500 w-3 h-3 mr-2 inline-block rounded-full"
              ></div>
              <div
                v-else
                class="bg-orange-400 w-3 h-3 mr-2 inline-block rounded-full"
              ></div>
              <span
                >Payment ({{
                  formData.payment_method || "Not specified"
                }})</span
              >
            </div>

            <div class="flex items-center">
              <div
                v-if="validationStatus.tax"
                class="bg-green-500 w-3 h-3 mr-2 inline-block rounded-full"
              ></div>
              <div
                v-else
                class="bg-orange-400 w-3 h-3 mr-2 inline-block rounded-full"
              ></div>
              <span>Tax Information</span>
            </div>

            <div class="flex items-center">
              <div
                v-if="validationStatus.discount"
                class="bg-green-500 w-3 h-3 mr-2 inline-block rounded-full"
              ></div>
              <div
                v-else
                class="bg-orange-400 w-3 h-3 mr-2 inline-block rounded-full"
              ></div>
              <span>Discount ({{ sub_total_discount || "0" }})</span>
            </div>

            <div class="flex items-center">
              <div
                v-if="validationStatus.total"
                class="bg-green-500 w-3 h-3 mr-2 inline-block rounded-full"
              ></div>
              <div
                v-else
                class="bg-orange-400 w-3 h-3 mr-2 inline-block rounded-full"
              ></div>
              <span>Total Amount ({{ grand_total_real || "0" }})</span>
            </div>
          </div>
        </div>

        <!-- Progress & Action buttons -->
        <div class="pt-2">
          <div class="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div
              class="bg-green-500 h-2.5 rounded-full"
              :style="{ width: validationProgress + '%' }"
            ></div>
          </div>

          <div class="flex justify-between items-center gap-x-4">
            <button
              type="button"
              :disabled="!isValidationComplete"
              @click="archiveUpdate"
              class="w-full py-2 shadow text-white text-center text-sm rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              :class="
                isValidationComplete
                  ? 'bg-[#ff613c] hover:bg-[#e04e2e]'
                  : 'bg-gray-400'
              "
              :tabindex="isValidationComplete ? 0 : -1"
            >
              Pass Validation
            </button>
            <!-- <button
              type="button"
              @click="normalUpdate"
              class="w-full bg-white py-2 shadow text-[#ff613c] border border-[#ff613c] hover:bg-gray-50 text-center text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              tabindex="0"
            >
              Normal Update
            </button> -->
          </div>
        </div>
      </div>
    </DialogPanel>
  </Modal>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import Modal from "../../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import {
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
} from "@heroicons/vue/24/outline";

const props = defineProps({
  openModalArchive: Boolean,
  formData: Object,
  sub_total_discount: [Number, String],
  grand_total_real: [Number, String],
  sub_total_real: [Number, String],
});

const emit = defineEmits(["closeModal", "archiveUpdate", "normalUpdate"]);

// Validation status tracking
const validationStatus = ref({
  basic: false,
  items: [],
  payment: false,
  tax: false,
  discount: false,
  total: false,
});

// Helper functions to check what fields are needed for validation
const needsServiceDate = (productType) => {
  return ["1", "2", "3", "4", "5", "6", "7"].includes(productType);
};

const needsQuantity = (productType) => {
  return ["1", "2", "3", "4", "5"].includes(productType);
};

const needsCarId = (productType) => {
  return ["1", "2", "3", "5"].includes(productType);
};

// Individual validation functions
const validateBasicInfo = () => {
  // Check if invoice has basic required fields
  validationStatus.value.basic = !!(
    props.formData &&
    props.formData.customer_id &&
    props.formData.payment_method &&
    props.formData.booking_date &&
    props.formData.payment_status &&
    props.formData.items &&
    props.formData.items.length > 0
  );
};

const validateItem = (item, index) => {
  // Automatically mark items with undefined product_type as valid
  if (item.product_type === undefined) {
    validationStatus.value.items[index] = true;
    return true;
  }

  let isValid = true;

  // Base validation for all product types
  if (!item.product_type) {
    isValid = false;
  }

  // Check total_amount (common for all product types)
  if (!item.total_amount) {
    isValid = false;
  }

  // Specific validation based on product type
  switch (item.product_type) {
    case "1": // Private Van Tour
    case "3": // Airport Pickup
      // Check car_id, service_date for these types
      if (!item.car_id || !item.service_date) {
        isValid = false;
      }
      break;

    case "2": // Group Tour
      // Check car_id, service_date
      if (!item.car_id || !item.service_date) {
        isValid = false;
      }
      break;

    case "4": // Entrance Ticket
      if (!item.car_id || !item.service_date) {
        isValid = false;
      }

      // For Entrance Ticket, individual_pricing?.adult?.quantity or individual_pricing?.child?.quantity should exist and be valid
      if (
        (!item.quantity && !item.individual_pricing?.child?.quantity) ||
        (Number(item.quantity) == 0 &&
          Number(item.individual_pricing?.child?.quantity) == 0)
      ) {
        isValid = false;
      }
      break;

    case "5": // Inclusive
      if (!item.service_date) {
        isValid = false;
      }
      break;

    case "6": // Hotel
      if (!item.car_id || !item.checkin_date || !item.checkout_date) {
        isValid = false;
      }
      break;

    case "7": // Airline
      if (!item.car_id || !item.service_date) {
        isValid = false;
      }
      break;

    default:
      // For unknown product types, implement default validation
      if (!item.service_date) {
        isValid = false;
      }
  }

  // Update the validation status for this item
  validationStatus.value.items[index] = isValid;

  // Return validation result
  return isValid;
};

// Function to get validation errors for an item
const getItemValidationErrors = (item) => {
  // No validation errors for items with undefined product_type
  if (item.product_type === undefined) {
    return [];
  }

  const errors = [];

  if (!item.product_type) {
    errors.push("Product type is required");
    return errors;
  }

  // Check total_amount for all product types
  if (!item.total_amount) {
    errors.push("Total amount is required");
  }

  switch (item.product_type) {
    case "1": // Private Van Tour
    case "3": // Airport Pickup
      if (!item.car_id) errors.push("Car ID is required");
      if (!item.service_date) errors.push("Service date is required");
      break;

    case "2": // Group Tour
      if (!item.car_id) errors.push("Car ID is required");
      if (!item.service_date) errors.push("Service date is required");
      if (
        (!item.quantity && !item.individual_pricing?.child?.quantity) ||
        (Number(item.quantity) == 0 &&
          Number(item.individual_pricing?.child?.quantity) == 0)
      ) {
        errors.push("At least one adult or child quantity is required");
      }
      break;

    case "4": // Entrance Ticket
      if (!item.car_id) errors.push("Variation is required");
      if (!item.service_date) errors.push("Service date is required");
      if (
        (!item.quantity && !item.individual_pricing?.child?.quantity) ||
        (Number(item.quantity) == 0 &&
          Number(item.individual_pricing?.child?.quantity) == 0)
      ) {
        errors.push("At least one adult or child quantity is required");
      }
      break;

    case "5": // Inclusive
      if (!item.service_date) errors.push("Service date is required");
      break;

    case "6": // Hotel
      if (!item.car_id) errors.push("Room type is required");
      if (!item.checkin_date) errors.push("Check-in date is required");
      if (!item.checkout_date) errors.push("Check-out date is required");
      break;

    case "7": // Airline
      if (!item.car_id) errors.push("Ticket type is required");
      if (!item.service_date) errors.push("Service date is required");
      break;

    default:
      if (!item.service_date) errors.push("Service date is required");
  }

  return errors;
};

const validatePayment = () => {
  validationStatus.value.payment = !!props.formData.payment_method;
};

const validateTax = () => {
  // Check tax information based on your requirements
  validationStatus.value.tax = true; // For demonstration, modify as needed
};

const validateDiscount = () => {
  validationStatus.value.discount = props.sub_total_discount !== null;
};

const validateTotal = () => {
  validationStatus.value.total = props.grand_total_real && props.sub_total_real;
};

// Run all validations
const runValidation = () => {
  // Reset validation status first
  validationStatus.value.basic = false;
  validationStatus.value.payment = false;
  validationStatus.value.tax = false;
  validationStatus.value.discount = false;
  validationStatus.value.total = false;

  // Ensure validation runs only when formData is available
  if (!props.formData || !props.formData.items) {
    return;
  }

  // Initialize items validation array if needed
  if (validationStatus.value.items.length !== props.formData.items.length) {
    validationStatus.value.items = Array(props.formData.items.length).fill(
      false
    );
  }

  // Simulate validation process with delays for visual effect
  setTimeout(() => {
    validateBasicInfo();

    // Validate each item with sequential delays
    props.formData.items.forEach((item, index) => {
      setTimeout(() => {
        validateItem(item, index);
      }, 300 * (index + 1));
    });

    setTimeout(() => validatePayment(), 500);
    setTimeout(() => validateTax(), 700);
    setTimeout(() => validateDiscount(), 900);
    setTimeout(() => validateTotal(), 1100);
  }, 200);
};

// Helper function to get product type name
const getProductTypeName = (productType) => {
  const types = {
    1: "Private Van Tour",
    2: "Group Tour",
    3: "Airport Pickup",
    4: "Entrance Ticket",
    5: "Inclusive",
    6: "Hotel",
    7: "Airline",
  };
  return types[productType] || "Unknown";
};

// Calculate validation progress
const validationProgress = computed(() => {
  const itemsValidated = validationStatus.value.items.filter(Boolean).length;
  const totalItems = validationStatus.value.items.length;
  const basicChecks = [
    validationStatus.value.basic,
    validationStatus.value.payment,
    validationStatus.value.tax,
    validationStatus.value.discount,
    validationStatus.value.total,
  ].filter(Boolean).length;

  const totalChecks = totalItems + 5; // 5 additional checks
  const completedChecks = itemsValidated + basicChecks;

  return totalChecks > 0
    ? Math.round((completedChecks / totalChecks) * 100)
    : 0;
});

// Check if all validations are complete
const isValidationComplete = computed(() => {
  return (
    validationStatus.value.basic &&
    validationStatus.value.items.every(Boolean) &&
    validationStatus.value.payment &&
    validationStatus.value.tax &&
    validationStatus.value.discount &&
    validationStatus.value.total
  );
});

// Handle actions
const closeArchiveModal = () => {
  emit("closeModal");
};

const archiveUpdate = () => {
  if (isValidationComplete.value) {
    emit("archiveUpdate");
  }
};

const normalUpdate = () => {
  emit("normalUpdate");
};

// Start validation process when modal opens
watch(
  () => props.openModalArchive,
  (isOpen) => {
    if (isOpen) {
      runValidation();
    }
  }
);

// Safely watch for item changes
watch(
  () => props.formData?.items,
  (items) => {
    if (items && items.length > 0) {
      // Make sure items array is initialized with the right length
      if (validationStatus.value.items.length !== items.length) {
        validationStatus.value.items = Array(items.length).fill(false);
      }

      // Only run validation if modal is open
      if (props.openModalArchive) {
        runValidation();
      }
    }
  },
  { deep: true }
);

// Run initial setup after component is mounted
onMounted(() => {
  // Initialize items array if data is available
  if (props.formData?.items?.length > 0) {
    validationStatus.value.items = Array(props.formData.items.length).fill(
      false
    );
  }
});
</script>
