<template>
  <div class="p-4">
    <!-- Header -->
    <div class="px-4 py-3 border-b">
      <div class="flex items-center justify-between flex-wrap gap-2">
        <h3 class="text-sm font-semibold text-black/80 whitespace-nowrap">
          Orders Today
        </h3>
        <div class="flex justify-end items-center space-x-2">
          <span class="text-xs text-white bg-green px-2 py-1 rounded-full">
            {{ formatNumber(saleConvertTotal) }}
          </span>
          <span class="text-xs text-white bg-red px-2 py-1 rounded-full">
            {{ formatNumber(pendingTotal) }}
          </span>
          <span
            class="text-xs text-white bg-main whitespace-nowrap px-2 py-1 rounded-full"
          >
            {{ filteredOrdersCount }} orders
          </span>
        </div>
      </div>
    </div>

    <!-- Filter Section -->
    <div class="px-4 py-3 border-b bg-gray-50">
      <div class="flex items-center space-x-3">
        <span class="text-xs font-medium text-black/70">Filter:</span>
        <div class="flex space-x-2">
          <button
            @click="setFilter('all')"
            :class="[
              'px-3 py-1 text-xs rounded-full border transition-colors',
              activeFilter === 'all'
                ? 'bg-main text-white border-main'
                : 'bg-white text-main/70 border-main/20 hover:border-main/40',
            ]"
          >
            All ({{ allOrdersCount }})
          </button>
          <button
            @click="setFilter('sale_convert')"
            :class="[
              'px-3 py-1 text-xs rounded-full border transition-colors',
              activeFilter === 'sale_convert'
                ? 'bg-green text-white border-green'
                : 'bg-white text-green border-green/30 hover:border-green/60',
            ]"
          >
            Sale Convert ({{ saleConvertCount }})
          </button>
          <button
            @click="setFilter('pending')"
            :class="[
              'px-3 py-1 text-xs rounded-full border transition-colors',
              activeFilter === 'pending'
                ? 'bg-red text-white border-red'
                : 'bg-white text-red/70 border-red/70 hover:border-red/70',
            ]"
          >
            Pending ({{ pendingCount }})
          </button>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loadingOrders" class="px-4 py-8 text-center">
      <div
        class="animate-spin rounded-full h-6 w-6 border-b-2 border-black/90 mx-auto"
      ></div>
      <p class="text-xs text-black mt-2">Loading orders...</p>
    </div>

    <!-- Filtered Order List -->
    <div
      v-else-if="filteredOrders && filteredOrders.length > 0"
      class="max-h-[62vh] overflow-y-auto"
    >
      <div class="p-2">
        <div
          v-for="order in filteredOrders"
          :key="order.id"
          class="mb-2 p-3 bg-white border border-black/20 rounded-lg hover:shadow-sm"
        >
          <div class="text-sm space-y-1">
            <div class="font-semibold text-black/80">
              {{ order.customer?.name || "Unknown" }}
            </div>
            <div class="flex justify-between items-center pt-1">
              <span
                :class="getStatusColor(order.order_status)"
                class="px-2 py-1 text-xs rounded"
              >
                {{ formatOrderStatus(order.order_status) }}
              </span>
              <span class="text-green-600 font-semibold"
                >THB {{ order.grand_total }}</span
              >
            </div>
            <div class="text-xs text-black/80 pt-1 space-y-1">
              <div>Agent: {{ order.admin?.name || "Unknown" }}</div>
              <div>Phone: {{ order.customer?.phone_number || "N/A" }}</div>
              <div>Discount: ${{ order.discount || "0.00" }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="px-4 py-8 text-center">
      <div class="text-gray-400 mb-2">
        <svg class="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
          <path
            d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"
          ></path>
        </svg>
      </div>
      <p class="text-sm text-gray-500">
        {{
          activeFilter === "all"
            ? "No orders found today"
            : `No ${formatFilterLabel(activeFilter)} orders found`
        }}
      </p>
      <p class="text-xs text-gray-400">
        {{
          activeFilter === "all"
            ? "Orders will appear here when available"
            : "Try selecting a different filter"
        }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useOrderStore } from "../../stores/order";

const orderStore = useOrderStore();

const todayOrdersData = ref(null);
const loadingOrders = ref(false);
const activeFilter = ref("all");

const fetchTodayOrders = async () => {
  try {
    loadingOrders.value = true;
    let params = {
      // Use today's date instead of hardcoded date
      order_datetime: new Date().toISOString().split("T")[0],
      // order_datetime: "2025-08-30", // Keep for testing
      limit: 100, // Increase limit to get more orders
    };

    const response = await orderStore.getListAction(params);

    console.log("API Response:", response);

    if (response.status === 1 && response.result && response.result.data) {
      todayOrdersData.value = response.result;
      console.log("Orders Data:", todayOrdersData.value);
    }
  } catch (error) {
    console.error("Error fetching today orders:", error);
  } finally {
    loadingOrders.value = false;
  }
};

// Filter methods
const setFilter = (filter) => {
  activeFilter.value = filter;
};

const formatFilterLabel = (filter) => {
  switch (filter) {
    case "sale_convert":
      return "Sale Convert";
    case "pending":
      return "Pending";
    default:
      return filter;
  }
};

// Computed properties for filtered orders and counts
const filteredOrders = computed(() => {
  if (!todayOrdersData.value?.data) return [];

  if (activeFilter.value === "all") {
    return todayOrdersData.value.data;
  }

  return todayOrdersData.value.data.filter(
    (order) => order.order_status === activeFilter.value
  );
});

const filteredOrdersCount = computed(() => {
  return filteredOrders.value.length;
});

const allOrdersCount = computed(() => {
  return todayOrdersData.value?.data?.length || 0;
});

const saleConvertCount = computed(() => {
  if (!todayOrdersData.value?.data) return 0;
  return todayOrdersData.value.data.filter(
    (order) => order.order_status === "sale_convert"
  ).length;
});

const saleConvertTotal = computed(() => {
  if (!todayOrdersData.value?.data) return 0;
  return todayOrdersData.value.data
    .filter((order) => order.order_status === "sale_convert")
    .reduce((total, order) => total + order.grand_total * 1, 0);
});

const pendingCount = computed(() => {
  if (!todayOrdersData.value?.data) return 0;
  return todayOrdersData.value.data.filter(
    (order) => order.order_status === "pending"
  ).length;
});

const pendingTotal = computed(() => {
  if (!todayOrdersData.value?.data) return 0;
  return todayOrdersData.value.data
    .filter((order) => order.order_status === "pending")
    .reduce((total, order) => total + order.grand_total * 1, 0);
});

const formatNumber = (number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "THB",
  }).format(number);
};

// Count of orders (for backward compatibility)
const newCustomerOrdersCount = computed(() => {
  return filteredOrdersCount.value;
});

// Helper methods for styling
const getStatusColor = (status) => {
  switch (status) {
    case "sale_convert":
      return "bg-green/10 text-green";
    case "cancelled":
      return "bg-red/10 text-red";
    case "pending":
      return "bg-yellow/10 text-black/80";
    case "processing":
      return "bg-blue/10 text-blue";
    case "completed":
      return "bg-purple/10 text-purple";
    default:
      return "bg-gray/10 text-black/80";
  }
};

const formatOrderStatus = (status) => {
  switch (status) {
    case "sale_convert":
      return "Sale Converted";
    case "cancelled":
      return "Cancelled";
    case "pending":
      return "Pending";
    case "processing":
      return "Processing";
    case "completed":
      return "Completed";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

onMounted(async () => {
  await fetchTodayOrders();
});
</script>
