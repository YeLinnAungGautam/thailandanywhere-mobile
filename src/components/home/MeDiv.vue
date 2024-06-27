<script setup>
import { storeToRefs } from "pinia";
import { onMounted, ref, watch, computed } from "vue";
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
const personal_ache = ref("");

const getAllDays = async (monthGet) => {
  console.log(monthGet, "this is month");
  const res = await homeStore.getTimeFilterArray(monthGet);
  console.log(res, "this is res");
  allSaleResponse.value = res.result;
  thisMonthGetSaleAverage.value.splice = 0;
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
      if (todaySale.value >= 160000) {
        target.value = "YES";
      } else if (todaySale.value >= 120000) {
        target.value = "Getting Close!";
      } else if (todaySale.value >= 90000) {
        target.value = "Keep Going!";
      } else {
        target.value = "Long Way to Go!!";
      }

      sale.agents.forEach((data) => {
        // console.log(data, "this is agents for today");
        if (data.name == user.value.name) {
          if (data.total >= user_target.value) {
            personal_ache.value = "YES";
          } else {
            personal_ache.value = "Keep Going!";
          }
        }
      });
    }
  });
  for (let x = 0; x < res.result.sales.length; x++) {
    let dataArr = 0;

    for (let i = 0; i < res.result.sales[x].agents.length; i++) {
      dataArr += res.result.sales[x].agents[i].total;
    }
    thisMonthGetSaleAverage.value.push(dataArr);
  }
};

const thisMonthGetSaleAverage = ref([]);

const totalSaleForShow = computed(() => {
  if (thisMonthGetSaleAverage.value.length > 0) {
    let total = 0;
    for (let i = 0; i < thisMonthGetSaleAverage.value.length; i++) {
      total += thisMonthGetSaleAverage.value[i];
    }
    return total;
  }
  return 0;
});

const getThisMonthAverage = computed(() => {
  if (totalSaleForShow.value) {
    const today = new Date().getDate();
    let average = totalSaleForShow.value / today;
    // return average;
    if (average >= 160000) {
      return "YES";
    } else if (average >= 120000) {
      return "Getting Close!";
    } else if (average >= 90000) {
      return "Keep Going!";
    } else {
      return "Long Way to Go!!";
    }
  }
  return 0;
});

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
        if (todaySale.value >= 160000) {
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

const user_target = ref("");

onMounted(async () => {
  // await authStore.getMe();
  await getMeHandle();
  await getRank();
  console.log(user.value);
  getTodayDate();
  currentMonth();
  getAllDays(monthForGraph.value);
  user_target.value = user.value.target_amount;
  console.log(user_target.value, "this is target amount");
});
</script>

<template>
  <div
    class="mx-4 my-4 bg-gradient-to-l to-main overflow-hidden from-[#ff960d] drop-shadow px-10 relative grid grid-cols-2 gap-2 rounded-lg"
  >
    <div class="relative z-10">
      <p class="text-white pt-8 font-semibold">{{ user?.name }}</p>
      <p class="text-white/80 text-xs">{{ user?.role }}</p>
      <p class="text-xs text-white mt-4" v-if="!authStore.isAgent">
        Today Ranking # <span class="text-base">{{ rank }}</span>
      </p>

      <p class="text-xs text-white mt-10 pb-8" v-if="authStore.isAgent"></p>
    </div>
    <div class="absolute bottom-0 opacity-20 w-full h-[400px] z-0">
      <img
        src="https://static.vecteezy.com/system/resources/thumbnails/000/570/746/small_2x/1542.jpg"
        class="w-full h-full object-cover"
        alt=""
      />
    </div>
    <div
      class="text-xs space-y-2 text-white col-span-2 mt-2 w-full pb-2 relative z-10 flex justify-between items-center gap-2"
    >
      <p>Company Target Achieved :</p>
      <p
        class="text-xs px-2 py-1 rounded-lg inline-block whitespace-nowrap"
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
    <div
      class="text-xs space-y-2 text-white col-span-2 mt-2 w-full pb-2 relative z-10 flex justify-between items-center gap-2"
      v-if="user.role == 'admin'"
    >
      <p>Personal Achieved :</p>
      <p
        class="text-xs px-2 py-1 rounded-lg inline-block whitespace-nowrap"
        :class="{
          'bg-green': personal_ache == 'YES',
          'bg-yellow/50': personal_ache == 'Keep Going!',
        }"
      >
        {{ personal_ache }}
      </p>
    </div>
    <div
      class="text-xs space-y-2 text-white col-span-2 mt-2 w-full pb-8 relative z-10 flex justify-between items-center gap-2"
    >
      <p>Monthly Average Target :</p>
      <p
        class="text-xs px-2 py-1 rounded-lg inline-block whitespace-nowrap"
        :class="{
          'bg-green': getThisMonthAverage == 'YES',
          'bg-green/30': getThisMonthAverage == 'Getting Close!',
          'bg-yellow/50': getThisMonthAverage == 'Keep Going!',
          'bg-red/30': getThisMonthAverage == 'Long Way to Go!!',
        }"
      >
        {{ getThisMonthAverage }}
      </p>
    </div>
  </div>
</template>
