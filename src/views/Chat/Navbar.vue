<template>
  <div class="bg-white border-b border-gray-200 px-6 py-4">
    <div class="flex items-center justify-between">
      <!-- Left: App Name -->
      <div class="flex items-center space-x-4">
        <h1 class="text-xl font-bold text-gray-900">Admin Chat</h1>
        <span
          v-if="socketStore.connected"
          class="flex items-center text-sm text-green-600"
        >
          <span class="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
          Connected
        </span>
        <span v-else class="flex items-center text-sm text-red-600">
          <span class="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
          Disconnected
        </span>
      </div>

      <!-- Right: User Info & Actions -->
      <div class="flex items-center space-x-4">
        <!-- New Chat Button -->
        <button
          @click="showNewChatModal = true"
          class="px-4 rounded-full py-2 bg-orange-600 text-white hover:bg-orange-700 transition"
        >
          + New Chat
        </button>
      </div>
    </div>

    <!-- New Chat Modal -->
    <UserList v-if="showNewChatModal" @close="showNewChatModal = false" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import { useSocketStore } from "../../stores/socket";
import { useChatStore } from "../../stores/chat";
import UserList from "./UserList.vue";

const router = useRouter();
const authStore = useAuthStore();
const socketStore = useSocketStore();
const chatStore = useChatStore();

const showNewChatModal = ref(false);

function getInitials(name) {
  if (!name) return "A";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

async function handleLogout() {
  await authStore.logout();
  socketStore.disconnect();
  chatStore.reset();
  router.push("/login");
}
</script>
