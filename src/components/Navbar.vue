<script setup>
import { onMounted, ref, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useNotificationStore } from "../stores/notification";

const router = useRouter();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();

const showNotifications = ref(false);

const toggleNotifications = () => {
  console.log("====================================");
  console.log("hello");
  console.log("====================================");
  showNotifications.value = !showNotifications.value;
};

// Handle notification click
const handleNotificationClick = async (notification) => {
  try {
    // Mark as read
    await notificationStore.markAsRead(notification._id);

    // Navigate to chat with conversation
    router.push({
      path: "/chat",
      query: { conversation: notification.conversationId },
    });

    // Close dropdown
    showNotifications.value = false;
  } catch (error) {
    console.error("Error handling notification click:", error);
  }
};

// Mark all as read
const markAllAsRead = async () => {
  try {
    await notificationStore.markAllAsRead();
  } catch (error) {
    console.error("Error marking all as read:", error);
  }
};

// Go to chat
const goToChat = () => {
  showNotifications.value = false;
  router.push("/chat");
};

// Format notification time
const formatNotificationTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
};

const handleClickOutside = (event) => {
  const notifDropdown = event.target.closest(".notification-container");
  if (!notifDropdown) {
    showNotifications.value = false;
  }
};

onMounted(async () => {
  await authStore.getMe();
  await notificationStore.fetchUnreadNotifications();
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div
    class="bg-white relative z-50 flex justify-between items-center shadow-sm"
  >
    <!-- Logo Bar -->
    <router-link
      to="/"
      class="flex justify-start items-end py-2 px-4 space-x-4 h-[60px]"
    >
      <img src="../../public/logo.jpg" class="h-[40px]" alt="Logo" />
      <p class="mb-2 text-main text-xl font-semibold">thailand anywhere</p>
    </router-link>

    <!-- Notifications Section -->
    <div class="px-4 py-2 flex justify-end">
      <div class="relative notification-container">
        <div class="relative cursor-pointer" @click="toggleNotifications">
          <!-- Unread Badge -->
          <span
            v-if="notificationStore.unreadCount > 0"
            class="absolute -top-1 -right-1 text-[10px] bg-main px-2 py-1 rounded-full text-white animate-pulse font-medium"
          >
            {{ notificationStore.unreadCount }}
          </span>

          <!-- Bell Icon -->
          <div
            :class="
              notificationStore.unreadCount > 0
                ? 'border-2 border-main/30'
                : 'border border-gray'
            "
            class="bg-white shadow-sm p-2.5 rounded-full flex justify-center items-center hover:shadow-md transition-all"
          >
            <svg
              class="w-5 h-5"
              :class="
                notificationStore.unreadCount > 0
                  ? 'text-main'
                  : 'text-gray-600'
              "
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
        </div>

        <!-- Notifications Dropdown -->
        <div
          v-if="showNotifications"
          class="z-[100] my-4 w-[400px] max-w-[calc(100vw-2rem)] text-base list-none rounded-2xl shadow-xl border border-gray absolute top-12 right-0 overflow-hidden bg-white"
        >
          <!-- Header -->
          <div class="px-4 py-3 bg-main border-b border-main">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-semibold text-white">Notifications</h3>
              <div class="flex items-center gap-2">
                <span
                  v-if="notificationStore.unreadCount > 0"
                  class="text-xs text-main bg-white px-2 py-1 rounded-full font-medium"
                >
                  {{ notificationStore.unreadCount }} new
                </span>
                <button
                  v-if="notificationStore.unreadCount > 0"
                  @click.stop="markAllAsRead"
                  class="text-xs text-white hover:text-white/80 underline"
                >
                  Mark all read
                </button>
              </div>
            </div>
          </div>

          <!-- Loading -->
          <div
            v-if="notificationStore.loading"
            class="px-4 py-8 text-center bg-white"
          >
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-main mx-auto"
            ></div>
            <p class="text-xs text-gray-600 mt-3">Loading notifications...</p>
          </div>

          <!-- Notifications List -->
          <div
            v-else-if="notificationStore.unreadNotifications.length > 0"
            class="max-h-96 overflow-y-auto"
          >
            <div
              v-for="notification in notificationStore.unreadNotifications"
              :key="notification._id"
              @click="handleNotificationClick(notification)"
              class="px-4 py-3 hover:bg-gray/50 cursor-pointer border-b border-gray transition-colors"
              :class="{ 'bg-main/5': !notification.isRead }"
            >
              <div class="flex items-start gap-3">
                <!-- Avatar Icon -->
                <div
                  class="flex-shrink-0 w-10 h-10 bg-main rounded-full flex items-center justify-center text-white font-bold text-sm"
                >
                  {{
                    notification.data.senderName?.charAt(0).toUpperCase() || "?"
                  }}
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-black">
                    {{ notification.data.senderName }}
                  </p>
                  <p class="text-sm text-gray-600 truncate mt-0.5">
                    {{ notification.data.message }}
                  </p>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ formatNotificationTime(notification.createdAt) }}
                  </p>
                </div>

                <!-- Unread Indicator -->
                <div v-if="!notification.isRead" class="flex-shrink-0 pt-2">
                  <div class="w-2.5 h-2.5 bg-main rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="px-4 py-12 text-center bg-white">
            <div class="text-gray-400 mb-3">
              <svg
                class="w-16 h-16 mx-auto text-gray"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"
                />
              </svg>
            </div>
            <p class="text-sm font-medium text-black">No new notifications</p>
            <p class="text-xs text-gray-600 mt-1">You're all caught up!</p>
          </div>

          <!-- Footer - View All -->
          <div class="px-4 py-3 bg-gray/30 text-center border-t border-gray">
            <button
              @click="goToChat"
              class="text-sm text-main hover:text-main/80 font-semibold transition-colors"
            >
              View all in Chat →
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar for notifications */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #ff6300;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #e55800;
}
</style>
