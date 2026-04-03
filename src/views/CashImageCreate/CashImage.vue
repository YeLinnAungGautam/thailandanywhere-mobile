<template>
  <div class="p-3 relative">
    <!-- Loading Overlay -->
    <div
      v-if="isExtractingData"
      class="absolute inset-0 bg-white/80 flex items-center justify-center z-10"
    >
      <div class="text-center">
        <i class="fa-solid fa-spinner fa-spin text-4xl text-[#ff613c] mb-2"></i>
        <p class="text-sm font-medium">Extracting data from image...</p>
      </div>
    </div>
    <!-- Step 1: Choose Transfer Type -->
    <div v-if="step === 1" class="max-w-2xl mx-auto">
      <div class="grid grid-cols-2 gap-3 mt-3">
        <!-- @click="selectTransferType('internal')" -->
        <div
          class="cursor-pointer p-4 border-2 rounded-lg opacity-20 hover:border-[#ff613c] hover:shadow-lg transition-all"
          :class="
            transferType === 'internal'
              ? 'border-[#ff613c] bg-orange-50'
              : 'border-gray-300'
          "
        >
          <div class="text-center">
            <i
              class="fa-solid fa-exchange-alt text-3xl text-[#ff613c] mb-2"
            ></i>
            <h3 class="font-semibold text-sm mb-1">Internal Transfer</h3>
            <p class="text-xs text-gray-600">
              Currency exchange between accounts
            </p>
          </div>
        </div>

        <div
          @click="selectTransferType('direct')"
          class="cursor-pointer p-4 border-2 rounded-lg hover:border-[#ff613c] hover:shadow-lg transition-all"
          :class="
            transferType === 'direct'
              ? 'border-[#ff613c] bg-orange-50'
              : 'border-gray-300'
          "
        >
          <div class="text-center">
            <i class="fa-solid fa-university text-3xl text-[#ff613c] mb-2"></i>
            <h3 class="font-semibold text-sm mb-1">Direct Banking</h3>
            <p class="text-xs text-gray-600">Regular bank transaction</p>
          </div>
        </div>
      </div>

      <div class="flex justify-end mt-6 mb-3">
        <button
          @click="goToNextStep"
          :disabled="!transferType"
          class="px-4 py-3 w-full text-sm bg-[#ff613c] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Step 2: Internal Transfer - Choose Direction -->
    <div
      v-if="step === 2 && transferType === 'internal'"
      class="max-w-4xl mx-auto relative"
    >
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-base font-semibold">Internal Transfer</h2>
      </div>

      <!-- Exchange Rate Input -->
      <div class="bg-white p-3 rounded-lg shadow mb-4">
        <div class="space-y-1 max-w-md">
          <label class="text-xs font-medium mb-1 block">Exchange Rate</label>
          <input
            type="number"
            v-model="internalTransferData.exchange_rate"
            @input="emitInternalTransferData"
            step="0.000001"
            placeholder="Enter exchange rate"
            class="w-full px-4 py-3 text-xs rounded-lg border border-gray-300 focus:outline-none focus:border-[#ff613c]"
          />
        </div>
        <div class="space-y-1 mt-2">
          <label class="text-xs font-medium mb-1 block">Notes (Optional)</label>
          <textarea
            v-model="internalTransferData.notes"
            @input="emitInternalTransferData"
            rows="2"
            placeholder="Add any notes here..."
            class="w-full px-4 py-3 text-xs rounded-lg border border-gray-300 focus:outline-none focus:border-[#ff613c]"
          ></textarea>
        </div>
      </div>

      <!-- From and To Sections -->
      <div class="grid grid-cols-2 gap-4">
        <!-- FROM Section -->
        <div class="bg-white rounded-lg shadow-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold text-sm flex items-center">
              <span
                class="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs mr-1.5"
                >FROM</span
              >
              Source Currency
            </h3>
            <button
              @click="openCashImageModal('from')"
              class="px-3 py-1 bg-[#ff613c] text-white rounded-lg text-xs hover:bg-orange-600 transition"
            >
              <i class="fa-solid fa-plus mr-1"></i>Add Image
            </button>
          </div>

          <!-- From Images List -->
          <div
            v-if="internalTransferData.from_images.length === 0"
            class="text-center py-6 text-gray-400"
          >
            <i class="fa-solid fa-image text-3xl mb-1"></i>
            <p class="text-xs">No images added yet</p>
          </div>

          <div v-else class="space-y-2">
            <div
              v-for="(image, index) in internalTransferData.from_images"
              :key="'from-' + index"
              class="border border-gray-200 rounded-lg p-2 hover:shadow-md transition"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center mb-1.5">
                    <img
                      v-if="image.preview"
                      :src="image.preview"
                      class="w-12 h-12 object-cover rounded mr-2"
                    />
                    <div class="flex-1">
                      <p class="font-semibold text-xs">
                        {{ image.currency }}
                        {{ Number(image.amount).toLocaleString() }}
                      </p>
                      <p class="text-[10px] text-gray-500">
                        {{ image.interact_bank }}
                      </p>
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-1 text-[10px] text-gray-600">
                    <p>
                      <span class="font-medium">From:</span> {{ image.sender }}
                    </p>
                    <p>
                      <span class="font-medium">To:</span> {{ image.receiver }}
                    </p>
                  </div>
                </div>
                <button
                  @click="
                    !image.id
                      ? removeImage('from', index)
                      : deleteImage(image.id)
                  "
                  class="text-red-500 hover:text-red-700 ml-1 text-xs"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>

            <!-- Total for FROM -->
            <div class="bg-red-50 p-2 rounded-lg">
              <p class="text-xs font-semibold">
                Total: {{ getFromCurrency() }}
                {{ getTotalAmount("from").toLocaleString() }}
              </p>
            </div>
          </div>
        </div>

        <!-- TO Section -->
        <div class="bg-white rounded-lg shadow-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold text-sm flex items-center">
              <span
                class="bg-green-100 text-green-600 px-2 py-0.5 rounded-full text-xs mr-1.5"
                >TO</span
              >
              Destination Currency
            </h3>
            <button
              @click="openCashImageModal('to')"
              class="px-3 py-1 bg-green-500 text-white rounded-lg text-xs hover:bg-green-600 transition"
            >
              <i class="fa-solid fa-plus mr-1"></i>Add Image
            </button>
          </div>

          <!-- To Images List -->
          <div
            v-if="internalTransferData.to_images.length === 0"
            class="text-center py-6 text-gray-400"
          >
            <i class="fa-solid fa-image text-3xl mb-1"></i>
            <p class="text-xs">No images added yet</p>
          </div>

          <div v-else class="space-y-2">
            <div
              v-for="(image, index) in internalTransferData.to_images"
              :key="'to-' + index"
              class="border border-gray-200 rounded-lg p-2 hover:shadow-md transition"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center mb-1.5">
                    <img
                      v-if="image.preview"
                      :src="image.preview"
                      class="w-12 h-12 object-cover rounded mr-2"
                    />
                    <div class="flex-1">
                      <p class="font-semibold text-xs">
                        {{ image.currency }}
                        {{ Number(image.amount).toLocaleString() }}
                      </p>
                      <p class="text-[10px] text-gray-500">
                        {{ image.interact_bank }}
                      </p>
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-1 text-[10px] text-gray-600">
                    <p>
                      <span class="font-medium">From:</span> {{ image.sender }}
                    </p>
                    <p>
                      <span class="font-medium">To:</span> {{ image.receiver }}
                    </p>
                  </div>
                </div>
                <button
                  @click="
                    !image.id ? removeImage('to', index) : deleteImage(image.id)
                  "
                  class="text-red-500 hover:text-red-700 ml-1 text-xs"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>

            <!-- Total for TO -->
            <div class="bg-green-50 p-2 rounded-lg">
              <p class="text-xs font-semibold">
                Total: {{ getToCurrency() }}
                {{ getTotalAmount("to").toLocaleString() }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-between mt-4 space-x-2">
        <button
          @click="goBack"
          class="px-4 py-3 text-xs bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Back
        </button>
        <button
          @click="submitInternalTransfer"
          :disabled="!canSubmitInternalTransfer"
          class="px-4 py-3 text-xs bg-[#ff613c] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600"
        >
          Create Internal Transfer
        </button>
      </div>
    </div>

    <!-- Step 2: Direct Banking -->
    <div
      v-if="step === 2 && transferType === 'direct'"
      class="max-w-4xl mx-auto relative"
    >
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-base font-semibold">Direct Banking Transaction</h2>
      </div>

      <div class="bg-white rounded-lg shadow-lg p-4">
        <div class="grid grid-cols-1 gap-6">
          <!-- Image Upload Section -->
          <div>
            <input
              type="file"
              ref="directImageInput"
              class="hidden"
              @change="handleDirectFileChange"
              accept="image/*"
            />
            <div
              class="cursor-pointer w-full h-[350px] border-2 border-dashed border-gray-300 rounded-lg flex justify-center items-center hover:border-[#ff613c] transition"
              @click="$refs.directImageInput.click()"
              v-if="directBankingForm.preview == null"
            >
              <div class="text-center">
                <i
                  class="fa-solid fa-cloud-upload-alt text-4xl text-gray-400 mb-2"
                ></i>
                <p class="text-xs text-gray-500">Click to upload image</p>
              </div>
            </div>
            <div
              class="cursor-pointer w-full h-[350px] border-2 border-dashed border-gray-300 rounded-lg flex justify-center items-center overflow-hidden"
              @click="$refs.directImageInput.click()"
              v-if="directBankingForm.preview != null"
            >
              <img
                :src="directBankingForm.preview"
                alt=""
                class="max-h-full max-w-full object-contain"
              />
            </div>
          </div>

          <!-- Form Section -->
          <div class="space-y-3">
            <div>
              <label class="text-xs font-medium pb-1 block"
                >Interact Bank</label
              >
              <select
                v-model="directBankingForm.interact_bank"
                @change="emitDirectBankingData"
                class="w-full px-2 py-2.5 text-sm rounded-lg shadow border border-gray-100 focus:outline-none focus:border-[#ff613c]"
              >
                <option value="personal">Personal</option>
                <option value="company">Company</option>
                <option value="cash_at_office">Cash at Office</option>
                <option value="to_money_changer">To Money Changer</option>
                <option value="deposit_management">Deposit Management</option>
                <option value="pay_to_driver">Pay to Driver</option>
              </select>
            </div>

            <div>
              <label class="text-xs pb-1 font-medium block">Currency</label>
              <select
                v-model="directBankingForm.currency"
                @change="emitDirectBankingData"
                class="w-full px-2 py-2.5 text-sm rounded-lg shadow border border-gray-100 focus:outline-none focus:border-[#ff613c]"
              >
                <option value="MMK">MMK</option>
                <option value="THB">THB</option>
                <option value="USD">USD</option>
              </select>
            </div>

            <div>
              <label class="text-xs font-medium pb-1 block">Date</label>
              <input
                type="datetime-local"
                v-model="directBankingForm.date"
                @change="emitDirectBankingData"
                class="w-full px-2 py-2.5 text-sm rounded-lg shadow border border-gray-100 focus:outline-none focus:border-[#ff613c]"
              />
            </div>

            <div>
              <label class="text-xs font-medium pb-1 block">Sender</label>
              <input
                type="text"
                v-model="directBankingForm.sender"
                @input="emitDirectBankingData"
                placeholder="Enter sender name"
                class="w-full px-2 py-2.5 text-sm rounded-lg shadow border border-gray-100 focus:outline-none focus:border-[#ff613c]"
              />
            </div>

            <div>
              <label class="text-xs font-medium pb-1 block">Receiver</label>
              <input
                type="text"
                v-model="directBankingForm.receiver"
                @input="emitDirectBankingData"
                placeholder="Enter receiver name"
                class="w-full px-2 py-2.5 text-sm rounded-lg shadow border border-gray-100 focus:outline-none focus:border-[#ff613c]"
              />
            </div>

            <div>
              <label class="text-xs font-medium pb-1 block">Amount</label>
              <input
                type="number"
                v-model="directBankingForm.amount"
                @input="emitDirectBankingData"
                placeholder="Enter amount"
                class="w-full px-2 py-2.5 text-sm rounded-lg shadow border border-gray-100 focus:outline-none focus:border-[#ff613c]"
              />
            </div>

            <div class="flex justify-end items-center space-x-2 pt-3">
              <button
                @click="goBack"
                class="px-3 py-1.5 text-xs bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                @click="submitDirectBanking"
                class="px-3 py-1.5 text-xs bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cash Image Modal -->
    <div
      v-if="showCashImageModal"
      class="fixed inset-0 bg-black/5 bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeCashImageModal"
    >
      <div
        class="bg-white rounded-lg shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div
          class="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between"
        >
          <h3 class="text-sm font-semibold">
            Add Cash Image -
            <span
              :class="
                currentDirection === 'from' ? 'text-red-600' : 'text-green-600'
              "
            >
              {{
                currentDirection === "from"
                  ? "FROM (Source)"
                  : "TO (Destination)"
              }}
            </span>
          </h3>
          <button
            @click="closeCashImageModal"
            class="text-gray-500 hover:text-gray-700"
          >
            <i class="fa-solid fa-times text-lg"></i>
          </button>
        </div>

        <!-- Loading Overlay -->
        <div
          v-if="isExtractingData"
          class="absolute inset-0 bg-white/80 flex items-center justify-center z-10"
        >
          <div class="text-center">
            <i
              class="fa-solid fa-spinner fa-spin text-4xl text-[#ff613c] mb-2"
            ></i>
            <p class="text-sm font-medium">Extracting data from image...</p>
          </div>
        </div>

        <div class="p-4">
          <div class="grid grid-cols-2 gap-6">
            <!-- Image Upload Section -->
            <div>
              <input
                type="file"
                ref="cashImageInput"
                class="hidden"
                @change="handleCashImageFileChange"
                accept="image/*"
              />
              <div
                class="cursor-pointer w-full h-[350px] border-2 border-dashed rounded-lg flex justify-center items-center hover:border-[#ff613c] transition"
                :class="
                  currentDirection === 'from'
                    ? 'border-red-300'
                    : 'border-green-300'
                "
                @click="$refs.cashImageInput.click()"
                v-if="cashImageForm.preview == null"
              >
                <div class="text-center">
                  <i
                    class="fa-solid fa-cloud-upload-alt text-4xl text-gray-400 mb-2"
                  ></i>
                  <p class="text-xs text-gray-500">Click to upload image</p>
                </div>
              </div>
              <div
                class="cursor-pointer w-full h-[350px] border-2 border-dashed rounded-lg flex justify-center items-center overflow-hidden"
                :class="
                  currentDirection === 'from'
                    ? 'border-red-300'
                    : 'border-green-300'
                "
                @click="$refs.cashImageInput.click()"
                v-if="cashImageForm.preview != null"
              >
                <img
                  :src="cashImageForm.preview"
                  alt=""
                  class="max-h-full max-w-full object-contain"
                />
              </div>
            </div>

            <!-- Form Section -->
            <div class="space-y-3">
              <div>
                <label class="text-xs font-medium pb-1 block"
                  >Interact Bank</label
                >
                <select
                  v-model="cashImageForm.interact_bank"
                  class="w-full px-2 py-2.5 text-sm rounded-lg shadow border border-gray-100 focus:outline-none focus:border-[#ff613c]"
                >
                  <option value="personal">Personal</option>
                  <option value="company">Company</option>
                  <option value="cash_at_office">Cash at Office</option>
                  <option value="to_money_changer">To Money Changer</option>
                  <option value="deposit_management">Deposit Management</option>
                  <option value="pay_to_driver">Pay to Driver</option>
                </select>
              </div>

              <div>
                <label class="text-xs pb-1 font-medium block">Currency</label>
                <select
                  v-model="cashImageForm.currency"
                  class="w-full px-2 py-2.5 text-sm rounded-lg shadow border border-gray-100 focus:outline-none focus:border-[#ff613c]"
                >
                  <option value="MMK">MMK</option>
                  <option value="THB">THB</option>
                  <option value="USD">USD</option>
                </select>
              </div>

              <div>
                <label class="text-xs font-medium pb-1 block">Date</label>
                <input
                  type="datetime-local"
                  v-model="cashImageForm.date"
                  class="w-full px-2 py-2.5 text-sm rounded-lg shadow border border-gray-100 focus:outline-none focus:border-[#ff613c]"
                />
              </div>

              <div>
                <label class="text-xs font-medium pb-1 block">Sender</label>
                <input
                  type="text"
                  v-model="cashImageForm.sender"
                  placeholder="Enter sender name"
                  class="w-full px-2 py-2.5 text-sm rounded-lg shadow border border-gray-100 focus:outline-none focus:border-[#ff613c]"
                />
              </div>

              <div>
                <label class="text-xs font-medium pb-1 block">Receiver</label>
                <input
                  type="text"
                  v-model="cashImageForm.receiver"
                  placeholder="Enter receiver name"
                  class="w-full px-2 py-2.5 text-sm rounded-lg shadow border border-gray-100 focus:outline-none focus:border-[#ff613c]"
                />
              </div>

              <div>
                <label class="text-xs font-medium pb-1 block">Amount</label>
                <input
                  type="number"
                  v-model="cashImageForm.amount"
                  placeholder="Enter amount"
                  class="w-full px-2 py-2.5 text-sm rounded-lg shadow border border-gray-100 focus:outline-none focus:border-[#ff613c]"
                />
              </div>

              <div>
                <div class="flex justify-end items-center space-x-2 pt-3">
                  <button
                    @click="closeCashImageModal"
                    class="px-3 py-1.5 text-xs bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    @click="addCashImage"
                    :disabled="!canAddCashImage"
                    :class="
                      currentDirection === 'from'
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-green-500 hover:bg-green-600'
                    "
                    class="px-3 py-1.5 text-xs text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Image
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Swal from "sweetalert2";
import { onMounted } from "vue";
import { ref, computed, defineProps, watch } from "vue";
import { useCashImageStore } from "../../stores/cashImage";
import { useToast } from "vue-toastification";
import { GoogleGenerativeAI } from "@google/generative-ai";

const cashImageStore = useCashImageStore();
const toast = useToast();

// Initialize Gemini API
// At the top of your script, modify the Gemini initialization
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_KEY_2 = import.meta.env.VITE_GEMINI_API_KEY_2;
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL;
let genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
let currentApiKeyIndex = 1; // Track which key we're using

// Add a helper function to switch API keys
const switchToBackupKey = () => {
  if (currentApiKeyIndex === 1) {
    console.log("Switching to backup API key...");
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY_2);
    currentApiKeyIndex = 2;
    toast.info("Switching to backup API key...");
    return true;
  }
  return false; // No more backup keys
};

