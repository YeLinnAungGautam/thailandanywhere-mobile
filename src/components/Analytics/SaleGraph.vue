<script setup>
import { BarChart, LineChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const saleData = {
  labels: ["Paris", "Nîmes", "Toulon", "Perpignan", "Autre"],
  datasets: [
    {
      label: "Sales",
      data: [3000, 4000, 6000, 5000, 2000],
      backgroundColor: ["#FF6300"],
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
</script>

<template>
  <div>
    <LineChart :chartData="saleData" />
  </div>
</template>
