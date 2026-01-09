<template>
  <Modal :isOpen="updateModalOpen" @closeModal="closeModal">
    <DialogPanel
      class="w-full max-w-4xl transform overflow-hidden rounded-xl bg-white/95 backdrop-blur-md text-left align-middle shadow-xl transition-all"
    >
      <DialogTitle
        as="div"
        class="text-sm text-white bg-[#FF613c] font-medium leading-6 flex justify-between items-center py-3 px-4 rounded-t-xl"
      >
        <span class="uppercase">
          {{
            updateData?.relatable_type == "App\\Models\\Booking"
              ? "Booking"
              : updateData?.relatable_type == "App\\Models\\BookingItemGroup"
              ? "Group Expense"
              : "Cash Book"
          }}
        </span>
        <button @click="closeModal" class="text-white hover:text-gray-200">
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </DialogTitle>

      <div class="p-4">
        <!-- Tab Navigation -->
        <div class="flex border-b border-gray-200 mb-4">
          <button
            @click="activeTab = 'update'"
            :class="[
              'px-4 py-2 font-medium text-sm border-b-2 transition-colors',
              activeTab === 'update'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700',
            ]"
          >
            Update Receipt
          </button>
          <button
            @click="activeTab = 'booking'"
            :class="[
              'px-4 py-2 font-medium text-sm border-b-2 transition-colors',
              activeTab === 'booking'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700',
            ]"
          >
            Attach to Booking
          </button>
        </div>

        <!-- Update Tab Content -->
        <div v-if="activeTab === 'update'">
          <ReceiptEdit :updateData="updateData" @update="onChangeUpdate" />
        </div>

        <!-- Booking Attachment Tab Content -->
        <div v-if="activeTab === 'booking'" class="space-y-6">
          <!-- Search and Select Booking -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-lg font-semibold mb-4">Attach to Booking</h3>

              <!-- CRM ID Search -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Search by CRM ID
                </label>
                <div class="relative">
                  <input
                    v-model="searchCrmId"
                    type="text"
                    placeholder="Enter CRM ID..."
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    @click="searchBookings"
                    class="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Booking Selection -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Select Booking
                </label>
                <select
                  v-model="selectedBookingId"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a booking...</option>
                  <option
                    v-for="booking in filteredBookings"
                    :key="booking.id"
                    :value="booking.id"
                  >
                    {{ booking.crm_id }} - {{ booking.customer_name }}
                  </option>
                </select>
              </div>

              <!-- Deposit Amount -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Deposit Amount
                </label>
                <input
                  v-model="depositAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <!-- Notes -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  v-model="notes"
                  rows="3"
                  placeholder="Optional notes..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                ></textarea>
              </div>

              <!-- Attach Button -->
              <button
                @click="attachToBooking"
                :disabled="!selectedBookingId || attachingToBooking"
                class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span
                  v-if="attachingToBooking"
                  class="flex items-center justify-center"
                >
                  <svg
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Attaching...
                </span>
                <span v-else>Attach to Booking</span>
              </button>
            </div>

            <!-- Current Attachments -->
            <div>
              <h3 class="text-lg font-semibold mb-4">Current Attachments</h3>
              <div class="space-y-3 max-h-96 overflow-y-auto">
                <div
                  v-for="attachment in cashImageBookings"
                  :key="attachment.id"
                  class="bg-gray-50 p-3 rounded-md border"
                >
                  <div class="flex justify-between items-start mb-2">
                    <div>
                      <p class="font-medium text-sm">
                        {{ attachment.booking?.crm_id }}
                      </p>
                      <p class="text-xs text-gray-600">
                        {{ attachment.booking?.customer_name }}
                      </p>
                    </div>
                    <button
                      @click="removeAttachment(attachment.id)"
                      class="text-red-500 hover:text-red-700 text-xs"
                    >
                      Remove
                    </button>
                  </div>

                  <div class="text-xs text-gray-500">
                    <p>CRM ID : {{ attachment?.crm_id }}</p>
                    <p v-if="attachment?.deposit">
                      Deposit: {{ formatCurrency(attachment?.deposit) }}
                    </p>
                    <p v-if="attachment.notes">
                      Notes: {{ attachment?.notes }}
                    </p>
                  </div>
                </div>

                <div
                  v-if="cashImageBookings.length === 0"
                  class="text-center text-gray-500 py-8"
                >
                  No bookings attached yet
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DialogPanel>
  </Modal>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useToast } from "vue-toastification";
