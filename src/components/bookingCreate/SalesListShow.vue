<template>
  <div>
    <div class="flex justify-between items-center bg-white px-4 py-2">
      <div class="flex justify-start items-center gap-3">
        <svg
          @click="deleteID(id)"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6 text-red"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div class="space-y-1">
          <div v-for="t in formItemType" :key="t.id">
            <p v-if="t.id == productType" class="text-main">{{ t.name }}</p>
          </div>
          <p v-if="productShowName != 'null'">{{ productShowName }}</p>
          <div v-if="productShowName == 'null' && productName != 'null'">
            <div v-if="productType == '1'">
              <div v-for="t in vantour?.data" :key="t.id">
                <p v-if="t.id == productName">{{ t.name }}</p>
              </div>
            </div>
            <div v-if="productType == '2'">
              <div v-for="t in grouptour?.data" :key="t.id">
                <p v-if="t.id == productName">{{ t.name }}</p>
              </div>
            </div>
            <div v-if="productType == '3'">
              <div v-for="t in airport?.data" :key="t.id">
                <p v-if="t.id == productName">{{ t.name }}</p>
              </div>
            </div>
            <div v-if="productType == '4'">
              <div v-for="t in entrance?.data" :key="t.id">
                <p v-if="t.id == productName">{{ t.name }}</p>
              </div>
            </div>
            <div v-if="productType == '6'">
              <div v-for="t in hotel?.data" :key="t.id">
                <p v-if="t.id == productName">{{ t.name }}</p>
              </div>
            </div>
            <div v-if="productType == '7'">
              <div v-for="t in airline?.data" :key="t.id">
                <p v-if="t.id == productName">{{ t.name }}</p>
              </div>
            </div>
          </div>
          <small>service date : {{ serviceDate }}</small>
        </div>
      </div>
      <p class="text-lg font-semibold">THB {{ totalAmount }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted } from "vue";
import { useVantourStore } from "../../stores/vantour";
import { useGrouptourStore } from "../../stores/grouptour";
import { useAirportStore } from "../../stores/airport";
import { useEntranceStore } from "../../stores/entrance";
import { useBookingStore } from "../../stores/booking";
// import { useInclusiveStore } from "../../stores/inclusion";
import { useRoomStore } from "../../stores/room";
import { useHotelStore } from "../../stores/hotel";
import { useAirLineStore } from "../../stores/airline";
import { storeToRefs } from "pinia";

const vantourStore = useVantourStore();
const grouptourStore = useGrouptourStore();
const airportStore = useAirportStore();
const entranceStore = useEntranceStore();
const bookingStore = useBookingStore();
const hotelStore = useHotelStore();
const roomStore = useRoomStore();
const airlineStore = useAirLineStore();

const { vantour } = storeToRefs(vantourStore);
const { grouptour } = storeToRefs(grouptourStore);
const { airport } = storeToRefs(airportStore);
const { entrance } = storeToRefs(entranceStore);
const { airline } = storeToRefs(airlineStore);
const { rooms } = storeToRefs(roomStore);
const { hotel } = storeToRefs(hotelStore);

const props = defineProps({
  id: Number,
  productType: Number,
  productShowName: String,
  productName: Number,
  serviceDate: String,
  selling: [Number, String],
  quantity: Number,
  totalAmount: Number,
});

const emit = defineEmits();

const deleteID = (id) => {
  emit("delete", id);
};

const formItemType = [
  { id: "1", name: "Van Tour", data: "AppModelsPrivateVanTour" },
  { id: "2", name: "Group Tour", data: "AppModelsGroupTour" },
  { id: "3", name: "Airport Pickup", data: " AppModelsAirportPickup" },
  { id: "4", name: "Entrance Ticket", data: "AppModelsEntranceTicket" },
  { id: "5", name: "Inclusive", data: "AppModelsInclusive" },
  { id: "6", name: "Hotel Room", data: "AppModelsRoom" },
  { id: "7", name: "AirLine", data: "AppModelsAirline" },
];

onMounted(async () => {
  // await vantourStore.getSimpleListAction();
  // await grouptourStore.getSimpleListAction();
  // await airportStore.getSimpleListAction();
  // await entranceStore.getSimpleListAction();
  // await hotelStore.getSimpleListAction();
  // await roomStore.getSimpleListAction();
  // await airlineStore.getSimpleListAction();
});
</script>
