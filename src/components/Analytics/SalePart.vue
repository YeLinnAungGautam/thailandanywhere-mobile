<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { BarChart, LineChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);
import { useAuthStore } from "../../stores/auth";

import SaleGraphVue from "./SaleGraph.vue";
import { useHomeStore } from "../../stores/home";
import {
  MagnifyingGlassCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/vue/24/solid";

const homeStore = useHomeStore();
const authStore = useAuthStore();

// NEW: Carousel state with touch/swipe support
const carouselIndex = ref(0);
const totalCarouselPages = 3;
const touchStartX = ref(0);
const touchEndX = ref(0);
const isDragging = ref(false);

const nextSlide = () => {
  carouselIndex.value = (carouselIndex.value + 1) % totalCarouselPages;
};

const prevSlide = () => {
  carouselIndex.value =
    (carouselIndex.value - 1 + totalCarouselPages) % totalCarouselPages;
};

const goToSlide = (index) => {
  carouselIndex.value = index;
};

// NEW: Touch/Swipe handlers
const handleTouchStart = (e) => {
  touchStartX.value = e.touches[0].clientX;
  isDragging.value = true;
};

const handleTouchMove = (e) => {
  if (!isDragging.value) return;
  touchEndX.value = e.touches[0].clientX;
};

const handleTouchEnd = () => {
  if (!isDragging.value) return;
  isDragging.value = false;

  const swipeThreshold = 50;
  const diff = touchStartX.value - touchEndX.value;

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // Swiped left - next slide
      nextSlide();
    } else {
      // Swiped right - previous slide
      prevSlide();
    }
  }

  touchStartX.value = 0;
  touchEndX.value = 0;
};

// NEW: Mouse drag handlers for desktop
const handleMouseDown = (e) => {
  touchStartX.value = e.clientX;
  isDragging.value = true;
};

const handleMouseMove = (e) => {
  if (!isDragging.value) return;
  touchEndX.value = e.clientX;
};

const handleMouseUp = () => {
  if (!isDragging.value) return;
  isDragging.value = false;

  const swipeThreshold = 50;
  const diff = touchStartX.value - touchEndX.value;

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      nextSlide();
    } else {
      prevSlide();
    }
  }

  touchStartX.value = 0;
  touchEndX.value = 0;
};

const handleMouseLeave = () => {
  if (isDragging.value) {
    isDragging.value = false;
    touchStartX.value = 0;
    touchEndX.value = 0;
  }
};

const priceSalesGraph = ref("1");
const togglePriceSalesGraph = async () => {
  if (priceSalesGraph.value == 0) {
    priceSalesGraph.value = 1;
  } else {
    priceSalesGraph.value = 0;
  }
};
const priceSalesGraphAgent = ref("");

watch(priceSalesGraphAgent, async (newValue) => {
  priceSalesGraph.value = 0;
  getAllDays(monthForGraph.value);
});

const formattedTotal = (data) => {
  return new Intl.NumberFormat("en-US").format(data || 0);
};

const dataTest = reactive({ items: [] });
const dataAmount = reactive({ items: [] });
const dataPaid = reactive({ items: [] });
const dataNotPaid = reactive({ items: [] });

const totalSaleForShow = computed(() => {
  if (dataAmount.items.length > 0) {
    let total = 0;
    for (let i = 0; i < dataAmount.items.length; i++) {
      total += dataAmount.items[i];
    }
    return total;
  }
  return 0;
});

const saleData = {
  labels: dataTest.items,
  datasets: [
    {
      label: "Total Sales",
      type: "line",
      data: dataAmount.items,
      backgroundColor: "rgb(255, 87, 51)",
      borderColor: "rgb(255, 87, 51)",
      borderWidth: 1,
    },
    {
      label: "Fully Paid",
      type: "bar",
      data: dataPaid.items,
      backgroundColor: "rgb(17, 223, 0)",
      borderColor: "rgb(17, 223, 0)",
      borderWidth: 1,
    },
    {
      label: "Not Paid",
      type: "bar",
      data: dataNotPaid.items,
      backgroundColor: "rgb(223, 0, 0 )",
      borderColor: "rgb(223, 0, 0 )",
      borderWidth: 1,
    },
  ],
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
};

