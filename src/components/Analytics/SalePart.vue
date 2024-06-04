<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { BarChart, LineChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

import SaleGraphVue from "./SaleGraph.vue";
import { useHomeStore } from "../../stores/home";

const homeStore = useHomeStore();

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
      backgroundColor: "rgb(255, 87, 51)", // Set background color for dataset 1
      borderColor: "rgb(255, 87, 51)",
      borderWidth: 1,
    },
    {
      label: "Fully Paid",
      type: "bar",
      data: dataPaid.items,
      backgroundColor: "rgb(17, 223, 0)", // Set background color for dataset 2
      borderColor: "rgb(17, 223, 0)",
      borderWidth: 1,
    },
    {
      label: "Not Paid",
      type: "bar",
      data: dataNotPaid.items,
      backgroundColor: "rgb(223, 0, 0 )", // Set background color for dataset 3
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

const saleDataAgent = {
  labels: [],
  datasets: [],
};

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
      backgroundColor: "rgb(255, 87, 51)", // Set background color for dataset 1
      borderColor: "rgb(255, 87, 51)",
      borderWidth: 1,
    },
    {
      label: "Fully Paid",
      type: "bar",
      data: paidByAgent.items,
      backgroundColor: "rgb(17, 223, 0)", // Set background color for dataset 2
      borderColor: "rgb(17, 223, 0)",
      borderWidth: 1,
    },
    {
      label: "Not Paid",
      type: "bar",
      data: notPaidAgent.items,
      backgroundColor: "rgb(223, 0, 0 )", // Set background color for dataset 3
      borderColor: "rgb(223, 0, 0 )",
      borderWidth: 1,
    },
  ],
};

const getAllDays = async (monthGet) => {
  console.log(monthGet, "this is month");
  const res = await homeStore.getTimeFilterArray(monthGet);
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

  for (let x = 0; x < res.result.sales.length; x++) {
    let dataArr = 0;
    let dataPaidArr = 0;
    let dataNotPaidArr = 0;

    for (let i = 0; i < res.result.sales[x].agents.length; i++) {
      dataArr += res.result.sales[x].agents[i].total;
    }
    for (let i = 0; i < res.result.sales[x].agents.length; i++) {
      dataPaidArr += res.result.sales[x].agents[i].total_deposit;
    }
    for (let i = 0; i < res.result.sales[x].agents.length; i++) {
      dataNotPaidArr += res.result.sales[x].agents[i].total_balance;
    }
    dataAmount.items.push(dataArr);
    dataPaid.items.push(dataPaidArr);
    dataNotPaid.items.push(dataNotPaidArr);
    dataTest.items.push(res.result.sales[x].date);
  }
  saleDataAgent.datasets = [];
  saleDataAgent.labels = [];

  saleDataByAgent.labels = [];
  totalByAgent.items.splice(0);
  paidByAgent.items.splice(0);
  notPaidAgent.items.splice(0);
  saleDataByAgent.datasets.footerForCount = [];

  res.result.sales.forEach((sale) => {
    saleDataAgent.labels.push(sale.date);
    saleDataByAgent.labels.push(sale.date);

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

    sale.agents.forEach((agent, index) => {
      // AgentName.value.push(agent.name);
      const existingAgent = AgentName.value.find((a) => a === agent.name);
      if (!existingAgent) {
        AgentName.value.push(agent.name);
      }

      const existingDataset = saleDataAgent.datasets.find(
        (dataset) => dataset.label === agent.name
      );

      if (existingDataset) {
        existingDataset.data.push(agent.total);
        existingDataset.dataforFooter.push(agent.total_count);
      } else {
        saleDataAgent.datasets.push({
          label: agent.name,
          data: [agent.total],
          dataforFooter: [agent.total_count],
          backgroundColor: [agentColors[index]],
          type: "line",
        });
      }

      if (priceSalesGraphAgent.value != "") {
        if (agent.name == priceSalesGraphAgent.value) {
          totalByAgent.items.push(agent.total);
          paidByAgent.items.push(agent.total_deposit);
          notPaidAgent.items.push(agent.total_balance);
          saleDataByAgent.datasets[0].footerForCount.push(agent.total_count);
          console.log(agent.total_count);
        }
      }
    });
  });
  console.log(saleDataAgent);
};

const dateFormat = (inputDateString) => {
  if (inputDateString != null) {
    const inputDate = new Date(inputDateString);

    // Get the year, month, and day components
    const year = inputDate.getFullYear();
    const month = String(inputDate.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-based
    const day = String(inputDate.getDate()).padStart(2, "0");

    // Format the date in "YYYY-MM-DD" format
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
const todayDate = ref("");

const getTodayDate = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDate.getDate().toString().padStart(2, "0");

  todayDate.value = `${year}-${month}-${day}`;
};

watch(monthForGraph, async (newValue) => {
  getAllDays(monthForGraph.value);
});

onMounted(() => {
  currentMonth();
  getAllDays(monthForGraph.value);
  getTodayDate();
});
</script>

<template>
  <div class="px-4 space-y-4">
    <div class="bg-main rounded-3xl pt-3 pb-4 pr-3 pl-6 space-y-6">
      <div class="flex justify-between items-center">
        <p class="text-white text-xs">Overview</p>
        <p class="text-black px-6 py-2 bg-white rounded-full text-xs">
          {{ todayDate }}
        </p>
      </div>
      <div class="space-y-2">
        <p class="text-white text-5xl font-semibold">{{ todaySale }}</p>
        <p class="text-white text-xl font-semibold">Total Sales Today</p>
      </div>
      <div class="space-y-2">
        <p class="text-white text-5xl font-semibold">{{ todayBookingCount }}</p>
        <p class="text-white text-xl font-semibold">Total Booking Today</p>
      </div>
    </div>
    <!-- <div>
      <SaleGraphVue />
    </div> -->
    <div class="col-span-2 bg-white rounded-2xl h-auto pb-10">
      <div class="flex justify-between items-start">
        <div class="flex justify-start items-center flex-wrap gap-3 pb-6">
          <select
            name=""
            id=""
            v-if="!priceSalesGraph"
            v-model="priceSalesGraphAgent"
            class="px-4 py-2 text-sm border border-main w-full rounded-2xl focus:outline-none"
          >
            <option value="" class="py-2">All</option>
            <!-- AgentName -->
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
</template>
