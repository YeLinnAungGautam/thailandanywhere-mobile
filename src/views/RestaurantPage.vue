<script setup>
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import NavbarVue from "../components/Navbar.vue";
import { useRestaurantStore } from "../stores/restaurant";
import Pagination from "../components/Pagination.vue";
import RestaurantItemVue from "../components/RestaurantItem.vue";
import { useCityStore } from "../stores/city";
import NoDataPageVue from "../components/NoDataPage.vue";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const restaurantStore = useRestaurantStore();
const cityStore = useCityStore();
const authStore = useAuthStore();

const { restaurants, restaurant, loading } = storeToRefs(restaurantStore);
const { cities } = storeToRefs(cityStore);

const chooseType = ref([]);
const choosePlace = ref([]);

const goRoom = (id) => {
  router.push({
    name: "room",
    params: {
      id: id,
    },
  });
};
const goBack = () => {
  router.go(-1);
};
const createPage = () => {
  router.push({ name: "restaurant-create" });
};

const changePage = async (url) => {
  console.log(url);
  // let data = {
  //   search: search.value,
  //   max_price: price.value,
  //   city_id: city_id.value,
  //   place: place.value,
  // };
  await restaurantStore.getChangePage(url, watchSystem.value);
  // window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
};

const getList = async () => {
  const res = await restaurantStore.getSimpleListAction();

  for (let i = 0; i < res.result.data.length; i++) {
    chooseType.value.push(res.result.data[i].name);
  }
  for (let i = 0; i < res.result.data.length; i++) {
    choosePlace.value.push(res.result.data[i].place);
  }
};

const priceShow = ref(false);
const price = ref("");
const search = ref("");
const city_id = ref("");
const place = ref("");
const clear = () => {
  search.value = "";
  price.value = "";
  priceShow.value = false;
  city_id.value = "";
  place.value = "";
};

const changes = async (message) => {
  if ((message = "Hotel Deleted")) {
    search.value = "";
    await getList();
    await restaurantStore.getListAction();
  }
};

const watchSystem = computed(() => {
  const result = {};

  if (search.value != "" && search.value != undefined) {
    result.search = search.value;
  }
  if (price.value != "" && price.value != undefined) {
    result.max_price = price.value;
  }
  if (city_id.value != "" && city_id.value != undefined) {
    result.city_id = city_id.value;
  }
  if (place.value != "" && place.value != undefined) {
    result.place = place.value;
  }
  return result;
});

onMounted(async () => {
  await restaurantStore.getListAction();
  await cityStore.getSimpleListAction();
  await getList();
});

watch(search, async (newValue) => {
  await restaurantStore.getListAction(watchSystem.value);
});
watch(price, async (newValue) => {
  await restaurantStore.getListAction(watchSystem.value);
});
watch(city_id, async (newValue) => {
  await restaurantStore.getListAction(watchSystem.value);
});
watch(place, async (newValue) => {
  await restaurantStore.getListAction(watchSystem.value);
});
</script>

<template>
  <div class="bg-white">
    <NavbarVue />
    <div class="py-5 px-4 space-y-4">
      <div class="relative">
        <div
          class="flex justify-start items-center gap-2 text-main absolute top-1"
          @click="goBack"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          Back
        </div>
        <div
          class="bg-main text-white p-2 rounded-full absolute top-[-5px] right-0"
          @click="createPage"
          v-if="!authStore.isAgent"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 6v12m6-6H6"
            />
          </svg>
        </div>
        <p class="text-main text-2xl font-semibold w-full text-center">
          Restaurants
        </p>
      </div>
      <div
        class="bg-main/10 py-1 pl-3 pr-2 rounded-3xl flex justify-between items-center"
      >
        <div class="mr-2" @click="clear">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            v-if="!search && !price && !city_id && !place"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6 text-main"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <img
            v-if="search || price || city_id || place"
            src="../../public/clear-svgrepo-com (1).svg"
            class="w-6 h-6"
            alt=""
          />
          <!-- <p class="text-main">Search</p> -->
        </div>
        <v-select
          class="style-chooser w-full"
          :options="chooseType"
          v-model="search"
          label="name"
          :clearable="false"
          :reduce="(d) => d"
          placeholder="Search"
        ></v-select>
        <!-- @option:selected="chooseName()" -->
      </div>
      <div class="flex py-1.5 mb-5 gap-3 flex-wrap">
        <v-select
          class="style-chooser bg-white rounded-full border border-main min-w-[100px]"
          :options="cities?.data"
          label="name"
          v-model="city_id"
          :clearable="false"
          :reduce="(d) => d.id"
          placeholder="City"
        ></v-select>
        <v-select
          class="style-chooser bg-white rounded-full border border-main min-w-[100px]"
          :options="choosePlace"
          label="name"
          v-model="place"
          :clearable="false"
          :reduce="(d) => d"
          placeholder="Place"
        ></v-select>
        <div
          @click="priceShow = true"
          v-if="!priceShow"
          class="bg-white rounded-full border border-main min-w-[100px] text-main px-2 py-1"
        >
          <div class="flex justify-between items-center">
            price
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.9"
              stroke="currentColor"
              class="w-4 h-4 font-bold"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </div>
        </div>
        <div
          class="text-sm flex justify-center items-center gap-2"
          v-if="priceShow"
        >
          <input
            type="number"
            v-model="price"
            class="bg-white text-xs focus:ring-0 border-main rounded-full px-4 py-2 border max-w-[100px]"
            placeholder=" price"
          />
          <p class="">Max</p>
        </div>
      </div>
      <div
        class="relative flex justify-center items-center py-[50%]"
        v-if="loading"
      >
        <div
          class="absolute animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-main"
        ></div>
        <img src="../../public/logo.jpg" class="rounded-full h-16 w-16" />
      </div>
      <div
        class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-5 pt-2"
        v-if="!loading"
      >
        <div v-for="(restaurant, index) in restaurants?.data" :key="index">
          <RestaurantItemVue
            :id="restaurant.id"
            :hotels="restaurant"
            @change="changes"
          />
        </div>
      </div>
      <div
        class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-5 pt-2"
        v-if="!loading"
      >
        <div
          class="space-y-2 col-span-1 md:col-span-2"
          v-if="restaurants?.data.length == 0"
        >
          <NoDataPageVue />
        </div>
      </div>
      <div>
        <Pagination
          v-if="!loading"
          :data="restaurants"
          @change-page="changePage"
        />
      </div>
    </div>
  </div>
</template>

<style></style>
