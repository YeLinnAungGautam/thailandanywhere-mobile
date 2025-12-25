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
  <div class="grid grid-cols-3 sm:grid-cols-4 gap-8 px-8 py-10">
    <div class="flex justify-center items-center">
      <router-link to="/analytics/0">
        <div
          class="bg-white flex justify-center items-center w-[70px] h-[70px] rounded-full shadow-custom"
        >
          <img
            src="../../../public/dashboard-svgrepo-com.svg"
            class="w-7 h-7 text-main"
            alt=""
          />
        </div>
        <p class="text-center mt-5 text-black text-sm font-semibold">
          Analytics
        </p>
      </router-link>
    </div>
    <div class="flex justify-center items-center" v-if="!authStore.isAgent">
      <router-link to="/sales">
        <div
          class="bg-white flex justify-center items-center w-[70px] h-[70px] rounded-full shadow-custom"
        >
          <img
            src="../../../public/money-receive-svgrepo-com.svg"
            class="w-7 h-7 text-main"
            alt=""
          />
        </div>
        <p class="text-center mt-5 text-black text-sm font-semibold">Sales</p>
      </router-link>
    </div>
    <div class="flex justify-center items-center">
      <router-link to="/products">
        <div
          class="bg-white flex justify-center items-center w-[70px] h-[70px] rounded-full shadow-custom"
        >
          <img
            src="../../../public/hot-air-balloon-svgrepo-com.svg"
            class="w-7 h-7 text-main"
            alt=""
          />
        </div>
        <p class="text-center mt-5 text-black text-sm font-semibold">
          Products
        </p>
      </router-link>
    </div>

    <div class="flex justify-center items-center" v-if="!authStore.isAgent">
      <router-link to="reservations">
        <div
          class="bg-white flex justify-center items-center w-[70px] h-[70px] rounded-full shadow-custom"
        >
          <img
            src="../../../public/letter-opened-svgrepo-com.svg"
            class="w-7 h-7 text-main"
            alt=""
          />
        </div>
        <p class="text-center mt-5 text-black text-sm font-semibold">
          Bookings
        </p>
      </router-link>
    </div>
    <div class="flex justify-center items-center" v-if="!authStore.isAgent">
      <router-link to="/customers">
        <div
          class="bg-white flex justify-center items-center w-[70px] h-[70px] rounded-full shadow-custom"
        >
          <img
            src="../../../public/people-nearby-svgrepo-com.svg"
            class="w-7 h-7 text-main"
            alt=""
          />
        </div>
        <p class="text-center mt-5 text-black text-sm font-semibold">
          Customers
        </p>
      </router-link>
    </div>
    <div class="flex justify-center items-center" v-if="!authStore.isAgent">
      <router-link to="/map-page">
        <div
          class="bg-white flex justify-center items-center w-[70px] h-[70px] rounded-full shadow-custom"
        >
          <img
            src="https://images.vexels.com/media/users/3/131625/isolated/svg/35942a8a6bb75dc1842582deb7168bf8.svg"
            class="w-7 h-7 text-main"
            alt=""
          />
        </div>
        <p class="text-center mt-5 text-black text-sm font-semibold">Map</p>
      </router-link>
    </div>

        <div class="flex justify-center items-center" v-if="!authStore.isAgent">
      <router-link to="/availabilities">
        <div
          class="bg-white flex justify-center items-center w-[70px] h-[70px] rounded-full shadow-custom"
        >
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FF613C" class="w-6 h-6">
  <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375z"/>
  <path fill-rule="evenodd" d="M3.087 9l.54 9.176A3 3 0 006.62 21h10.757a3 3 0 002.995-2.824L20.913 9H3.087zM12 10.5a.75.75 0 01.75.75v4.94l1.72-1.72a.75.75 0 111.06 1.06l-3 3a.75.75 0 01-1.06 0l-3-3a.75.75 0 111.06-1.06l1.72 1.72v-4.94a.75.75 0 01.75-.75z" clip-rule="evenodd"/>
</svg>
        </div>
        <p class="text-center mt-5 text-black text-sm font-semibold">Availability</p>
      </router-link>
    </div>
    <div class="flex justify-center items-center">
      <div @click="logoutHandle">
        <div
          class="bg-white flex justify-center items-center w-[70px] h-[70px] rounded-full shadow-custom"
        >
          <img
            src="../../../public/logout-svgrepo-com.svg"
            class="w-7 h-7 text-main"
            alt=""
          />
        </div>
        <p class="text-center mt-5 text-black text-sm font-semibold">Logout</p>
      </div>
    </div>
  </div>
</template>
