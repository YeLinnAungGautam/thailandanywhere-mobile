<template>
  <div class="space-y-2">
    <div
      class="text-main text-base px-2 items-center"
      v-for="z in data"
      :key="z"
    >
      <div class="bg-gray-50 text-sm rounded-md">
        <div
          v-if="z.product_type == 'App\\Models\\PrivateVanTour'"
          @click="router.push('/reservation/update/' + z.id)"
          class="cursor-pointer hover:bg-orange-100/50 bg-black/5 rounded-lg px-2 py-2 text-xs"
        >
          <div class="flex justify-between items-center pb-2">
            <div class="space-y-1">
              <p>{{ z.customer_info.name }}</p>
              <p class="text-white bg-main p-1 rounded-md">{{ z.crm_id }}</p>
            </div>
            <div class="flex justify-end items-center gap-2">
              <p
                class="p-1 rounded-md text-white"
                :class="z.is_driver_collect == 1 ? 'bg-red' : 'bg-green'"
              >
                {{ z.is_driver_collect == 1 ? "collect" : "bank" }}
              </p>
              <p
                class="p-1 rounded-md"
                :class="
                  z.booking.payment_status == 'fully_paid'
                    ? 'bg-green text-white'
                    : 'bg-red text-white'
                "
              >
                {{ z.booking.payment_status }}
              </p>
              <!-- <p class="bg-black text-main p-1 rounded-md">
                {{ z.pickup_time }}
              </p> -->
              <p
                class="p-1 rounded-md bg-green text-white"
                v-if="z.is_driver_collect == 1"
              >
                {{ z.reservation_car_info?.supplier_name }}
              </p>
            </div>
          </div>
          <div class="flex justify-between items-center">
            <div class="space-y-1">
              <p>{{ z.product?.name }}</p>
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
        <div
          v-if="z.product_type == 'App\\Models\\Hotel'"
          @click="router.push('/reservation/update/' + z.id)"
          class="cursor-pointer hover:bg-orange-100/50 bg-black/5 rounded-lg px-2 py-2 text-xs"
        >
          <div class="flex justify-between items-center pb-2">
            <div class="space-y-1">
              <p>{{ z.customer_info.name }}</p>
              <p class="text-white bg-main p-1 rounded-md">{{ z.crm_id }}</p>
            </div>
            <div class="flex justify-end items-center gap-2">
              <p
                class="p-1 rounded-md text-white"
                :class="z.paid_slip.length == 0 ? 'bg-red' : 'bg-green'"
              >
                {{ z.paid_slip.length == 0 ? "missing" : "received" }}
              </p>
              <p
                class="p-1 rounded-md"
                :class="
                  z.booking.payment_status == 'fully_paid'
                    ? 'bg-green text-white'
                    : 'bg-red text-white'
                "
              >
                {{ z.booking.payment_status }}
              </p>
              <!-- <p class="bg-black text-main p-1 rounded-md">
                {{ z.pickup_time }}
              </p> -->
              <!-- <p
                class="p-1 rounded-md bg-green text-white"
                v-if="z.is_driver_collect == 1"
              >
                {{ z.reservation_car_info.supplier_name }}
              </p> -->
            </div>
          </div>
          <div class="flex justify-between items-center">
            <div class="space-y-1">
              <p>{{ z.product?.name }}</p>
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
        <div
          v-if="z.product_type == 'App\\Models\\EntranceTicket'"
          @click="router.push('/reservation/update/' + z.id)"
          class="cursor-pointer hover:bg-orange-100/50 bg-black/5 rounded-lg px-2 py-2 text-xs"
        >
          <div class="flex justify-between items-center pb-2">
            <div class="space-y-1">
              <p>{{ z.customer_info.name }}</p>
              <p class="text-white bg-main p-1 rounded-md">{{ z.crm_id }}</p>
            </div>
            <div class="flex justify-end items-center gap-2">
              <p
                class="p-1 rounded-md text-white"
                :class="z.paid_slip.length == 0 ? 'bg-red' : 'bg-green'"
              >
                {{ z.paid_slip.length == 0 ? "missing" : "received" }}
              </p>
              <p
                class="p-1 rounded-md"
                :class="
                  z.booking.payment_status == 'fully_paid'
                    ? 'bg-green text-white'
                    : 'bg-red text-white'
                "
              >
                {{ z.booking.payment_status }}
              </p>
              <!-- <p class="bg-black text-main p-1 rounded-md">
                {{ z.pickup_time }}
              </p> -->
              <!-- <p
                class="p-1 rounded-md bg-green text-white"
                v-if="z.is_driver_collect == 1"
              >
                {{ z.reservation_car_info?.supplier_name }}
              </p> -->
            </div>
          </div>
          <div class="flex justify-between items-center">
            <div class="space-y-1">
              <p>{{ z.product?.name }}</p>
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
import { defineProps, onMounted } from "vue";
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

onMounted(() => {
  console.log("====================================");
  console.log(props.data, "this is data");
  console.log("====================================");
});
</script>
