<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { BarChart, LineChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);
import { useAuthStore } from "../../stores/auth";

import SaleGraphVue from "./SaleGraph.vue";
import { useHomeStore } from "../../stores/home";
import { MagnifyingGlassCircleIcon } from "@heroicons/vue/24/solid";

const homeStore = useHomeStore();
const authStore = useAuthStore();

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

  res.result.sales.forEach((sale, saleIndex) => {
    saleDataAgent.labels.push(sale.date);
    saleDataByAgent.labels.push(sale.date);

    // Get airline data for this day
    const airlineSaleForDay = res.result.airline_sales[saleIndex];

    if (sale.date == todayDate.value) {
      todaySale.value = 0;
      todayBookingCount.value = 0;
      let total = 0;
      let count = 0;

      for (let i = 0; i < sale.agents.length; i++) {
        let agentTotal = sale.agents[i].total;

        // Subtract airline for today's calculation if needed
        if (!includeAirline.value && airlineSaleForDay) {
          const airlineAgent = airlineSaleForDay.agents.find(
            (a) => a.name === sale.agents[i].name
          );
          if (airlineAgent) {
            agentTotal -= airlineAgent.total;
          }
        }

        total += agentTotal;
        count += sale.agents[i].total_count;
      }
      todaySale.value = total;
      todayBookingCount.value = count;
    }

    sale.agents.forEach((agent, index) => {
      // Find matching airline agent data
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

      // Calculate final values
      let finalTotal = agent.total;
      let finalDeposit = agent.total_deposit;
      let finalBalance = agent.total_balance;

      // Subtract airline if includeAirline is false
      if (!includeAirline.value) {
        finalTotal -= airlineAgentTotal;
        finalDeposit -= airlineAgentDeposit;
        finalBalance -= airlineAgentBalance;
      }

      // Only add agent to list and graph if they have sales (after airline subtraction)
      if (finalTotal > 0 || includeAirline.value) {
        const existingAgent = AgentName.value.find((a) => a === agent.name);
        if (!existingAgent) {
          AgentName.value.push(agent.name);
        }

        const existingDataset = saleDataAgent.datasets.find(
          (dataset) => dataset.label === agent.name
        );

        if (existingDataset) {
          existingDataset.data.push(finalTotal);
          existingDataset.dataforFooter.push(agent.total_count);
        } else {
          saleDataAgent.datasets.push({
            label: agent.name,
            data: [finalTotal],
            dataforFooter: [agent.total_count],
            backgroundColor: [agentColors[index % agentColors.length]],
            type: "line",
          });
        }

        if (priceSalesGraphAgent.value != "") {
          if (agent.name == priceSalesGraphAgent.value) {
            totalByAgent.items.push(finalTotal);
            paidByAgent.items.push(finalDeposit);
            notPaidAgent.items.push(finalBalance);
            saleDataByAgent.datasets[0].footerForCount.push(agent.total_count);
            console.log(agent.total_count);
          }
        }
      }
    });
  });
  console.log(saleDataAgent);
};

// ... rest of your code remains the same ...

const reservation_data = ref("");
const airline_minus = ref("");
const getSaleDate = async (date) => {
  console.log("====================================");
  console.log(date);
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
const currentMonth = () => {
  const currentDate = new Date();
  hotelSaleDate.value = dateFormat(currentDate);
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");

  monthForGraph.value = `${year}-${month}`;
};

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
  currentMonth();
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
        Include airline : {{ includeAirline ? "Yes" : "No" }}
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
      <div class="bg-main rounded-3xl pt-3 pb-4 pr-3 pl-6 space-y-6">
        <div class="flex justify-between items-center">
          <p class="text-white text-xs">Overview</p>
          <div class="flex justify-end items-center gap-2">
            <input
              type="date"
              name=""
              v-model="todayDate"
              class="py-2 px-6 rounded-full text-xs"
              id=""
            />
            <MagnifyingGlassCircleIcon
              class="w-8 h-8 pt-1 text-white cursor-pointer"
              @click="getSaleDate(todayDate)"
            />
          </div>
        </div>
        <div class="space-y-2">
          <p class="text-white text-5xl font-semibold" v-if="includeAirline">
            {{ formattedTotal(reservation_data?.data?.reservation_total) }}
          </p>
          <p class="text-white text-5xl font-semibold" v-if="!includeAirline">
            {{
              formattedTotal(
                reservation_data?.data?.reservation_total - airline_minus
              )
            }}
          </p>
          <p class="text-white text-xl font-semibold">Total Sales Today</p>
        </div>
        <div class="space-y-2">
          <p class="text-white text-5xl font-semibold">
            {{ todayBookingCount }}
          </p>
          <p class="text-white text-xl font-semibold">Total Booking Today</p>
        </div>
      </div>
      <div v-if="reservation_data">
        <SaleGraphVue :data="reservation_data" />
      </div>
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

            <input
              type="month"
              name=""
              v-model="monthForGraph"
              class="bg-white text-sm w-[200px] border border-main rounded-2xl px-2 py-2"
              id=""
            />
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
          </div>
        </div>
        <LineChart :chartData="saleData" v-if="priceSalesGraph == '1'" />
        <LineChart
          :chartData="saleDataAgent"
          :options="saleDataAgentOption"
          v-if="priceSalesGraph == '0' && priceSalesGraphAgent == ''"
        />
        <LineChart
          :chartData="saleDataByAgent"
          :options="saleDataByAgentOption"
          v-if="priceSalesGraph == '0' && priceSalesGraphAgent != ''"
        />
      </div>
    </div>
  </div>
</template>
