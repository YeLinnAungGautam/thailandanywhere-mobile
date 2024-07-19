<template>
  <div class="space-y-2">
    <div
      class="text-main text-base px-2 items-center"
      v-for="z in data"
      :key="z"
    >
      <div class="bg-gray-50 text-sm rounded-md">
        <div
          @click="router.push('/reservation/update/' + z.id)"
          class="cursor-pointer hover:bg-orange-100/50 bg-black/5 rounded-lg px-2 py-2 text-xs"
        >
          <div class="flex justify-between items-center pb-2">
            <p>{{ z.booking.customer.name }}</p>
            <p>{{ z.product_type.split("\\")[2] }}</p>
          </div>
          <div class="flex justify-between items-center">
            <div class="space-y-1">
              <p>{{ z.customer_name }}</p>
              <p class="text-[10px] text-black">{{ z.crm_id }}</p>
            </div>
            <p class="text-sm text-black font-semibold">
              {{
                z.selling_price *
                z.quantity *
                calculateDaysBetween(z.checkin_date, z.checkout_date)
              }}
              THB
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

const props = defineProps({
  data: Array,
});

const calculateDaysBetween = (a, b) => {
  if (a && b) {
    const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    const startDateTimestamp = new Date(a).getTime();
    const endDateTimestamp = new Date(b).getTime();
    let result = Math.abs(
      Math.round((endDateTimestamp - startDateTimestamp) / oneDay)
    );
    // formitem.value.days = result;
    return result;
  } else {
    return 1;
  }
};
</script>
