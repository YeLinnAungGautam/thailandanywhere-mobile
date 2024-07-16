<script setup>
import { DoughnutChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);
import { useReservationStore } from "../../stores/reservation";
import { ref, onMounted, defineProps, watch, reactive } from "vue";

const props = defineProps({
  date: String,
});

const reservationStore = useReservationStore();

const todaySale = ref(0);
const totalArray = ref(null);
const airlineCount = ref(0);

const daysBetween = (a, b) => {
  if (a && b) {
    const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    const startDateTimestamp = new Date(a).getTime();
    const endDateTimestamp = new Date(b).getTime();
    let result = Math.abs(
      Math.round((endDateTimestamp - startDateTimestamp) / oneDay)
    );
    console.log("====================================");
    console.log(result);
    console.log("====================================");
    return result;
  } else {
    return 1;
  }
};

const getCount = async (date) => {
  let data = {
    booking_date: date,
    limit: 1000,
  };
  const res = await reservationStore.getListCountAction(data);
  console.log("====================================");
  console.log(res.result.data, "this is count");
  console.log("====================================");

  // Step 1: Filter out products that are not Product 3
  let totalItems = res.result.data.filter(
    (item) => item.product_type != "App\\Models\\Airline"
  );

  let totalItemsAirline = res.result.data.filter(
    (item) => item.product_type == "App\\Models\\Airline"
  );
  console.log(totalItemsAirline, "this is airline");

  console.log("====================================");
  console.log(totalItems, "this is total");
  console.log("====================================");

  // Step 2: Calculate the total sales for today
  todaySale.value = 0;

  let totalItemsSellingPrice = 0;
  for (let item of totalItems) {
    totalItemsSellingPrice +=
      item.selling_price *
      item.quantity *
      daysBetween(item.checkin_date, item.checkout_date);
  }

  airlineCount.value = 0;
  // airlineCount.value = totalItemsAirline.reduce((total, item) => {
  //   return total + item.selling_price * item.quantity;
  // }, 0);
  for (let item of totalItemsAirline) {
    airlineCount.value +=
      item.selling_price *
      item.quantity *
      daysBetween(item.checkin_date, item.checkout_date);
  }

  console.log("Total Selling Price for Product 3:", totalItemsSellingPrice);
  todaySale.value = totalItemsSellingPrice;
  // Step 3: Calculate the percentage contribution of each Product 3 item to the total sales

  const productTypeMap = {};

  // Step 2: Aggregate selling prices by product_type
  totalItems.forEach((item) => {
    const {
      product_type,
      selling_price,
      quantity,
      checkin_date,
      checkout_date,
    } = item;
    if (!productTypeMap[product_type]) {
      productTypeMap[product_type] = 0;
    }
    productTypeMap[product_type] +=
      selling_price * quantity * daysBetween(checkin_date, checkout_date);
  });

  // Step 3: Calculate total selling price across all product types
  const totalSellingPrice = Object.values(productTypeMap).reduce(
    (total, selling_price, quantity, checkin_date, checkout_date) =>
      total +
      selling_price * quantity * daysBetween(checkin_date, checkout_date),
    0
  );

  // Step 4: Calculate percentages and log results
  dataReportMethod.items.splice(0);
  dataReportMethodAmount.items.splice(0);
  Object.keys(productTypeMap).forEach((product_type) => {
    const percent = (productTypeMap[product_type] / totalSellingPrice) * 100;
    console.log(
      `${product_type} contributes ${percent.toFixed(
        2
      )}% to total selling price.`
    );
    dataReportMethod.items.push(product_type.split("\\").pop());
    dataReportMethodAmount.items.push(percent.toFixed(2));
  });
};

const todayDate = ref(null);

const getTodayDate = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDate.getDate().toString().padStart(2, "0");

  todayDate.value = `${year}-${month}-${day}`;
  getCount(todayDate.value);
};

watch(
  () => props.date,
  (newDate, oldDate) => {
    console.log(`Date prop changed from ${oldDate} to ${newDate}`);
    // Perform any other logic based on the prop change
    getCount(newDate);
  }
);

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

onMounted(() => {
  getTodayDate();
});
</script>

<template>
  <!-- & airline total
  is <span class="text-lg text-main">{{ airlineCount }} thb</span> -->
  <div class="bg-white p-3 border border-gray rounded-2xl shadow">
    <div class="text-xs font-medium pb-3">
      {{ props.date }} sale total without airline
      <span class="text-lg text-main">{{ todaySale }} thb</span>
    </div>

    <DoughnutChart :chartData="reportMethodData" class="w-[400px]" />
  </div>
</template>