// Add loading state for AI extraction
const isExtractingData = ref(false);

// Define emits
const emit = defineEmits([
  "transfer-type-selected",
  "step-changed",
  "internal-transfer-data-updated",
  "direct-banking-data-updated",
  "cash-image-added",
  "cash-image-removed",
  "internal-transfer-submitted",
  "direct-banking-submitted",
  "form-reset",
]);

const props = defineProps({
  editData: Object,
});

// Step management
const step = ref(1);
const transferType = ref(null);

// Internal Transfer Data
const internalTransferData = ref({
  id: null,
  exchange_rate: null,
  notes: "",
  from_images: [],
  to_images: [],
});

// Direct Banking Form
const directBankingForm = ref({
  image: null,
  preview: null,
  date: new Date().toISOString().slice(0, 16),
  sender: "",
  receiver: "",
  amount: null,
  interact_bank: "personal",
  currency: "THB",
});

// Cash Image Modal
const showCashImageModal = ref(false);
const currentDirection = ref(null);
const cashImageForm = ref({
  image: null,
  preview: null,
  date: new Date().toISOString().slice(0, 16),
  sender: "",
  receiver: "",
  amount: null,
  interact_bank: "personal",
  currency: "THB",
});

// Refs
const directImageInput = ref(null);
const cashImageInput = ref(null);