const productType = (type) => {
  switch (type) {
    case "Private Van Tour":
      return "Tours";
    case "Entrance Ticket":
      return "Tickets";
    case "Hotel & Room":
      return "Hotels";
    case "Airline":
      return "Airlines";
    default:
      return "Inclusive";
  }
};

const saleValueAgent = reactive({ items: [] });
const saleValueKoNayMyo = reactive({ items: [] });
const saleValueChitSu = reactive({ items: [] });
const saleValueEiMyat = reactive({ items: [] });
const saleValueChaw = reactive({ items: [] });

const agentColors = [
  "#FF0000",
  "#0032FF",
  "#04FF00",
  "#00FFF7",
  "#FFE400",
  "#0027FF",
  "#C500FF",
  "#FF00A2",
  "#00BDFF",
];

// CHANGED: Make saleDataAgent reactive
const saleDataAgent = reactive({
  labels: [],
  datasets: [],
});

const saleDataAgentOption = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
  plugins: {
    tooltip: {
      callbacks: {
        footer: function (a) {
          console.log(a, "this is a footer");
          return `Booking - ${a[0].dataset.dataforFooter[a[0].dataIndex]}`;
        },
      },
    },
  },
};

const saleDataByAgentOption = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const totalByAgent = reactive({ items: [] });
const paidByAgent = reactive({ items: [] });
const notPaidAgent = reactive({ items: [] });
const AgentName = ref([]);
const saleDataByAgent = {
  labels: [],
  datasets: [
    {
      label: "Total Sales",
      type: "line",
      data: totalByAgent.items,
      footerForCount: [],
      backgroundColor: "rgb(255, 87, 51)",
      borderColor: "rgb(255, 87, 51)",
      borderWidth: 1,
    },
    {
      label: "Fully Paid",
      type: "bar",
      data: paidByAgent.items,
      backgroundColor: "rgb(17, 223, 0)",
      borderColor: "rgb(17, 223, 0)",
      borderWidth: 1,
    },
    {
      label: "Not Paid",
      type: "bar",
      data: notPaidAgent.items,
      backgroundColor: "rgb(223, 0, 0 )",
      borderColor: "rgb(223, 0, 0 )",
      borderWidth: 1,
    },
  ],
};

const allSaleResponse = ref(null);

// NEW: Add airline toggle state
const includeAirline = ref(false);
const totalAirlineForShow = ref(0);

const summary = ref({});

const fetchSummary = async (month) => {
  try {
    let one = month.split("-")[0];
    let two = month.split("-")[1];
    let fix = two + "-" + one;
    const params = {
      daterange: fix,
      admin_id: "",
    };

    const res = await homeStore.getDashboardSummary(params);
    console.log(" Response for summary:", res);

    if (res?.data?.result) {
      summary.value = res.data.result;
      console.log("====================================");
      console.log(summary.value);
      console.log("====================================");
    }
  } catch (error) {
    console.error("Error fetching receivables:", error);
  }
};

