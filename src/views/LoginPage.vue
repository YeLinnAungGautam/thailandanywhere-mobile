<script setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/auth.js";
import { useToastStore } from "../stores/toast";
import { useRouter } from "vue-router";
import { EyeIcon, EyeSlashIcon } from "@heroicons/vue/24/outline";

const authStore = useAuthStore();
const router = useRouter();
const toastStore = useToastStore();

const showPassword = ref(false);

const formData = ref({
  email: "",
  password: "",
});
const LoginHandle = async () => {
  try {
    const res = await authStore.login(formData.value);

    toastStore.showToast({
      icon: "success",
      title: res.message,
    });
    router.push({ name: "home" });
  } catch (error) {
    console.log("🚀 ~ file: LoginView.vue:54 ~ loginHandler ~ error:", error);
    formData.value = { email: "", password: "" };
    if (error.response) {
      toastStore.showToast({
        icon: "error",
        title: error.response.data.message,
      });
    }
  }
};
</script>

<template>
  <div class="h-screen overflow-hidden relative z-10">
    <div
      class="h-[300px] bg-main relative z-20 rounded-br-[150px] overflow-hidden"
    >
      <p class="text-center pt-[130px] px-8 text-white text-2xl font-semibold">
        Thailand Anywhere Dashboard
      </p>
      <img
        src="../../public/shadow.jpg"
        class="opacity-25 absolute bottom-0 h-full w-full"
        alt=""
      />
    </div>
    <div class="mt-20 px-4 space-y-4 mx-auto max-w-md relative z-20">
      <div class="w-full">
        <img
          src="../../public/logo.jpg"
          class="w-[100px] rounded-full absolute top-[-131px] left-0"
          alt=""
        />
      </div>
      <div>
        <input
          type="email"
          v-model="formData.email"
          name="email"
          class="peer h-12 text-sm w-full bg-white border-2 border-main rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none placeholder-transparent"
          id="email"
          placeholder="enter your email address"
        />
      </div>
      <div class="relative">
        <input
          :type="[showPassword ? 'text' : 'password']"
          v-model="formData.password"
          name="password"
          class="peer h-12 text-sm w-full bg-white border-2 border-main rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none placeholder-transparent"
          id="password"
          placeholder="enter your password"
        />
        <span
          class="absolute text-gray-500 cursor-pointer top-3.5 right-4"
          @click="showPassword = !showPassword"
        >
          <EyeIcon v-if="showPassword" class="w-5 h-5 text-main" />
          <EyeSlashIcon v-else class="w-5 h-5 text-main" />
        </span>
      </div>

      <button
        @click="LoginHandle"
        class="peer h-12 text-base w-full bg-main text-white border-2 border-main rounded-md shadow-sm px-4 py-2 focus:outline-none placeholder-transparent"
      >
        Login
      </button>
      <div class="relative flex justify-center">
        <p class="bg-white text-main text-center z-10 px-4 inline-block">OR</p>
        <p class="absolute w-full h-0.5 top-3 bg-main"></p>
      </div>
      <!-- <button
        @click="router.push({ name: 'cus-products' })"
        class="peer h-12 text-base w-full bg-white text-main border-2 border-main rounded-md shadow-sm px-4 py-2 focus:outline-none placeholder-transparent"
      >
        View products as guest
      </button> -->
    </div>
    <!-- <img
      src="../../public/shadow.jpg"
      class="w-full absolute bottom-0 opacity-40 z-0"
      alt=""
    /> -->
  </div>
</template>
