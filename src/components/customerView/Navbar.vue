<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";

const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
  await authStore.getMe();
});
</script>

<template>
  <div
    class="flex justify-between items-center py-2 px-4 space-x-4 h-[60px] bg-white drop-shadow"
  >
    <router-link
      to="/customer/products"
      class="flex justify-start items-end space-x-4"
    >
      <img src="../../../public/logo.jpg" class="h-[40px]" alt="" />
      <p class="mb-2 text-main text-xl font-semibold">thailand anywhere</p>
    </router-link>
    <div
      class="bg-main py-1 px-3 rounded-full text-sm text-white flex justify-end items-center gap-2 cursor-pointer"
      @click="router.push({ name: 'login' })"
    >
      login
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
          d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
        />
      </svg>
    </div>
  </div>
</template>
