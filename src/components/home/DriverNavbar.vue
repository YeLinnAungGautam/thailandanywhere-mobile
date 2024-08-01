<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "../../stores/auth";

const authStore = useAuthStore();

onMounted(async () => {
  await authStore.getMe();
});
</script>

<template>
  <div class="">
    <router-link
      to="/car-supplier/dashboard"
      class="flex justify-start items-end py-2 px-4 space-x-4 h-[60px] bg-white drop-shadow"
    >
      <img src="../../../public/logo.jpg" class="h-[40px]" alt="" />
      <p class="mb-2 text-main text-xl font-semibold">thailand anywhere</p>
    </router-link>
  </div>
</template>