// Emit helper methods
const emitInternalTransferData = () => {
  emit("internal-transfer-data-updated", { ...internalTransferData.value });
};

const emitDirectBankingData = () => {
  emit("direct-banking-data-updated", { ...directBankingForm.value });
};

// Methods
const selectTransferType = (type) => {
  transferType.value = type;
  emit("transfer-type-selected", type);
};

const goToNextStep = () => {
  if (transferType.value) {
    step.value = 2;
    emit("step-changed", { step: 2, transferType: transferType.value });
  }
};

const goBack = () => {
  step.value = 1;
  emit("step-changed", { step: 1, transferType: null });
};

const openCashImageModal = (direction) => {
  currentDirection.value = direction;
  showCashImageModal.value = true;
  resetCashImageForm();
};

const closeCashImageModal = () => {
  showCashImageModal.value = false;
  currentDirection.value = null;
  resetCashImageForm();
};

const resetCashImageForm = () => {
  cashImageForm.value = {
    image: null,
    preview: null,
    date: new Date().toISOString().slice(0, 16),
    sender: "",
    receiver: "",
    amount: null,
    interact_bank: "personal",
    currency: "THB",
  };
};

// Updated handleCashImageFileChange with AI extraction
const handleCashImageFileChange = async (event) => {
  const file = event.target.files[0];
  if (file) {
    cashImageForm.value.image = file;
    const reader = new FileReader();
    reader.onload = async (e) => {
      cashImageForm.value.preview = e.target.result;

      // Auto-extract data using Gemini
      await extractTransactionData(file);
    };
    reader.readAsDataURL(file);
  }
};