const getAllDays = async (monthGet) => {
  console.log(monthGet, "this is month");
  const res = await homeStore.getTimeFilterArray(monthGet);
  allSaleResponse.value = res.result;
  console.log(res, "this is for graph");

  dataAmount.items.splice(0);
  dataPaid.items.splice(0);
  dataNotPaid.items.splice(0);
  saleValueAgent.items.splice(0);
  saleValueKoNayMyo.items.splice(0);
  saleValueChitSu.items.splice(0);
  saleValueEiMyat.items.splice(0);
  saleValueChaw.items.splice(0);
  dataTest.items.splice(0);
  totalAirlineForShow.value = 0;
  AgentName.value = []; // Clear agent names

  // Calculate total airline sales
  for (let x = 0; x < res.result.airline_sales.length; x++) {
    for (let i = 0; i < res.result.airline_sales[x].agents.length; i++) {
      totalAirlineForShow.value += res.result.airline_sales[x].agents[i].total;
    }
  }

  for (let x = 0; x < res.result.sales.length; x++) {
    let dataArr = 0;
    let dataPaidArr = 0;
    let dataNotPaidArr = 0;

    // Get airline sales for this day
    let airlineDataArr = 0;
    let airlinePaidArr = 0;
    let airlineNotPaidArr = 0;

    if (res.result.airline_sales[x]) {
      for (let i = 0; i < res.result.airline_sales[x].agents.length; i++) {
        airlineDataArr += res.result.airline_sales[x].agents[i].total;
        airlinePaidArr += res.result.airline_sales[x].agents[i].total_deposit;
        airlineNotPaidArr +=
          res.result.airline_sales[x].agents[i].total_balance;
      }
    }

    for (let i = 0; i < res.result.sales[x].agents.length; i++) {
      dataArr += res.result.sales[x].agents[i].total;
    }
    for (let i = 0; i < res.result.sales[x].agents.length; i++) {
      dataPaidArr += res.result.sales[x].agents[i].total_deposit;
    }
    for (let i = 0; i < res.result.sales[x].agents.length; i++) {
      dataNotPaidArr += res.result.sales[x].agents[i].total_balance;
    }

    // Subtract airline if includeAirline is false
    if (!includeAirline.value) {
      dataArr -= airlineDataArr;
      dataPaidArr -= airlinePaidArr;
      dataNotPaidArr -= airlineNotPaidArr;
    }

    dataAmount.items.push(dataArr);
    dataPaid.items.push(dataPaidArr);
    dataNotPaid.items.push(dataNotPaidArr);
    dataTest.items.push(res.result.sales[x].date);
  }

  // CHANGED: Clear the reactive datasets and labels arrays properly
  saleDataAgent.datasets.splice(0);
  saleDataAgent.labels.splice(0);

  saleDataByAgent.labels = [];
  totalByAgent.items.splice(0);
  paidByAgent.items.splice(0);
  notPaidAgent.items.splice(0);
  saleDataByAgent.datasets.footerForCount = [];

  // NEW: First, collect all unique agent names
  const allAgentNames = new Set();
  res.result.sales.forEach((sale) => {
    sale.agents.forEach((agent) => {
      allAgentNames.add(agent.name);
    });
  });

  // NEW: Initialize datasets for all agents
  const agentNamesArray = Array.from(allAgentNames);
  AgentName.value = agentNamesArray;

  agentNamesArray.forEach((agentName, index) => {
    saleDataAgent.datasets.push({
      label: agentName,
      data: [],
      dataforFooter: [],
      backgroundColor: [agentColors[index % agentColors.length]],
      type: "line",
    });
  });

  // Now process each sale date
  res.result.sales.forEach((sale, saleIndex) => {
    saleDataAgent.labels.push(sale.date);
    saleDataByAgent.labels.push(sale.date);

    const airlineSaleForDay = res.result.airline_sales[saleIndex];

    // NEW: Create a map of agent sales for this date
    const agentSalesMap = new Map();
    sale.agents.forEach((agent) => {
      let airlineAgentTotal = 0;
      let airlineAgentDeposit = 0;
      let airlineAgentBalance = 0;

      if (airlineSaleForDay) {
        const airlineAgent = airlineSaleForDay.agents.find(
          (a) => a.name === agent.name
        );
        if (airlineAgent) {
          airlineAgentTotal = airlineAgent.total;
          airlineAgentDeposit = airlineAgent.total_deposit;
          airlineAgentBalance = airlineAgent.total_balance;
        }
      }

      let finalTotal = agent.total;
      let finalDeposit = agent.total_deposit;
      let finalBalance = agent.total_balance;

      if (!includeAirline.value) {
        finalTotal -= airlineAgentTotal;
        finalDeposit -= airlineAgentDeposit;
        finalBalance -= airlineAgentBalance;
      }

      agentSalesMap.set(agent.name, {
        total: finalTotal,
        deposit: finalDeposit,
        balance: finalBalance,
        count: agent.total_count,
      });
    });

    // Handle today's sale calculation
    if (sale.date == todayDate.value) {
      todaySale.value = 0;
      todayBookingCount.value = 0;
      agentSalesMap.forEach((data) => {
        todaySale.value += data.total;
        todayBookingCount.value += data.count;
      });
    }

    // NEW: Push data for ALL agents (0 if no sales that day)
    saleDataAgent.datasets.forEach((dataset) => {
      const agentData = agentSalesMap.get(dataset.label);
      if (agentData) {
        dataset.data.push(agentData.total);
        dataset.dataforFooter.push(agentData.count);

        // Handle individual agent graph
        if (priceSalesGraphAgent.value === dataset.label) {
          totalByAgent.items.push(agentData.total);
          paidByAgent.items.push(agentData.deposit);
          notPaidAgent.items.push(agentData.balance);
          saleDataByAgent.datasets[0].footerForCount.push(agentData.count);
        }
      } else {
        // Agent had no sales this day - push 0
        dataset.data.push(0);
        dataset.dataforFooter.push(0);

        if (priceSalesGraphAgent.value === dataset.label) {
          totalByAgent.items.push(0);
          paidByAgent.items.push(0);
          notPaidAgent.items.push(0);
          saleDataByAgent.datasets[0].footerForCount.push(0);
        }
      }
    });
  });

  console.log(saleDataAgent);

  await fetchSummary(monthGet);
};

