<script setup>
import { Squares2X2Icon } from "@heroicons/vue/24/outline";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import { useToastStore } from "../../stores/toast";

const authStore = useAuthStore();
const toastStore = useToastStore();
const router = useRouter();

const logoutHandle = async () => {
  const res = await authStore.logout();
  toastStore.showToast({
    icon: "success",
    title: res.message,
  });
  router.push({ name: "login" });
};
</script>

<template>
  <div class="grid grid-cols-3 sm:grid-cols-4 gap-8 px-8 py-6">
    <div class="flex justify-center items-center">
      <router-link to="/analytics/0">
        <div
          class="bg-white flex justify-center items-center w-[100px] h-[100px] rounded-2xl border-2 border-main/90 shadow-custom"
        >
          <img
            src="../../../public/mountain_14544262.png"
            class="w-20 h-20 text-main"
            alt=""
          />
        </div>
        <p class="text-center mt-3 text-black text-sm font-semibold">Trips</p>
      </router-link>
    </div>

    <div class="flex justify-center items-center">
      <div @click="logoutHandle">
        <div
          class="bg-white flex justify-center items-center w-[100px] h-[100px] rounded-2xl border-2 border-main/90 shadow-custom"
        >
          <img
            src="../../../public/power-button_11880284.png"
            class="w-20 h-20 text-main"
            alt=""
          />
        </div>
        <p class="text-center mt-3 text-black text-sm font-semibold">Logout</p>
      </div>
    </div>
  </div>
</template>