// Updated handleDirectFileChange with AI extraction
const handleDirectFileChange = async (event) => {
  const file = event.target.files[0];
  if (file) {
    directBankingForm.value.image = file;
    const reader = new FileReader();
    reader.onload = async (e) => {
      directBankingForm.value.preview = e.target.result;

      // Auto-extract data using Gemini
      await extractDirectBankingData(file);
      emitDirectBankingData();
    };
    reader.readAsDataURL(file);
  }
};

// Function to convert file to base64 for Gemini
const fileToGenerativePart = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result.split(",")[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Extract transaction data from cash image modal
const extractTransactionData = async (file) => {
  try {
    isExtractingData.value = true;
    toast.info("Extracting data from image...");

    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    const imagePart = await fileToGenerativePart(file);

    const prompt = `Analyze this bank transaction receipt/slip image and extract the following information in JSON format:
    {
      "sender": "sender name or account holder name",
      "receiver": "receiver name or recipient name or destination",
      "amount": "transaction amount (numbers only, no currency symbol)",
      "currency": "currency code (THB, USD, or MMK)",
      "date": "transaction date and time in ISO format (YYYY-MM-DDTHH:mm)",
      "bank": "bank name if visible"
    }
    
    Rules:
    - Extract only visible information from the image
    - For currency: detect THB (Thai Baht), USD (US Dollar), or MMK (Myanmar Kyat)
    - For date: convert to ISO format. If time is not visible, use 00:00
    - If any field is not clearly visible, use empty string ""
    - Return ONLY valid JSON, no additional text
    - Amount should be numeric value only
    
    Important: The image shows a transaction from "${
      currentDirection.value === "from"
        ? "source account"
        : "destination account"
    }".`;

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const extractedData = JSON.parse(jsonMatch[0]);

      // Auto-fill the form
      if (extractedData.sender)
        cashImageForm.value.sender = extractedData.sender;
      if (extractedData.receiver)
        cashImageForm.value.receiver = extractedData.receiver;
      if (extractedData.amount)
        cashImageForm.value.amount = parseFloat(extractedData.amount);
      if (
        extractedData.currency &&
        ["THB", "USD", "MMK"].includes(extractedData.currency)
      ) {
        cashImageForm.value.currency = extractedData.currency;
      }
      if (extractedData.date) {
        // Convert to datetime-local format
        const dateObj = new Date(extractedData.date);
        if (!isNaN(dateObj.getTime())) {
          cashImageForm.value.date = dateObj.toISOString().slice(0, 16);
        }
      }

      toast.success(
        "Data extracted successfully! Please verify the information.",
      );
    } else {
      toast.warning("Could not extract data. Please fill manually.");
    }
  } catch (error) {
    console.error("Error extracting data:", error);
    // toast.error("Failed to extract data. Please fill manually.");
    // Check if it's a quota/rate limit error
    if (
      (error.message?.includes("429") ||
        error.message?.includes("quota") ||
        error.message?.includes("rate limit")) &&
      retryWithBackup
    ) {
      // Try switching to backup key
      if (switchToBackupKey()) {
        toast.info("Retrying with backup API key...");
        return await extractTransactionData(file, false); // Retry once with backup key
      }
    }
  } finally {
    isExtractingData.value = false;
  }
};

