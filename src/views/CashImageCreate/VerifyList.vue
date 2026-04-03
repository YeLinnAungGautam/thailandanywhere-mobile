<template>
  <div>
    <div class="mb-4">
      <div class="flex items-center gap-3">
        <!-- Cash Image Checker with Dropdown -->
        <div class="relative">
          <button
            class="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-200 hover:text-black rounded-full transition-colors font-medium text-gray-700 whitespace-nowrap text-xs"
            @click="toggleCashImageChecker"
            :class="
              ['dataVerify', 'duplicateChecker'].includes(route.name)
                ? 'bg-[#FF613c] text-white'
                : 'bg-gray-100'
            "
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>Cash Image Checker</span>
            <svg
              :class="[
                'w-4 h-4 transition-transform',
                isCashImageOpen ? 'rotate-90' : '',
              ]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <!-- Dropdown Menu -->
          <div
            v-if="isCashImageOpen"
            class="absolute top-full mt-2 left-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px] z-50"
          >
            <!-- Data Checker -->
            <button
              @click="router.push('/data_verify?month=' + selectedMonth)"
              class="w-full text-left px-4 py-2 hover:bg-yellow-50 transition-colors text-xs text-gray-700 flex items-center gap-2"
              :class="route.name == 'dataVerify' ? 'bg-yellow-50' : ''"
            >
              <span class="w-2 h-2 bg-yellow-400 rounded-full"></span>
              <span>Data Checker</span>
            </button>

            <!-- Duplicate Checker -->
            <button
              @click="router.push('/duplicate_checker?month=' + selectedMonth)"
              class="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors text-xs text-gray-700 flex items-center gap-2"
              :class="route.name == 'duplicateChecker' ? 'bg-blue-50' : ''"
            >
              <span class="w-2 h-2 bg-blue-400 rounded-full"></span>
              <span>Duplicate Checker</span>
            </button>

            <!-- Bank Verification -->
            <button
              class="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors text-xs text-gray-700 flex items-center gap-2"
              @click="router.push('/bank_verify?month=' + selectedMonth)"
              :class="route.name == 'bankVerify' ? 'bg-blue-50' : ''"
            >
              <span class="w-2 h-2 bg-blue-400 rounded-full"></span>
              <span>Bank Verification</span>
            </button>

            <!-- Internal Transfer Checker -->
            <button
              @click="
                router.push(
                  '/internalTransfer_checker?month=' +
                    selectedMonth +
                    '&year=' +
                    year
                )
              "
              class="w-full text-left px-4 py-2 hover:bg-purple-50 transition-colors text-xs text-gray-700 flex items-center gap-2"
              :class="
                route.name == 'internalTransferChecker' ? 'bg-purple-50' : ''
              "
            >
              <span class="w-2 h-2 bg-purple-400 rounded-full"></span>
              <span>Transfer Checker</span>
            </button>

            <!-- Exchange Rate Checker -->
            <button
              class="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-xs text-gray-700 flex items-center gap-2"
            >
              <span class="w-2 h-2 bg-gray-400 rounded-full"></span>
              <span>Exchange Rate Checker</span>
            </button>
          </div>
        </div>

        <!-- Default -->
        <button
          @click="router.push('/verify_invoices')"
          :class="
            route.name == 'verifyInvoices'
              ? 'bg-[#FF613c] text-white'
              : 'bg-gray-100'
          "
          class="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-200 hover:text-black rounded-full transition-colors font-medium text-gray-700 whitespace-nowrap text-xs"
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span>Invoice Checker</span>
        </button>

        <!-- Sales Checker -->
        <button
          class="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 hover:text-black rounded-full transition-colors font-medium text-gray-700 whitespace-nowrap text-xs"
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
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <span>Sales Checker</span>
        </button>

        <!-- Expense Checker -->
        <button
          class="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 hover:text-black rounded-full transition-colors font-medium text-gray-700 whitespace-nowrap text-xs"
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
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span>Expense Checker</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps } from "vue";
import { useRoute, useRouter } from "vue-router";

const isCashImageOpen = ref(false);
const router = useRouter();
const route = useRoute();

const props = defineProps({
  selectedMonth: {
    type: String,
    required: true,
  },
});

const toggleCashImageChecker = () => {
  isCashImageOpen.value = !isCashImageOpen.value;
};
</script>