const reservation_data = ref("");
const airline_minus = ref("");
const getSaleDate = async (date) => {
  console.log("====================================");
  console.log(date);

  monthForGraph.value = date.split("-")[0] + "-" + date.split("-")[1];
  console.log(monthForGraph.value);
  console.log("====================================");

  if (allSaleResponse.value) {
    allSaleResponse?.value.sales.forEach((sale) => {
      if (sale.date == todayDate.value) {
        todaySale.value = 0;
        todayBookingCount.value = 0;
        let total = 0;
        let count = 0;
        for (let i = 0; i < sale.agents.length; i++) {
          total += sale.agents[i].total;
          count += sale.agents[i].total_count;
        }
        todaySale.value = total;
        todayBookingCount.value = count;
      }
    });
  }

  reservation_data.value = "";
  const res = await homeStore.saleReportByDate({ created_at: date });
  console.log("====================================");
  console.log(res, "this is sale report");
  console.log("====================================");
  reservation_data.value = res.data;

  airline_minus.value = 0;

  if (reservation_data.value) {
    for (let x = 0; x < reservation_data.value.data.reservations.length; x++) {
      let reservation_product =
        reservation_data.value.data.reservations[x].product_type;
      let reservation_amount =
        reservation_data.value.data.reservations[x].amount;
      if (reservation_product == "App\\Models\\Airline") {
        airline_minus.value += reservation_amount * 1;
      }
    }
  }
};

const dateFormat = (inputDateString) => {
  if (inputDateString != null) {
    const inputDate = new Date(inputDateString);

    const year = inputDate.getFullYear();
    const month = String(inputDate.getMonth() + 1).padStart(2, "0");
    const day = String(inputDate.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  } else {
    return null;
  }
};

const hotelSaleDate = ref("");
// const currentMonth = () => {
//   const currentDate = new Date();
//   hotelSaleDate.value = dateFormat(currentDate);
//   const year = currentDate.getFullYear();
//   const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");

//   monthForGraph.value = `${year}-${month}`;
// };

const monthForGraph = ref("");

const todaySale = ref("");
const todayBookingCount = ref("");
const todayDate = ref(null);

const getTodayDate = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDate.getDate().toString().padStart(2, "0");

  todayDate.value = `${year}-${month}-${day}`;
  getSaleDate(todayDate.value);
};

