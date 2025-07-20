<template>
  <!-- Order Details Modal -->
  <div
    v-if="isVisible"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click="closeModal"
  >
    <div
      class="bg-white rounded-lg max-w-2xl w-full max-h-[85vh] flex flex-col"
      @click.stop
    >
      <!-- Modal Header -->
      <div class="bg-black/5 px-6 py-4 border-b border-black/20 flex-shrink-0">
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-semibold text-gray-800">
            {{ modalTitle }}
          </h3>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Creator List -->
      <div class="flex-1 overflow-y-auto px-6 py-4 min-h-0">
        <div
          v-if="Object.keys(creatorStats).length === 0"
          class="text-center py-8"
        >
          <svg
            class="w-12 h-12 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
          <p class="text-gray-500 text-lg">No orders found</p>
        </div>

        <div v-else class="space-y-3">
          <!-- Creator Item -->
          <div
            v-for="(stats, creatorName) in creatorStats"
            :key="creatorName"
            class="bg-white border border-black/20 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div class="flex items-center justify-between">
              <!-- Creator Info -->
              <div class="flex items-center space-x-3">
                <div
                  class="w-10 h-10 bg-main bg-opacity-10 rounded-full flex items-center justify-center"
                >
                  <svg
                    class="w-5 h-5 text-main"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-800">
                    {{ creatorName != "N/A" ? creatorName : stats.admin_name }}
                  </h4>
                  <p class="text-xs text-gray-500">
                    {{ stats.totalOrders }} total orders
                  </p>
                </div>
              </div>

              <!-- Customer Stats -->
              <div class="text-right">
                <div class="text-2xl font-bold text-main">
                  {{ stats.newCustomers }}
                </div>
                <div class="text-xs text-gray-500">New Customers</div>
              </div>
            </div>

            <!-- Progress Bar (Optional Visual) -->
            <div class="mt-3">
              <div class="flex justify-between text-xs text-gray-500 mb-1">
                <span>New Customer Rate</span>
                <span>{{ stats.customerRate }}%</span>
              </div>
              <div class="w-full bg-black/20 rounded-full h-2">
                <div
                  class="bg-main rounded-full h-2 transition-all duration-300"
                  :style="{ width: stats.customerRate + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Footer -->
      <div class="bg-black/5 px-6 py-4 border-t border-black/20 flex-shrink-0">
        <div class="grid grid-cols-3 gap-4 text-center">
          <div>
            <div class="text-lg font-bold text-gray-800">{{ totalOrders }}</div>
            <div class="text-xs text-gray-500">Total Orders</div>
          </div>
          <div>
            <div class="text-lg font-bold text-main">
              {{ totalNewCustomers }}
            </div>
            <div class="text-xs text-gray-500">New Customers</div>
          </div>
          <div>
            <div class="text-lg font-bold text-blue-600">
              {{ Object.keys(creatorStats).length }}
            </div>
            <div class="text-xs text-gray-500">Active Creators</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  orders: {
    type: Array,
    default: () => [],
  },
  title: {
    type: String,
    default: "Customer Creation Report",
  },
  period: {
    type: String,
    default: "today", // 'today' or 'month'
  },
});

const emit = defineEmits(["close"]);

// Computed properties
const modalTitle = computed(() => {
  const periodText = props.period === "today" ? "Today's" : "This Month's";
  return `${periodText} ${props.title}`;
});

const creatorStats = computed(() => {
  const stats = {};

  props.orders.forEach((order) => {
    const creatorName = order.admin_name || "Unknown Creator";

    if (!stats[creatorName]) {
      stats[creatorName] = {
        totalOrders: 0,
        newCustomers: 0,
        customerRate: 0,
      };
    }

    stats[creatorName].totalOrders++;

    if (order.is_customer_create === "1") {
      stats[creatorName].newCustomers++;
    }
  });

  // Calculate customer creation rate for each creator
  Object.keys(stats).forEach((creatorName) => {
    const creator = stats[creatorName];
    creator.customerRate =
      creator.totalOrders > 0
        ? Math.round((creator.newCustomers / creator.totalOrders) * 100)
        : 0;
  });

  // Sort by new customers count (descending)
  const sortedStats = {};
  Object.keys(stats)
    .sort((a, b) => stats[b].newCustomers - stats[a].newCustomers)
    .forEach((key) => {
      sortedStats[key] = stats[key];
    });

  return sortedStats;
});

const totalOrders = computed(() => props.orders.length);

const totalNewCustomers = computed(
  () => props.orders.filter((order) => order.is_customer_create === "1").length
);

// Methods
const closeModal = () => {
  emit("close");
};
</script>
