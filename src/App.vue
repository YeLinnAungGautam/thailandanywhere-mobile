<template>
  <div>
    <main>
      <div class="bg-image">
        <div
          class="main-content bg-opacity-50 backdrop-filter backdrop-blur-xl font-poppins"
        >
          <!-- <transition name="fade" mode="out-in">
            <RouterView />
          </transition> -->
          <router-view v-slot="{ Component }">
            <transition
              name="fade"
              mode="out-in"
              enter-active-class="animate__animated animate__fadeIn"
              leave-active-class="animate__animated animate__fadeOut"
            >
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "./stores/auth";
import { useSocketStore } from "./stores/socket";
import { RouterLink, RouterView } from "vue-router";

const authStore = useAuthStore();
const socketStore = useSocketStore();

onMounted(() => {
  console.log("🚀 App mounted");

  // Load auth from localStorage
  authStore.loadFromStorage();

  // ✅ ADD THIS - Auto-connect socket if logged in
  if (authStore.isAuthenticated && authStore.token) {
    console.log("✅ User authenticated, connecting socket...");

    setTimeout(() => {
      socketStore.connect();
    }, 1000);
  }

  // ✅ ADD THIS - Listen for login events
  window.addEventListener("auth:login", (event) => {
    console.log("🔔 Login event detected");
    setTimeout(() => {
      socketStore.connect();
    }, 500);
  });
});
</script>