// NEW: Function to get all agents' sales for a specific date
const getListCustomAdmin = () => {
  console.log(todayDate.value, saleDataAgent);

  if (!todayDate.value || !saleDataAgent.labels.length) {
    return [];
  }

  // Find the index of the selected date in labels
  const dateIndex = saleDataAgent.labels.findIndex(
    (label) => label === todayDate.value
  );

  if (dateIndex === -1) {
    console.log("Date not found in labels");
    return [];
  }

  // Extract data for each agent at this date index
  const agentSalesForDate = saleDataAgent.datasets.map((dataset) => ({
    name: dataset.label,
    sales: dataset.data[dateIndex] || 0,
    bookingCount: dataset.dataforFooter[dateIndex] || 0,
    color: dataset.backgroundColor[0],
  }));

  // Sort by sales amount (highest first)
  agentSalesForDate.sort((a, b) => b.sales - a.sales);

  console.log("Agent sales for", todayDate.value, agentSalesForDate);
  return agentSalesForDate;
};

// NEW: Reactive ref to store the list
const agentSalesListForDate = ref([]);

// NEW: Watch todayDate to update the list
watch(todayDate, () => {
  agentSalesListForDate.value = getListCustomAdmin();
});

// NEW: Also update when saleDataAgent changes
watch(
  () => saleDataAgent.datasets.length,
  () => {
    if (todayDate.value) {
      agentSalesListForDate.value = getListCustomAdmin();
    }
  }
);

watch(monthForGraph, async (newValue) => {
  getAllDays(monthForGraph.value);
});

// NEW: Watch includeAirline toggle
watch(includeAirline, async (newValue) => {
  console.log("Include airline:", newValue);
  getAllDays(monthForGraph.value);
});

onMounted(async () => {
  await authStore.getMe();
  getTodayDate();
  // currentMonth();
  getAllDays(monthForGraph.value);
});
</script>

