<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import { storeToRefs } from "pinia";

const router = useRouter();
const authStore = useAuthStore();

const { user } = storeToRefs(authStore);

const props = defineProps({
  data: Array,
  date: String,
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

onMounted(async () => {
  console.log("====================================");
  console.log(props.data, "this is data");
  await authStore.getMe();
  console.log(user.value);
  console.log("====================================");
});
</script>

<template>
  <div class="">
    <div class="pt-5 space-y-4 pb-5">
      <div
        class="text-main text-lg flex justify-between items-center font-semibold pb-3"
      >
        <p class="px-3">Expenses</p>
        <p class="text-xs font-semibold">{{ date }}</p>
        <p>
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
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </p>
      </div>
      <div
        class="text-main text-base px-2 items-center"
        v-for="z in data ? data : []"
        :key="z"
        :class="
          user.role == 'admin' ||
          user.role == 'reservation' ||
          user.role == 'super_admin'
            ? ''
            : 'hidden'
        "
      >
        <div class="bg-gray-50 text-sm rounded-md">
          <div
            @click="router.push('/reservation/update/' + z.id)"
            class="cursor-pointer hover:bg-orange-100/50 bg-black/5 rounded-lg px-2 py-2 text-xs"
          >
            <div class="flex justify-between items-center pb-2">
              <p>{{ z.booking.customer.name }}</p>
              <p>selling price</p>
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
  </div>
</template>
