import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { chatApiService } from "../api/chat";

export const useNotificationStore = defineStore("notification", () => {
  // State
  const notifications = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Getters
  const unreadCount = computed(() => {
    return notifications.value.filter((n) => !n.isRead).length;
  });

  const unreadNotifications = computed(() => {
    return notifications.value.filter((n) => !n.isRead);
  });

  const allNotifications = computed(() => {
    return notifications.value;
  });

  // Actions
  async function fetchUnreadNotifications() {
    if (loading.value) {
      console.log("⚠️ Already fetching notifications");
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      console.log("📥 Fetching unread notifications...");
      const response = await chatApiService.getUnreadNotifications();

      if (response.success) {
        notifications.value = response.notifications;
        console.log(`✅ Loaded ${response.count} unread notifications`);
      }
    } catch (err) {
      console.error("❌ Fetch notifications error:", err);
      error.value = err.message || "Failed to load notifications";
    } finally {
      loading.value = false;
    }
  }

  async function fetchAllNotifications(page = 1, limit = 20) {
    loading.value = true;
    error.value = null;

    try {
      const response = await chatApiService.getAllNotifications(page, limit);

      if (response.success) {
        notifications.value = response.notifications;
        console.log(`✅ Loaded ${response.notifications.length} notifications`);
        return response.pagination;
      }
    } catch (err) {
      console.error("❌ Fetch all notifications error:", err);
      error.value = err.message || "Failed to load notifications";
    } finally {
      loading.value = false;
    }
  }

  async function markAsRead(notificationId) {
    try {
      const response = await chatApiService.markNotificationAsRead(
        notificationId,
      );

      if (response.success) {
        // Update local state
        const notification = notifications.value.find(
          (n) => n._id === notificationId,
        );
        if (notification) {
          notification.isRead = true;
          notification.readAt = new Date();
        }
        console.log("✅ Notification marked as read");
      }
    } catch (err) {
      console.error("❌ Mark as read error:", err);
      throw err;
    }
  }

  async function markAllAsRead() {
    try {
      const response = await chatApiService.markAllNotificationsAsRead();

      if (response.success) {
        // Update all notifications to read
        notifications.value.forEach((n) => {
          n.isRead = true;
          n.readAt = new Date();
        });
        console.log(`✅ ${response.count} notifications marked as read`);
      }
    } catch (err) {
      console.error("❌ Mark all as read error:", err);
      throw err;
    }
  }

  function addNotification(notification) {
    // Check if already exists
    const exists = notifications.value.some((n) => n._id === notification._id);
    if (!exists) {
      notifications.value.unshift(notification);
      console.log("📬 New notification added:", notification._id);
    }
  }

  function reset() {
    console.log("🔄 Resetting notification store");
    notifications.value = [];
    error.value = null;
    loading.value = false;
  }

  return {
    // State
    notifications,
    loading,
    error,

    // Getters
    unreadCount,
    unreadNotifications,
    allNotifications,

    // Actions
    fetchUnreadNotifications,
    fetchAllNotifications,
    markAsRead,
    markAllAsRead,
    addNotification,
    reset,
  };
});