<template>
  <div>
    <div v-if="!authStore.isSuperAdmin" class="text-center text-xs mt-20">
      You haven't permission on this page
    </div>
    <div class="px-4 space-y-4" v-if="authStore?.isSuperAdmin">
      <div class="flex justify-between items-center">
        <!-- Date Input Outside Box -->
        <div class="flex justify-end items-center gap-2">
          <input
            type="date"
            name=""
            v-model="todayDate"
            class="py-2 px-6 rounded-full text-xs border border-main"
            id=""
          />
          <MagnifyingGlassCircleIcon
            class="w-10 h-10 pt-1 text-main cursor-pointer"
            @click="getSaleDate(todayDate)"
          />
        </div>
        <!-- Include Airline Toggle -->
        <div class="flex justify-between items-center gap-x-2">
          Air : {{ includeAirline ? "Yes" : "No" }}
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              @click="includeAirline = !includeAirline"
              value=""
              class="sr-only peer"
            />
            <div
              class="w-11 h-6 bg-main peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-main peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-main peer-checked:bg-orange-600"
            ></div>
          </label>
        </div>
      </div>

      <!-- Carousel Container with Swipe Support -->
      <div class="relative">
        <div
          class="bg-main rounded-3xl pt-3 pb-4 pr-3 pl-6 overflow-hidden cursor-grab active:cursor-grabbing select-none"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
          @mousedown="handleMouseDown"
          @mousemove="handleMouseMove"
          @mouseup="handleMouseUp"
          @mouseleave="handleMouseLeave"
        >
          <!-- Carousel Slides -->
          <div class="relative">
            <div
              class="flex transition-transform duration-300 ease-in-out"
              :style="{ transform: `translateX(-${carouselIndex * 100}%)` }"
            >
              <!-- Slide 1: Overview -->
              <div class="min-w-full space-y-6 px-3">
                <p class="text-white text-xs">Overview</p>
                <div class="space-y-2">
                  <p
                    class="text-white text-5xl font-semibold"
                    v-if="includeAirline"
                  >
                    {{
                      formattedTotal(reservation_data?.data?.reservation_total)
                    }}
                  </p>
                  <p
                    class="text-white text-5xl font-semibold"
                    v-if="!includeAirline"
                  >
                    {{
                      formattedTotal(
                        reservation_data?.data?.reservation_total -
                          airline_minus
                      )
                    }}
                  </p>
                  <p class="text-white text-xl font-semibold">
                    Total Sales Today
                  </p>
                </div>
                <div class="space-y-2">
                  <p class="text-white text-5xl font-semibold">
                    {{ todayBookingCount }}
                  </p>
                  <p class="text-white text-xl font-semibold">
                    Total Booking Today
                  </p>
                </div>
              </div>

              <!-- Slide 2: Each Agent Sales for Selected Date -->
              <div class="min-w-[100%] space-y-4 pl-3 pr-6">
                <div
                  v-if="agentSalesListForDate.length > 0"
                  class="space-y-3 min-h-[30vh] max-h-[30vh] overflow-y-auto"
                >
                  <p class="text-white text-xs">Sales by Agent</p>
                  <div
                    v-for="(agent, index) in agentSalesListForDate"
                    :key="index"
                    class="bg-white/10 rounded-lg p-3 backdrop-blur-sm"
                  >
                    <div class="flex justify-between items-center">
                      <div class="flex items-center gap-2">
                        <div
                          class="w-3 h-3 rounded-full"
                          :style="{ backgroundColor: agent.color }"
                        ></div>
                        <p class="text-white font-medium">{{ agent.name }}</p>
                      </div>
                      <div class="text-right">
                        <p class="text-white text-lg font-semibold">
                          {{ formattedTotal(agent.sales) }}
                        </p>
                        <p class="text-white/70 text-xs">
                          {{ agent.bookingCount }} bookings
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-else class="text-white text-center py-8">
                  <p>No sales data available for this date</p>
                </div>
              </div>

              <!-- Slide 3: Product Type Graph -->
              <div class="space-y-4 min-w-full pl-6">
                <p class="text-white text-xs">Product Type</p>
                <div
                  v-for="product in summary?.product_type_summary"
                  :key="product"
                >
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-sm text-white">{{
                      productType(product.product_type_name)
                    }}</span>
                    <span class="text-sm font-medium text-white/80"
                      >{{ product.percentage }}%</span
                    >
                  </div>
                  <div class="w-full bg-black/20 rounded-full h-2">
                    <div
                      class="h-2 rounded-full transition-all duration-300"
                      :style="{
                        width: product.percentage + '%',
                        backgroundColor: '#FFFFFF',
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Carousel Indicators -->
        <div class="flex justify-center gap-2 mt-4">
          <button
            v-for="i in totalCarouselPages"
            :key="i"
            @click="goToSlide(i - 1)"
            class="w-2 h-2 rounded-full transition-all"
            :class="carouselIndex === i - 1 ? 'bg-main w-8' : 'bg-black/30'"
          ></button>
        </div>
      </div>

      <!-- Sale Graph -->
      <div v-if="reservation_data">
        <SaleGraphVue :data="reservation_data" />
      </div>

      <!-- Chart Section -->
      <div class="col-span-2 bg-white rounded-2xl h-auto pb-10">
        <div class="flex justify-between items-start p-4">
          <div class="flex justify-start items-center flex-wrap gap-3 pb-6">
            <select
              name=""
              id=""
              v-if="!priceSalesGraph"
              v-model="priceSalesGraphAgent"
              class="px-4 py-2 text-sm border border-main w-full rounded-2xl focus:outline-none"
            >
              <option value="" class="py-2">All</option>
              <option
                :value="a"
                class="py-2"
                v-for="(a, index) in AgentName ?? []"
                :key="index"
              >
                {{ a }}
              </option>
            </select>

            Sale Overview :
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                @click="togglePriceSalesGraph"
                value=""
                class="sr-only peer"
              />
              <div
                class="w-11 h-6 bg-main peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-main peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-main peer-checked:bg-orange-600"
              ></div>
            </label>
            : Agent Sales
          </div>
        </div>
        <LineChart :chartData="saleData" v-if="priceSalesGraph == '1'" />
        <LineChart
          :chartData="saleDataAgent"
          :options="saleDataAgentOption"
          v-if="priceSalesGraph == '0' && priceSalesGraphAgent == ''"
        />
      </div>
    </div>
  </div>
</template>