import { useBookingStore } from "@/stores/booking";
import { useCashImageBookingStore } from "../../stores/cashImageBooking";
import Modal from "../../components/Modal.vue";
import { DialogPanel, DialogTitle } from "@headlessui/vue";
import ReceiptEdit from "../ReceiptEdit.vue";
import debounce from "lodash/debounce";
import Swal from "sweetalert2";

const props = defineProps({
  updateModalOpen: {
    type: Boolean,
    default: false,
  },
  updateData: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["closeModal", "update"]);

const toast = useToast();
const bookingStore = useBookingStore();
const cashImageBookingStore = useCashImageBookingStore();

// Tab management
const activeTab = ref("update");

// Booking search and selection
const searchCrmId = ref("");
const selectedBookingId = ref("");
const depositAmount = ref(0);
const notes = ref("");
const filteredBookings = ref([]);
const attachingToBooking = ref(false);

// Current attachments
const cashImageBookings = ref([]);

// Methods
const closeModal = () => {
  emit("closeModal");
  resetForm();
};

const onChangeUpdate = () => {
  emit("update");
  closeModal();
};

const resetForm = () => {
  searchCrmId.value = "";
  selectedBookingId.value = "";
  depositAmount.value = 0;
  notes.value = "";
  filteredBookings.value = [];
  activeTab.value = "update";
};

const searchBookings = async () => {
  if (!searchCrmId.value.trim()) {
    filteredBookings.value = [];
    return;
  }

  try {
    const response = await bookingStore.getListAction({
      crm_id: searchCrmId.value,
    });
    filteredBookings.value = response.result.data || [];
  } catch (error) {
    console.error("Error searching bookings:", error);
    toast.error("Failed to search bookings");
  }
};

watch(searchCrmId, debounce(searchBookings, 500));

const attachToBooking = async () => {
  if (!selectedBookingId.value || !props.updateData?.id) {
    toast.error("Please select a booking");
    return;
  }

  attachingToBooking.value = true;

  try {
    const payload = {
      cash_image_id: props.updateData.id,
      booking_id: selectedBookingId.value,
      deposit: depositAmount.value || 0,
      notes: notes.value || null,
    };

    await cashImageBookingStore.addNewAction(payload);

    toast.success("Successfully attached to booking");

    // Reset form
    selectedBookingId.value = "";
    depositAmount.value = 0;
    notes.value = "";

    // Refresh attachments
    await loadCashImageBookings();
  } catch (error) {
    console.error("Error attaching to booking:", error);
    if (error.response?.status === 409) {
      toast.error("This cash image is already attached to this booking");
    } else {
      toast.error("Failed to attach to booking");
    }
  } finally {
    attachingToBooking.value = false;
  }
};

const removeAttachment = async (attachmentId) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#2463EB",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await cashImageBookingStore.deleteAction(attachmentId);
        toast.success("Attachment removed successfully");
        await loadCashImageBookings();
      } catch (error) {
        console.error("Error removing attachment:", error);
        toast.error("Failed to remove attachment");
      }
    }
  });
};

const loadCashImageBookings = async () => {
  if (!props.updateData?.id) return;

  try {
    const response = await cashImageBookingStore.getListAction({
      cash_image_id: props.updateData.id,
    });
    cashImageBookings.value = response.result || [];
  } catch (error) {
    console.error("Error loading cash image bookings:", error);
  }
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "THB",
  }).format(amount);
};

// Watch for modal open/close
watch(
  () => props.updateModalOpen,
  (newVal) => {
    if (newVal && props.updateData?.id) {
      loadCashImageBookings();
    }
  }
);

onMounted(() => {
  if (props.updateModalOpen && props.updateData?.id) {
    loadCashImageBookings();
  }
});
</script>

<style scoped>
/* Add any additional styles here */
</style>
