<template>
  <div
    class="mx-4 my-4 bg-gradient-to-l to-main from-[#ff960d] drop-shadow px-4 relative grid grid-cols-2 gap-2 rounded-lg overflow-hidden h-[215px] shadow-custom border-2 border-main/80"
  >
    <div class="relative z-10 space-y-2 w-full col-span-2">
      <p class="text-white pt-8 font-semibold">{{ user?.name }}</p>
      <p class="text-white/80 text-xs">{{ user?.role }}</p>
      <div class="flex justify-between items-center gap-2 w-full">
        <img :src="DrivingImage" class="w-[170px] h-full object-cover" alt="" />
        <div>
          <div class="w-full px-6 py-2 bg-white mb-8 rounded-lg text-end">
            <p class="text-main font-semibold text-base">Trips</p>
            <p class="text-main font-bold text-4xl">23</p>
          </div>
        </div>
      </div>
    </div>

    <div class="absolute bottom-0 opacity-20 w-full h-[400px] z-0">
      <img
        src="https://static.vecteezy.com/system/resources/thumbnails/000/570/746/small_2x/1542.jpg"
        class="w-full h-full object-cover"
        alt=""
      />
    </div>
    <button
      class="absolute top-2 right-2 bg-white z-30 text-xs px-4 py-1 rounded-xl"
    >
      today
    </button>
  </div>
</template>

<script setup>
import { useAuthStore } from "../../stores/auth";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import DrivingImage from "../../../public/road-trip_7057930.png";

const authStore = useAuthStore();

const { user } = storeToRefs(authStore);

onMounted(async () => {
  await authStore.getMe();
});
</script>
