<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="bg-white shadow-sm px-4 py-4 sticky top-0 z-10">
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-bold text-gray-800">Order Report</h1>
        <button
          @click="fetchReportData"
          :disabled="orderStore.loading"
          class="bg-green hover:bg-green text-white p-2 rounded-full shadow-lg transition-all duration-200"
        >
          <svg
            class="w-5 h-5"
            :class="{ 'animate-spin': orderStore.loading }"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="orderStore.loading"
      class="flex justify-center items-center h-64"
    >
      <div
        class="animate-spin rounded-full h-10 w-10 border-b-2 border-green"
      ></div>
    </div>

    <!-- Main Content -->
    <div v-else-if="reportData" class="px-2 py-2 space-y-6">
      <!-- Today's Stats -->
      <div class="bg-white p-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-800">Today</h2>
          <span
            class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full"
          >
            {{ formatDate(new Date()) }}
          </span>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <!-- Total Orders Today -->
          <div
            class="bg-gradient-to-br from-main to-main/80 rounded-lg p-4 text-white"
          >
            <div class="flex items-center justify-between mb-2">
              <svg
                class="w-5 h-5 opacity-80"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                ></path>
              </svg>
            </div>
            <p class="text-2xl font-bold">
              {{ reportData.today.total_orders }}
            </p>
            <p class="text-xs opacity-90">Total Orders</p>
          </div>

          <!-- Customer Created Today -->
          <div
            class="bg-gradient-to-br from-main to-main/80 rounded-lg p-4 text-white"
          >
            <div class="flex items-center justify-between mb-2">
              <svg
                class="w-5 h-5 opacity-80"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"
                ></path>
              </svg>
            </div>
            <p class="text-2xl font-bold">
              {{ reportData.today.customer_create_yes }}
            </p>
            <p class="text-xs opacity-90">Customers</p>
          </div>

          <!-- Sale Converted Today -->
          <div
            class="bg-gradient-to-br from-main to-main/80 rounded-lg p-4 text-white"
          >
            <div class="flex items-center justify-between mb-2">
              <svg
                class="w-5 h-5 opacity-80"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"
                ></path>
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
            <p class="text-2xl font-bold">
              {{ reportData.today.sale_converted }}
            </p>
            <p class="text-xs opacity-90">Customer Sale Converted</p>
          </div>

          <!-- Conversion Rate Today -->
          <div
            class="bg-gradient-to-br from-green to-green/60 rounded-lg p-4 text-white"
          >
            <div class="flex items-center justify-between mb-2">
              <svg
                class="w-5 h-5 opacity-80"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
            <p class="text-2xl font-bold">
              {{ reportData.today.conversion_rate }}%
            </p>
            <p class="text-xs opacity-90">Rate</p>
          </div>
        </div>
      </div>

      <!-- This Month's Stats -->
      <div class="bg-white p-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-800">This Month</h2>
          <span
            class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full"
          >
            {{ getCurrentMonth() }}
          </span>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <!-- Total Orders Month -->
          <div
            class="bg-gradient-to-br from-main to-main/80 rounded-lg p-4 text-white"
          >
            <div class="flex items-center justify-between mb-2">
              <svg
                class="w-5 h-5 opacity-80"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                ></path>
              </svg>
            </div>
            <p class="text-2xl font-bold">
              {{ reportData.this_month.total_orders }}
            </p>
            <p class="text-xs opacity-90">Total Orders</p>
          </div>

          <!-- Customer Created Month -->
          <div
            class="bg-gradient-to-br from-main to-main/80 rounded-lg p-4 text-white"
          >
            <div class="flex items-center justify-between mb-2">
              <svg
                class="w-5 h-5 opacity-80"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"
                ></path>
              </svg>
            </div>
            <p class="text-2xl font-bold">
              {{ reportData.this_month.customer_create_yes }}
            </p>
            <p class="text-xs opacity-90">Customers</p>
          </div>

          <!-- Sale Converted Month -->
          <div
            class="bg-gradient-to-br from-main to-main/80 rounded-lg p-4 text-white"
          >
            <div class="flex items-center justify-between mb-2">
              <svg
                class="w-5 h-5 opacity-80"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"
                ></path>
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
            <p class="text-2xl font-bold">
              {{ reportData.this_month.sale_converted }}
            </p>
            <p class="text-xs opacity-90">Customer Sale Converted</p>
          </div>

          <!-- Conversion Rate Month -->
          <div
            class="bg-gradient-to-br from-green to-green/60 rounded-lg p-4 text-white"
          >
            <div class="flex items-center justify-between mb-2">
              <svg
                class="w-5 h-5 opacity-80"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
            <p class="text-2xl font-bold">
              {{ reportData.this_month.conversion_rate }}%
            </p>
            <p class="text-xs opacity-90">Rate</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="flex flex-col items-center justify-center h-64 px-4"
    >
      <div class="text-red-500 text-center mb-4">
        <svg
          class="w-12 h-12 mx-auto mb-2"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          ></path>
        </svg>
        <p class="text-lg font-medium">Failed to load data</p>
        <p class="text-sm text-gray-500">Please try again</p>
      </div>
      <button
        @click="fetchReportData"
        class="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg"
      >
        Retry
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useOrderStore } from "../../stores/order"; // Adjust path as needed

const orderStore = useOrderStore();
const reportData = ref(null);
const error = ref(false);

const fetchReportData = async () => {
  try {
    error.value = false;
    const response = await orderStore.getSimpleListAction();
    reportData.value = response.result;
  } catch (err) {
    console.error("Error fetching report data:", err);
    error.value = true;
  }
};

const formatDate = (date) => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const getCurrentMonth = () => {
  const now = new Date();
  return now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
};

const getDailyAverage = (monthlyTotal) => {
  const today = new Date();
  const daysInMonth = today.getDate();
  return Math.round(parseInt(monthlyTotal) / daysInMonth);
};

const getPerformanceColor = (rate) => {
  if (rate >= 80) return "text-green";
  if (rate >= 60) return "text-yellow-600";
  return "text-red-600";
};

const getPerformanceText = (rate) => {
  if (rate >= 80) return "Excellent";
  if (rate >= 60) return "Good";
  return "Needs Improvement";
};

const getComparisonColor = (type) => {
  const today = parseInt(
    reportData.value.today[
      type === "orders"
        ? "total_orders"
        : type === "customers"
        ? "customer_create_yes"
        : "sale_converted"
    ]
  );
  const average = getDailyAverage(
    reportData.value.this_month[
      type === "orders"
        ? "total_orders"
        : type === "customers"
        ? "customer_create_yes"
        : "sale_converted"
    ]
  );

  if (today > average) return "bg-green";
  if (today === average) return "bg-yellow-500";
  return "bg-red-500";
};

const getComparisonText = (type) => {
  const today = parseInt(
    reportData.value.today[
      type === "orders"
        ? "total_orders"
        : type === "customers"
        ? "customer_create_yes"
        : "sale_converted"
    ]
  );
  const average = getDailyAverage(
    reportData.value.this_month[
      type === "orders"
        ? "total_orders"
        : type === "customers"
        ? "customer_create_yes"
        : "sale_converted"
    ]
  );

  if (today > average) return "Above Average";
  if (today === average) return "Average";
  return "Below Average";
};

onMounted(() => {
  fetchReportData();
});
</script>
