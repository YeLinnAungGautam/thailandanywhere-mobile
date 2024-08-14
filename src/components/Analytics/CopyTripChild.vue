<template>
  <div class="flex justify-between items-center">
    <p class="text-sm font-semibold">{{ data.name }}</p>
    <p class="text-lg font-bold text-main flex justify-end gap-2 items-center">
      {{ loading ? "loading ..." : total }}
      <ChevronRightIcon class="w-5 h-5" />
    </p>
  </div>
</template>

<script setup>
import { defineProps, onMounted, ref } from "vue";
import { ChevronRightIcon } from "@heroicons/vue/24/outline";
import { useReservationStore } from "../../stores/reservation";

const reservationStore = useReservationStore();

const props = defineProps({
  data: Object,
  date: String,
});

const total = ref(0);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  const res = await reservationStore.getSimpleCopyListAction({
    service_date: props.date,
    supplier_id: props.data.id,
  });
  console.log(res);
  total.value = res.result.data.length;
  loading.value = false;
});
</script>
