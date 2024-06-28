<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import { storeToRefs } from "pinia";

const router = useRouter();
const authStore = useAuthStore();

const { user } = storeToRefs(authStore);

const props = defineProps({
  data: Array || Object,
});

onMounted(async () => {
  console.log("====================================");
  console.log(props.data);
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
        <p class="px-3">Unpaid Bookings</p>
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
        v-for="z in data"
        :key="z"
        :class="
          (user.role == 'admin' && user.name == z.agent_name) ||
          user.role == 'reservation' ||
          user.role == 'super_admin'
            ? ''
            : 'hidden'
        "
      >
        <div
          class="text-sm flex justify-between cursor-pointer items-center px-4 py-2 hover:bg-gray-100 rounded-md"
        >
          <div class="flex justify-between items-center gap-4">
            <img
              src="https://img.freepik.com/free-psd/3d-illustration-person_23-2149436182.jpg?t=st=1709107594~exp=1709111194~hmac=719ca64b61d1a37f5d78b41a7b08ae7ebcc1a32aa8a5ca144d29b607535ab609&w=740"
              class="w-14 h-14 rounded-full"
              alt=""
            />
            <div>
              <p class="text-xs font-semibold">{{ z?.agent_name }}</p>
              <p class="text-xs text-gray-800">{{ z.total_booking }} Booking</p>
            </div>
          </div>

          <p
            class="text-[#FF5B00] text-sm flex justify-end font-semibold items-center gap-3"
            v-if="z.total_balance"
          >
            {{ z.total_balance }} thb
          </p>
        </div>
        <div
          class="px-4 py-2 bg-gray-50 text-sm rounded-md divide-y-2 divide-y-gray-400"
          v-if="z.booking_infos.length > 0"
        >
          <div
            v-for="(l, index) in z.booking_infos"
            :key="index"
            @click="router.push('/sales/edit/' + l.id)"
            class="cursor-pointer hover:bg-orange-100/50 bg-black/5 px-2 py-2 text-xs flex justify-between items-center"
          >
            <div class="space-y-1">
              <p>{{ l.customer_name }}</p>
              <p class="text-[10px] text-black">{{ l.crm_id }}</p>
            </div>
            <p class="text-sm text-black font-semibold">
              {{ l.balance_due }} THB
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
