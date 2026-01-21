import { defineStore } from "pinia";
import { ref, computed, nextTick } from "vue";
import { socketService } from "../api/socket";
import { useChatStore } from "./chat";
import { useAuthStore } from "./auth";
import { useNotificationStore } from "./notification";

export const useSocketStore = defineStore("socket", () => {
  const socket = ref(null);
  const connected = ref(false);
  const typingUsersMap = ref(new Map());

  let isConnecting = ref(false);

  const isConnected = computed(() => {
    return socket.value?.connected || false;
  });

  // stores/socket.js
  function connect() {
    if (isConnecting.value || connected.value) {
      console.log("⚠️ Socket already connecting/connected");
      return;
    }

    const authStore = useAuthStore();

    // Get token from multiple sources
    const tokenFromStore = authStore.token;
    const tokenFromLocalStorage = localStorage.getItem("token");

    console.log("🔍 Token check:");
    console.log("  - From store:", !!tokenFromStore, tokenFromStore?.length);
    console.log(
      "  - From localStorage:",
      !!tokenFromLocalStorage,
      tokenFromLocalStorage?.length,
    );
    console.log("  - Tokens match:", tokenFromStore === tokenFromLocalStorage);

    const token = tokenFromStore || tokenFromLocalStorage;

    if (!token) {
      console.error("❌ No token available for socket connection");
      return;
    }

    // Verify this token works with HTTP API first
    console.log("🔍 Testing token with HTTP API before socket connection...");

    isConnecting.value = true;
    console.log("🔌 Connecting to socket with token...");

    try {
      socket.value = socketService.connect(token);
      setupEventListeners();

      // ... rest of code
    } catch (error) {
      console.error("❌ Failed to connect socket:", error);
      isConnecting.value = false;
    }
  }

  function setupEventListeners() {
    const chatStore = useChatStore();
    const authStore = useAuthStore();
    const notificationStore = useNotificationStore();

    // ✅ ADD THIS - Handle pending notifications
    socketService.on("pending_notifications", (data) => {
      console.log(`📬 Received ${data.count} pending notifications`);
      console.log("Notifications:", data.notifications);

      // ✅ Add notifications to store
      data.notifications.forEach((notification) => {
        notificationStore.addNotification(notification);
      });

      // Refresh conversations to show unread counts and new messages
      console.log(
        "🔄 Refreshing conversations due to pending notifications...",
      );
      chatStore.fetchConversations();

      // Show browser notification
      if (data.count > 0) {
        showNotification(
          `You have ${data.count} new message${data.count > 1 ? "s" : ""}`,
        );
      }
    });

    // ✅ ADD THIS - Listen for new conversations
    if (authStore.user?.id && authStore.user?.type) {
      socketService.listenToPersonalRoom(
        authStore.user.id,
        authStore.user.type,
        (data) => {
          console.log("📨 Personal room event received:", data);

          if (data.event === "new_conversation") {
            console.log("🆕 New conversation created:", data.conversation);

            // Add to conversation list
            chatStore.addNewConversation(data.conversation);

            // ✅ Join the new conversation room
            joinConversation(data.conversation._id);

            // Show notification (optional)
            showNotification(data.message);
          }
        },
      );
    }

    // New message
    socketService.on("new_message", (data) => {
      console.log("📨 New message received:", data.message._id);
      chatStore.addMessage(data.message);
    });

    // Message sent confirmation
    socketService.on("message_sent", (data) => {
      console.log("✅ Message sent confirmed:", data.message._id);
    });

    // Messages read
    socketService.on("messages_read", (data) => {
      console.log("✓ Messages marked as read");
      chatStore.updateMessageReadStatus(
        data.conversationId,
        data.userId,
        data.userName,
      );
    });

    socketService.on("connect", () => {
      console.log("✅ Socket connected event fired:", socket.value.id);

      // ✅ Use nextTick to ensure Vue reactivity updates
      nextTick(() => {
        connected.value = true;
        isConnecting.value = false;
        console.log(
          "📊 Connection state updated: connected =",
          connected.value,
        );

        // ✅ Small delay before joining conversations
        setTimeout(() => {
          socketService.joinConversations();
        }, 100);
      });
    });

    // Typing indicator
    socketService.on("user_typing", (data) => {
      const key = data.conversationId;
      if (data.isTyping) {
        if (!typingUsersMap.value.has(key)) {
          typingUsersMap.value.set(key, []);
        }
        const users = typingUsersMap.value.get(key);
        if (!users.includes(data.userName)) {
          users.push(data.userName);
        }
      } else {
        if (typingUsersMap.value.has(key)) {
          const users = typingUsersMap.value.get(key);
          const index = users.indexOf(data.userName);
          if (index > -1) {
            users.splice(index, 1);
          }
        }
      }
    });

    // User status
    socketService.on("user_status", (data) => {
      console.log(
        `👤 User ${data.userName} is ${data.isOnline ? "online" : "offline"}`,
      );
      chatStore.updateUserStatus(data.userId, data.isOnline);
    });

    // Error
    socketService.on("error", (error) => {
      console.error("Socket error:", error);
    });
  }

  // ✅ ADD THIS - Show browser notification
  function showNotification(message) {
    // Check if browser supports notifications
    if (!("Notification" in window)) {
      console.log("❌ Browser doesn't support notifications");
      return;
    }

    // Request permission
    if (Notification.permission === "granted") {
      new Notification("New Conversation", {
        body: message,
        icon: "../../public/web-logo.png",
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification("New Conversation", {
            body: message,
            icon: "../../public/web-logo.png",
          });
        }
      });
    }
  }

  function disconnect() {
    console.log("🔌 Disconnecting socket...");
    socketService.disconnect();
    socket.value = null;
    connected.value = false;
    isConnecting.value = false;
    typingUsersMap.value.clear();
  }

  function sendMessage(conversationId, message) {
    if (!connected.value) {
      console.error("❌ Cannot send message: Socket not connected");
      throw new Error("Socket not connected");
    }

    console.log("📤 Sending message...");
    socketService.sendMessage(conversationId, message);
  }

  function startTyping(conversationId) {
    if (connected.value) {
      socketService.startTyping(conversationId);
    }
  }

  function stopTyping(conversationId) {
    if (connected.value) {
      socketService.stopTyping(conversationId);
    }
  }

  function joinConversation(conversationId) {
    if (connected.value) {
      socketService.joinConversation(conversationId);
    }
  }

  function getTypingUsers(conversationId) {
    return typingUsersMap.value.get(conversationId) || [];
  }

  function markAsRead(conversationId, messageIds = null) {
    if (!connected.value) {
      console.warn("⚠️ Cannot mark as read: Socket not connected");
      return;
    }

    console.log("✓ Marking messages as read:", conversationId);
    socketService.markAsRead(conversationId, messageIds);
  }

  return {
    socket,
    connected,
    isConnected,
    isConnecting,
    connect,
    disconnect,
    sendMessage,
    startTyping,
    stopTyping,
    joinConversation,
    getTypingUsers,
    markAsRead,
    showNotification,
  };
});
