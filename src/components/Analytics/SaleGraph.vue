<script setup>
import { DoughnutChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);
import { ref, onMounted, defineProps, watch, reactive } from "vue";

const props = defineProps({
  data: Object,
});

const todaySale = ref(0);
const totalArray = ref(null);
const airlineCount = ref(0);

const getCount = async () => {
  console.log(props.data.data, "this is data");
  // Step 3: Calculate the percentage contribution of each Product 3 item to the total sales

  if (props.data != undefined) {
    const productTypeMap = {};

    // Step 2: Aggregate selling prices by product_type
    props?.data?.data.reservations.forEach((item) => {
      const { product_type, amount } = item;
      if (
        !productTypeMap[product_type] &&
        product_type != "App\\Models\\Airline"
      ) {
        productTypeMap[product_type] = 0;
      }
      productTypeMap[product_type] += amount * 1;
    });

    console.log(productTypeMap);

    // Step 3: Calculate total selling price across all product types
    const totalSellingPrice = Object.values(productTypeMap).reduce(
      (total, amount) => total + amount,
      0
    );

    // Step 4: Calculate percentages and log results
    dataReportMethod.items.splice(0);
    dataReportMethodAmount.items.splice(0);
    Object.keys(productTypeMap).forEach((product_type) => {
      // const percent = (productTypeMap[product_type] / totalSellingPrice) * 100;
      // console.log(
      //   `${product_type} contributes ${percent.toFixed(
      //     2
      //   )}% to total selling price.`
      // );
      if (product_type != "App\\Models\\Airline") {
        dataReportMethod.items.push(product_type.split("\\").pop());
        dataReportMethodAmount.items.push(productTypeMap[product_type]);
      }
    });
  }
};

const todayDate = ref(null);

const dataReportMethod = reactive({ items: [] });
const dataReportMethodAmount = reactive({ items: [] });
const reportMethodData = {
  labels: dataReportMethod.items,
  datasets: [
    {
      label: "Percent Selling Product",
      data: dataReportMethodAmount.items,
      backgroundColor: [
        "rgb(232, 88, 0)",
        "rgb(255, 105, 14)",
        "rgb(255, 142, 74)",
        "rgb(255, 168, 115)",
        "rgb(255, 203, 171)",
      ],
      hoverOffset: 4,
    },
  ],
  options: {
    indexAxis: "y", // Display labels on the y-axis
    scales: {
      x: {
        position: "bottom", // Position x-axis at the bottom
      },
    },
  },
};

watch(
  () => props.data,
  (newValue) => {
    if (newValue !== undefined) {
      getCount();
    }
  }
);

// Execute getCount when the component is mounted
onMounted(() => {
  if (props.data !== undefined) {
    getCount();
  }
});
</script>

<template>
  <!-- & airline total
  is <span class="text-lg text-main">{{ airlineCount }} thb</span> -->
  <div class="bg-white p-3 border border-gray rounded-2xl shadow">
    <div class="text-xs font-medium pb-3">
      sale total with airline
      <span class="text-lg text-main"
        >{{ data?.data?.grand_total_amount }} thb</span
      >
      & total discount
      <span class="text-lg text-main"
        >{{ data?.data?.total_discount }} thb</span
      >
    </div>

    <DoughnutChart :chartData="reportMethodData" class="w-[400px]" />
  </div>
</template>
