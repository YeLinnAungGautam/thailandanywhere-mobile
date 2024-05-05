<script setup>
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import NavbarVue from "../../components/customerView/Navbar.vue";
import { useHotelStore } from "../../stores/hotel";
import { useVantourStore } from "../../stores/vantour";
import { useAirportStore } from "../../stores/airport";
import { useGrouptourStore } from "../../stores/grouptour";
import { useEntranceStore } from "../../stores/entrance";
import { useRestaurantStore } from "../../stores/restaurant";
import { useAirLineStore } from "../../stores/airline";

const router = useRouter();
const entranceStore = useEntranceStore();
const hotelStore = useHotelStore();
const vantourStore = useVantourStore();
const airportStore = useAirportStore();
const grouptourStore = useGrouptourStore();
const restaurantStore = useRestaurantStore();
const airlineStore = useAirLineStore();

const { hotels } = storeToRefs(hotelStore);
const { vantours } = storeToRefs(vantourStore);
const { airports } = storeToRefs(airportStore);
const { grouptours } = storeToRefs(grouptourStore);
const { entrances } = storeToRefs(entranceStore);
const { restaurants } = storeToRefs(restaurantStore);
const { airlines } = storeToRefs(airlineStore);

const chooseType = ref([
  { id: 1, name: "van tour" },
  { id: 2, name: "hotel" },
  { id: 3, name: "attraction" },
  { id: 4, name: "group tour" },
  { id: 5, name: "airline" },
  { id: 6, name: "restaurant" },
]);

const goHotels = () => {
  router.push({ name: "hotels" });
};

const goVantours = () => {
  router.push({ name: "vantours" });
};
const goGrouptour = () => {
  router.push({ name: "grouptour" });
};
const goAttraction = () => {
  router.push({ name: "attraction" });
};
const goInclusive = () => {
  router.push({ name: "inclusive" });
};

const search = ref("");

const clear = () => {
  search.value = "";
};

onMounted(async () => {
  // await hotelStore.getListAction();
  // await vantourStore.getListAction();
  // await airportStore.getListAction();
  // await grouptourStore.getListAction();
  // await entranceStore.getListAction();
  // await airlineStore.getListAction();
  // await restaurantStore.getListAction();
  console.log(hotels.value);
});
</script>

<template>
  <div class="bg-white">
    <NavbarVue />
    <div class="py-5 px-4 space-y-4">
      <p class="text-main text-2xl font-semibold">Products</p>
      <div
        class="bg-main/10 py-2 pl-3 pr-2 rounded-3xl flex justify-between items-center"
      >
        <div class="mr-2" @click="clear">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            v-if="!search"
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
            v-if="search"
            src="../../../public/clear-svgrepo-com (1).svg"
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
          :reduce="(d) => d.name"
          placeholder="Search"
        ></v-select>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-6 py-4">
        <div
          class="space-y-2"
          @click="goVantours"
          v-if="search == 'van tour' || search == 'all' || search == ''"
        >
          <img
            src="../../../public/privatevantour.jpg"
            alt=""
            class="rounded-lg"
          />
          <p class="text-lg pl-2 font-semibold text-main">Van Tours</p>
          <p class="text-sm pl-2">{{ vantours?.meta.total }} Packages</p>
        </div>
        <div
          class="space-y-2"
          @click="goHotels"
          v-if="search == 'hotel' || search == 'all' || search == ''"
        >
          <img src="../../../public/hotels.jpg" alt="" class="rounded-lg" />
          <p class="text-lg pl-2 font-semibold text-main">Hotels</p>
          <p class="text-sm pl-2">{{ hotels?.meta.total }} Packages</p>
        </div>
        <div
          class="space-y-2"
          v-if="search == 'attraction' || search == 'all' || search == ''"
          @click="goAttraction"
        >
          <img src="../../../public/attraction.jpg" alt="" class="rounded-lg" />
          <p class="text-lg pl-2 font-semibold text-main">Attractions</p>
          <p class="text-sm pl-2">{{ entrances?.meta.total }} Packages</p>
        </div>
        <div
          class="space-y-2"
          @click="goGrouptour"
          v-if="search == 'group tour' || search == 'all' || search == ''"
        >
          <img src="../../../public/grouptour.jpg" alt="" class="rounded-lg" />
          <p class="text-lg pl-2 font-semibold text-main">Group Tours</p>
          <p class="text-sm pl-2">{{ grouptours?.meta.total }} Packages</p>
        </div>
        <div
          class="space-y-2"
          v-if="search == 'airline' || search == 'all' || search == ''"
          @click="router.push({ name: 'airline' })"
        >
          <img
            src="../../../public/flightticket.jpg"
            alt=""
            class="rounded-lg"
          />
          <p class="text-lg pl-2 font-semibold text-main">AirLine</p>
          <p class="text-sm pl-2">{{ airlines?.meta.total }} Packages</p>
        </div>
        <div
          class="space-y-2"
          v-if="search == 'restaurant' || search == 'all' || search == ''"
          @click="router.push({ name: 'restaurant' })"
        >
          <img src="../../../public/restaurant.jpg" alt="" class="rounded-lg" />
          <p class="text-lg pl-2 font-semibold text-main">Restaurant</p>
          <p class="text-sm pl-2">{{ restaurants?.meta.total }} Packages</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
