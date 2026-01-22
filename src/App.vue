<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "./stores/auth";
import { useSocketStore } from "./stores/socket";
import { useChatStore } from "./stores/chat";
import { RouterView } from "vue-router";

const authStore = useAuthStore();
const socketStore = useSocketStore();
const chatStore = useChatStore();

onMounted(async () => {
  console.log("🚀 App mounted");

  // Step 1: Load auth from localStorage
  authStore.loadFromStorage();

  // Step 2: Check if user is authenticated
  if (authStore.isAuthenticated && authStore.token) {
    console.log("✅ User authenticated, initializing app...");

    try {
      // Wait a bit to ensure everything is ready
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Step 3: Connect socket with token ⭐ ဒါက အရေးကြီးတယ်!
      socketStore.connect(authStore.token);

      // Step 4: Load chat data
      await chatStore.loadInitialData();

      console.log("✅ App initialization complete");
    } catch (error) {
      console.error("❌ App initialization failed:", error);
    }
  } else {
    console.log("ℹ️ No auth token, skipping initialization");
  }

  // Listen for login events
  window.addEventListener("auth:login", async (event) => {
    console.log("🔔 Login event detected");
    const token = event.detail.token;

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      // ⭐ Pass token to socket
      socketStore.connect(token);

      // Load chat data
      await chatStore.loadInitialData();

      console.log("✅ Post-login initialization complete");
    } catch (error) {
      console.error("❌ Post-login initialization failed:", error);
    }
  });
});
</script>

<template>
  <main>
    <div class="bg-image bg-with-image font-roboto">
      <div class="main-content bg-opacity-50 backdrop-filter backdrop-blur-xl">
        <RouterView />
      </div>
    </div>
  </main>
</template>

<style>
.bg-with-image {
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url("/background.png");
}
</style>
