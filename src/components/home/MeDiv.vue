<script setup>
import { storeToRefs } from "pinia";
import { onMounted, ref, watch, computed } from "vue";
import { useAuthStore } from "../../stores/auth";
import { useAdminStore } from "../../stores/admin";
import { useHomeStore } from "../../stores/home";
// import { useCustomizeStore } from "../../stores/customize";
import { customData, updateCustomData } from "../../assets/customDb";
import { ArrowUpTrayIcon } from "@heroicons/vue/24/solid";

const authStore = useAuthStore();
const adminStore = useAdminStore();
const homeStore = useHomeStore();
// const customizeStore = useCustomizeStore();
// const { custom } = storeToRefs(customizeStore);

const showCustomize = ref(false);
const customizeFunction = () => {
  showCustomize.value = !showCustomize.value;
};
const customDataForm = ref({
  yes: null,
  getting_close: null,
  keep_going: null,
  avg_yes: null,
  avg_getting_close: null,
  avg_keep_going: null,
});
const getCustomData = () => {
  customDataForm.value = {
    yes: customData.yes,
    getting_close: customData.getting_close,
    keep_going: customData.keep_going,
    avg_yes: customData.avg_yes,
    avg_getting_close: customData.avg_getting_close,
    avg_keep_going: customData.avg_keep_going,
  };
  console.log("====================================");
  console.log(customDataForm.value, "this is custom data");
  console.log("====================================");
};

const updateData = (key, value) => {
  updateCustomData(key, value);
  console.log("====================================");
  console.log(customData);
  console.log("====================================");
};

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
      if (todaySale.value >= customData.yes) {
        target.value = "YES";
      } else if (todaySale.value >= customData.getting_close) {
        target.value = "Getting Close!";
      } else if (todaySale.value >= customData.keep_going) {
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
    if (average >= customData.avg_yes) {
      return "YES";
    } else if (average >= customData.avg_getting_close) {
      return "Getting Close!";
    } else if (average >= customData.avg_keep_going) {
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
        // if (todaySale.value >= 160000) {
        //   target.value = "YES";
        // } else if (todaySale.value >= 120000) {
        //   target.value = "Getting Close!";
        // } else if (todaySale.value >= 90000) {
        //   target.value = "Keep Going!";
        // } else {
        //   target.value = "Long Way to Go!!";
        // }
        if (todaySale.value >= customData.yes) {
          target.value = "YES";
        } else if (todaySale.value >= customData.getting_close) {
          target.value = "Getting Close!";
        } else if (todaySale.value >= customData.keep_going) {
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
  await getCustomData();

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
    class="mx-4 my-4 bg-gradient-to-l to-main from-[#ff960d] drop-shadow px-10 relative grid grid-cols-2 gap-2 rounded-lg"
  >
    <div class="relative z-10">
      <p class="text-white pt-8 font-semibold">{{ user?.name }}</p>
      <p class="text-white/80 text-xs">{{ user?.role }}</p>
      <p class="text-xs text-white mt-4" v-if="!authStore.isAgent">
        Today Ranking # <span class="text-base">{{ rank }}</span>
      </p>

      <p class="text-xs text-white mt-10 pb-8" v-if="authStore.isAgent"></p>
    </div>
    <button
      @click="customizeFunction"
      class="absolute top-2 right-2 bg-white z-30 text-xs px-2 py-1 rounded-xl"
    >
      {{ showCustomize ? "customize close" : "customize open" }}
    </button>
    <div
      v-if="showCustomize"
      class="bg-white rounded-lg p-4 border border-main shadow w-full absolute top-0 space-y-2 left-0 z-50"
    >
      <p class="text-sm font-semibold">company target achieved amount</p>
      <div class="flex justify-between items-center">
        <label for="company target achieved" class="text-sm"> yes </label>
        <div class="flex justify-end items-center gap-1">
          <input
            type="number"
            v-model="customData.yes"
            class="bg-white focus:outline-none border-main border px-4 py-1 text-sm rounded-lg"
          />
          <p
            class="px-1.5 bg-main text-white py-1.5 text-center rounded-lg text-sm"
          >
            <ArrowUpTrayIcon
              class="w-4 h-4"
              @click="updateData('yes', customData.yes)"
            />
          </p>
        </div>
      </div>
      <div class="flex justify-between items-center">
        <label for="company target achieved" class="text-sm">
          getting close
        </label>
        <div class="flex justify-end items-center gap-1">
          <input
            type="number"
            v-model="customData.getting_close"
            class="bg-white focus:outline-none border-main border px-4 py-1 text-sm rounded-lg"
          />
          <p
            class="px-1.5 bg-main text-white py-1.5 text-center rounded-lg text-sm"
          >
            <ArrowUpTrayIcon class="w-4 h-4" />
          </p>
        </div>
      </div>
      <div class="flex justify-between items-center border-b border-main pb-3">
        <label for="company target achieved" class="text-sm">
          keep going
        </label>
        <div class="flex justify-end items-center gap-1">
          <input
            type="number"
            v-model="customData.keep_going"
            class="bg-white focus:outline-none border-main border px-4 py-1 text-sm rounded-lg"
          />
          <p
            class="px-1.5 bg-main text-white py-1.5 text-center rounded-lg text-sm"
          >
            <ArrowUpTrayIcon class="w-4 h-4" />
          </p>
        </div>
      </div>
      <p class="text-sm font-semibold">monthly average target amount</p>
      <div class="flex justify-between items-center">
        <label for="company target achieved" class="text-sm"> yes </label>
        <div class="flex justify-end items-center gap-1">
          <input
            type="number"
            v-model="customData.avg_yes"
            class="bg-white focus:outline-none border-main border px-4 py-1 text-sm rounded-lg"
          />
          <p
            class="px-1.5 bg-main text-white py-1.5 text-center rounded-lg text-sm"
          >
            <ArrowUpTrayIcon class="w-4 h-4" />
          </p>
        </div>
      </div>
      <div class="flex justify-between items-center">
        <label for="company target achieved" class="text-sm">
          getting close
        </label>
        <div class="flex justify-end items-center gap-1">
          <input
            type="number"
            v-model="customData.avg_getting_close"
            class="bg-white focus:outline-none border-main border px-4 py-1 text-sm rounded-lg"
          />
          <p
            class="px-1.5 bg-main text-white py-1.5 text-center rounded-lg text-sm"
          >
            <ArrowUpTrayIcon class="w-4 h-4" />
          </p>
        </div>
      </div>
      <div class="flex justify-between items-center">
        <label for="company target achieved" class="text-sm">
          keep going
        </label>
        <div class="flex justify-end items-center gap-1">
          <input
            type="number"
            v-model="customData.avg_keep_going"
            class="bg-white focus:outline-none border-main border px-4 py-1 text-sm rounded-lg"
          />
          <p
            class="px-1.5 bg-main text-white py-1.5 text-center rounded-lg text-sm"
          >
            <ArrowUpTrayIcon class="w-4 h-4" />
          </p>
        </div>
      </div>
      <div class="flex justify-end items-center gap-2">
        <p
          @click="showCustomize = !showCustomize"
          class="px-2 bg-white border border-main py-1.5 text-center rounded-lg text-sm"
        >
          close
        </p>
      </div>
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
      v-if="user?.role == 'admin'"
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