// Extract transaction data for direct banking
const extractDirectBankingData = async (file) => {
  try {
    isExtractingData.value = true;
    toast.info("Extracting data from image...");

    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    const imagePart = await fileToGenerativePart(file);

    const prompt = `Analyze this bank transaction receipt/slip image and extract the following information in JSON format:
    {
      "sender": "sender name or account holder name",
      "receiver": "receiver name or recipient name",
      "amount": "transaction amount (numbers only)",
      "currency": "currency code (THB, USD, or MMK)",
      "date": "transaction date and time in ISO format (YYYY-MM-DDTHH:mm)"
    }
    
    Rules:
    - Extract only visible information
    - For currency: detect THB, USD, or MMK
    - For date: convert to ISO format
    - If any field is not visible, use empty string ""
    - Return ONLY valid JSON, no additional text`;

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const extractedData = JSON.parse(jsonMatch[0]);

      if (extractedData.sender)
        directBankingForm.value.sender = extractedData.sender;
      if (extractedData.receiver)
        directBankingForm.value.receiver = extractedData.receiver;
      if (extractedData.receiver.includes("TH ANYWHERE CO.,LTD."))
        directBankingForm.value.interact_bank = "company";
      if (extractedData.amount)
        directBankingForm.value.amount = parseFloat(extractedData.amount);
      if (
        extractedData.currency &&
        ["THB", "USD", "MMK"].includes(extractedData.currency)
      ) {
        directBankingForm.value.currency = extractedData.currency;
      }
      if (extractedData.date) {
        const dateObj = new Date(extractedData.date);
        if (!isNaN(dateObj.getTime())) {
          directBankingForm.value.date = dateObj.toISOString().slice(0, 16);
        }
      }

      toast.success(
        "Data extracted successfully! Please verify the information.",
      );
    } else {
      // toast.warning("Could not extract data. Please fill manually.");
      console.log("error", error);
    }
  } catch (error) {
    console.error("Error extracting data:", error);
    // toast.error("Failed to extract data. Please fill manually.");
    // Check if it's a quota/rate limit error
    if (
      (error.message?.includes("429") ||
        error.message?.includes("quota") ||
        error.message?.includes("rate limit")) &&
      retryWithBackup
    ) {
      // Try switching to backup key
      if (switchToBackupKey()) {
        toast.info("Retrying with backup API key...");
        return await extractDirectBankingData(file, false); // Retry once with backup key
      }
    }
  } finally {
    isExtractingData.value = false;
  }
};

