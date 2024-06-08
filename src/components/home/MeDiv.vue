<script setup>
import { storeToRefs } from "pinia";
import { onMounted, ref, watch } from "vue";
import { useAuthStore } from "../../stores/auth";
import { useAdminStore } from "../../stores/admin";
import { useHomeStore } from "../../stores/home";

const authStore = useAuthStore();
const adminStore = useAdminStore();
const homeStore = useHomeStore();

const { user } = storeToRefs(authStore);

const getMeHandle = async () => {
  const res = await authStore.getMe();
};

const rank = ref("");
const getRank = async () => {
  const res = await adminStore.rankAction();
  console.log(res.result.rank);
  rank.value = res.result.rank;
};

const allSaleResponse = ref(null);

const getAllDays = async (monthGet) => {
  console.log(monthGet, "this is month");
  const res = await homeStore.getTimeFilterArray(monthGet);
  allSaleResponse.value = res.result;

  res.result.sales.forEach((sale) => {
    if (sale.date == todayDate.value) {
      todaySale.value = 0;
      let total = 0;
      let count = 0;
      for (let i = 0; i < sale.agents.length; i++) {
        total += sale.agents[i].total;
        count += sale.agents[i].total_count;
      }
      todaySale.value = total;
      if (todaySale.value >= 150000) {
        target.value = "YES";
      } else if (todaySale.value >= 120000) {
        target.value = "Getting Close!";
      } else if (todaySale.value >= 90000) {
        target.value = "Keep Going!";
      } else {
        target.value = "Long Way to Go!!";
      }
    }
  });
};

const getSaleDate = (date) => {
  if (allSaleResponse.value) {
    allSaleResponse?.value.sales.forEach((sale) => {
      if (sale.date == todayDate.value) {
        todaySale.value = 0;
        let total = 0;
        let count = 0;
        for (let i = 0; i < sale.agents.length; i++) {
          total += sale.agents[i].total;
        }
        todaySale.value = total;
        if (todaySale.value >= 150000) {
          target.value = "YES";
        } else if (todaySale.value >= 120000) {
          target.value = "Getting Close!";
        } else if (todaySale.value >= 90000) {
          target.value = "Keep Going!";
        } else {
          target.value = "Long Way to Go!!";
        }
      }
    });
  }
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
const todayDate = ref(null);
const target = ref("");

const getTodayDate = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDate.getDate().toString().padStart(2, "0");

  todayDate.value = `${year}-${month}-${day}`;
  getSaleDate(todayDate.value);
};

onMounted(async () => {
  await authStore.getMe();
  await getMeHandle();
  await getRank();
  console.log(user.value);
  getTodayDate();
  currentMonth();
  getAllDays(monthForGraph.value);
});
</script>

<template>
  <div
    class="mx-4 my-4 bg-gradient-to-l to-[#f89007] overflow-hidden from-main drop-shadow px-10 relative grid grid-cols-2 gap-2 rounded-lg"
  >
    <div>
      <p class="text-white pt-10 font-semibold">{{ user?.name }}</p>
      <p class="text-white/80 text-sm">{{ user?.role }}</p>
      <p class="text-xs text-white mt-10" v-if="!authStore.isAgent">
        Today Ranking # <span class="text-base">{{ rank }}</span>
      </p>

      <p class="text-xs text-white mt-10 pb-8" v-if="authStore.isAgent"></p>
    </div>
    <!-- <div class="flex justify-center items-center">
      <img
        src="../../../public/logo.jpg"
        class="w-[100px] mt-4 h-[100px] object-cover rounded-full"
        alt=""
      />
    </div> -->
    <div
      class="text-xs text-white flex justify-between items-center col-span-2 mt-2 w-full pb-8 relative z-10"
    >
      <p>Company Target Achieved :</p>
      <p
        class="text-sm px-2 py-1 rounded-lg bg-green/20 whitespace-nowrap"
        :class="{
          'bg-green': target == 'YES',
          'bg-green/30': target == 'Getting Close!',
          'bg-yellow/50': target == 'Keep Going!',
          'bg-red/30': target == 'Long Way to Go!!',
        }"
      >
        {{ target }}
      </p>
    </div>
  </div>
</template>