const canAddCashImage = computed(() => {
  return (
    cashImageForm.value.image &&
    cashImageForm.value.date &&
    cashImageForm.value.sender &&
    cashImageForm.value.receiver &&
    cashImageForm.value.amount &&
    cashImageForm.value.interact_bank &&
    cashImageForm.value.currency
  );
});

const addCashImage = () => {
  if (!canAddCashImage.value) return;

  const imageData = {
    image: cashImageForm.value.image,
    preview: cashImageForm.value.preview,
    date: cashImageForm.value.date,
    sender: cashImageForm.value.sender,
    receiver: cashImageForm.value.receiver,
    amount: parseFloat(cashImageForm.value.amount),
    interact_bank: cashImageForm.value.interact_bank,
    currency: cashImageForm.value.currency,
  };

  if (currentDirection.value === "from") {
    internalTransferData.value.from_images.push(imageData);
  } else {
    internalTransferData.value.to_images.push(imageData);
  }

  emit("cash-image-added", {
    direction: currentDirection.value,
    image: imageData,
  });

  emitInternalTransferData();
  closeCashImageModal();
};

const removeImage = (direction, index) => {
  const removedImage =
    direction === "from"
      ? internalTransferData.value.from_images[index]
      : internalTransferData.value.to_images[index];

  if (direction === "from") {
    internalTransferData.value.from_images.splice(index, 1);
  } else {
    internalTransferData.value.to_images.splice(index, 1);
  }

  emit("cash-image-removed", {
    direction,
    index,
    image: removedImage,
  });

  emitInternalTransferData();
};

const getTotalAmount = (direction) => {
  const images =
    direction === "from"
      ? internalTransferData.value.from_images
      : internalTransferData.value.to_images;
  return images.reduce((sum, img) => sum + parseFloat(img.amount || 0), 0);
};

const getFromCurrency = () => {
  return internalTransferData.value.from_images[0]?.currency || "";
};

const getToCurrency = () => {
  return internalTransferData.value.to_images[0]?.currency || "";
};

const canSubmitInternalTransfer = computed(() => {
  return (
    internalTransferData.value.exchange_rate &&
    internalTransferData.value.from_images.length > 0
  );
});

const submitInternalTransfer = async () => {
  if (!canSubmitInternalTransfer.value) return;

  emit("internal-transfer-submitted", {
    data: internalTransferData.value,
  });

  // alert("Internal transfer created successfully!");
  resetForm();
};

const submitDirectBanking = async () => {
  emit("direct-banking-submitted", {
    data: directBankingForm.value,
  });
  resetForm();
};

const resetForm = () => {
  step.value = 1;
  transferType.value = null;
  internalTransferData.value = {
    exchange_rate: null,
    notes: "",
    id: null,
    from_images: [],
    to_images: [],
  };
  directBankingForm.value = {
    image: null,
    preview: null,
    date: new Date().toISOString().slice(0, 16),
    sender: "",
    receiver: "",
    amount: null,
    interact_bank: "personal",
    currency: "THB",
  };

  emit("form-reset");
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const deleteImage = async (id) => {
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
        await cashImageStore.deleteAction(id);
        toast.success("success delete sale Image");
      } catch (error) {
        toast.error(error);
        console.log(error);
      } finally {
        window.location.reload();
      }
    }
  });

  // await getDetail();
};

onMounted(() => {
  if (props.editData) {
    step.value = 2;
    transferType.value = "internal";
    internalTransferData.value.id = props.editData.id;
    internalTransferData.value.exchange_rate = props.editData.exchange_rate;
    internalTransferData.value.notes = props.editData.note;
    internalTransferData.value.from_images = props.editData.from_files;
    internalTransferData.value.to_images = props.editData.to_files;
    // directBankingForm.value = props.editData.direct_banking_data;
    console.log(props.editData);
  }
});
</script>
