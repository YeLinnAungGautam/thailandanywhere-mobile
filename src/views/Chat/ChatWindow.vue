<template>
  <div class="flex flex-col bg-white chat-wrapper">
    <!-- Chat Header -->
    <div class="bg-main px-4 py-3 md:py-4 flex-shrink-0">
      <div class="flex items-center gap-3">
        <!-- Back Button for Mobile -->
        <button
          @click="closeChat"
          class="md:hidden text-white hover:text-white/80"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <!-- Avatar with First Letter -->
        <div
          class="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 text-main font-bold text-lg"
        >
          {{ conversationInitials }}
        </div>

        <!-- Conversation Info -->
        <div class="flex-1">
          <h2 class="font-semibold text-white text-sm md:text-base">
            {{ conversationName }}
          </h2>
          <p class="text-white/80 text-xs">
            {{ participantCount }} participants
          </p>
        </div>

        <!-- Status Badge -->
        <span
          class="hidden md:inline-flex px-3 py-1 text-xs font-medium rounded-full bg-white/20 text-white"
        >
          {{ conversationTypeLabel }}
        </span>
      </div>
    </div>

    <!-- Messages Container -->
    <div
      ref="messagesContainer"
      class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray/20"
      @scroll="handleScroll"
    >
      <!-- Loading -->
      <div
        v-if="chatStore.messagesLoading"
        class="text-center text-gray-600 py-8"
      >
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-main mx-auto mb-2"
        ></div>
        <p class="text-sm">Loading messages...</p>
      </div>

      <!-- Messages -->
      <div v-else>
        <MessageBubble
          v-for="message in chatStore.currentMessages"
          :key="message._id"
          :message="message"
          :is-own-message="isOwnMessage(message)"
        />
      </div>

      <!-- Typing Indicator -->
      <div
        v-if="typingUsers.length > 0"
        class="flex items-center space-x-2 text-sm text-gray-600"
      >
        <div
          class="bg-white rounded-full px-4 py-2 flex items-center gap-2 shadow-sm"
        >
          <div class="flex space-x-1">
            <span
              class="w-2 h-2 bg-main rounded-full animate-bounce"
              style="animation-delay: 0ms"
            ></span>
            <span
              class="w-2 h-2 bg-main rounded-full animate-bounce"
              style="animation-delay: 150ms"
            ></span>
            <span
              class="w-2 h-2 bg-main rounded-full animate-bounce"
              style="animation-delay: 300ms"
            ></span>
          </div>
          <span class="text-xs"
            >{{ typingUsers.join(", ") }}
            {{ typingUsers.length === 1 ? "is" : "are" }} typing...</span
          >
        </div>
      </div>
    </div>

    <!-- Message Input - Fixed at bottom with safe area -->
    <div class="flex-shrink-0 input-container">
      <MessageInput @send="handleSendMessage" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from "vue";
import { useChatStore } from "../../stores/chat";
import { useSocketStore } from "../../stores/socket";
import { useAuthStore } from "../../stores/auth";
import MessageBubble from "./MessageBubble.vue";
import MessageInput from "./MessageInput.vue";

const chatStore = useChatStore();
const socketStore = useSocketStore();
const authStore = useAuthStore();

const messagesContainer = ref(null);
let scrollTimeout = null; // ADD THIS

const conversation = computed(() => chatStore.currentConversation);

const conversationName = computed(() => {
  if (!conversation.value) return "";

  if (conversation.value.name) {
    return conversation.value.name;
  }

  const currentUserId = authStore.user?.id;
  const otherParticipant = conversation.value.participants.find(
    (p) => p.id != currentUserId,
  );

  return otherParticipant?.name || "Unknown";
});

const conversationInitials = computed(() => {
  return conversationName.value.charAt(0).toUpperCase();
});

const participantCount = computed(() => {
  return conversation.value?.participants?.length || 0;
});

const conversationTypeLabel = computed(() => {
  const type = conversation.value?.type;
  switch (type) {
    case "admin-to-admin":
      return "Direct Message";
    case "admin-group":
      return "Group Chat";
    case "admin-to-user":
      return "User Support";
    default:
      return "Chat";
  }
});

const typingUsers = computed(() => {
  if (!chatStore.currentConversation) return [];
  return socketStore.getTypingUsers(chatStore.currentConversation._id);
});

function isOwnMessage(message) {
  return message.senderId == authStore.user?.id;
}

const isSocketConnected = computed(() => {
  return socketStore.isConnected || socketStore.socket?.connected || false;
});

function closeChat() {
  chatStore.currentConversation = null;
}

function handleSendMessage(message) {
  if (!chatStore.currentConversation) {
    console.error("❌ No conversation selected");
    return;
  }

  console.log("📊 Connection check before sending:");
  console.log("  - socketStore.connected:", socketStore.connected);
  console.log("  - socketStore.isConnected:", socketStore.isConnected);
  console.log("  - socket?.connected:", socketStore.socket?.connected);
  console.log("  - isSocketConnected:", isSocketConnected.value);

  if (!isSocketConnected.value) {
    console.error("❌ Socket not connected, attempting to reconnect...");
    alert("Connection lost. Please wait...");
    socketStore.connect();
    return;
  }

  try {
    socketStore.sendMessage(chatStore.currentConversation._id, message);
    // ADD THIS: Scroll and hide Chrome bar after sending
    setTimeout(() => {
      scrollToBottomAndHideBar();
    }, 100);
  } catch (error) {
    console.error("❌ Failed to send message:", error.message);
    alert("Failed to send message: " + error.message);
  }
}

// REPLACE scrollToBottom function with these two functions:
function scrollToBottomAndHideBar() {
  if (!messagesContainer.value) return;

  // Scroll to bottom
  messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;

  // Trigger a small scroll to hide the Chrome address bar
  setTimeout(() => {
    if (messagesContainer.value) {
      const currentScroll = messagesContainer.value.scrollTop;
      messagesContainer.value.scrollTop = currentScroll - 1;

      setTimeout(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop =
            messagesContainer.value.scrollHeight;
        }
      }, 50);
    }
  }, 50);
}

function scrollToBottom() {
  nextTick(() => {
    scrollToBottomAndHideBar();
  });
}

// ADD THIS NEW FUNCTION:
function handleScroll() {
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }

  scrollTimeout = setTimeout(() => {
    if (messagesContainer.value) {
      const scrollTop = messagesContainer.value.scrollTop;
      const scrollHeight = messagesContainer.value.scrollHeight;
      const clientHeight = messagesContainer.value.clientHeight;

      // If near bottom, trigger hide
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        scrollToBottomAndHideBar();
      }
    }
  }, 150);
}

// ADD THIS NEW FUNCTION:
function forceInitialScroll() {
  setTimeout(() => {
    if (messagesContainer.value) {
      window.scrollTo(0, 1);
      scrollToBottomAndHideBar();
    }
  }, 100);
}

// Fix mobile viewport height for Chrome/Safari
function setVH() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

onMounted(() => {
  setVH();
  forceInitialScroll(); // CHANGE: was scrollToBottom()

  window.addEventListener("resize", setVH);
  window.addEventListener("orientationchange", setVH);

  // Update on keyboard show/hide
  window.visualViewport?.addEventListener("resize", setVH);
  window.visualViewport?.addEventListener("scroll", setVH);

  // ADD THIS: Listen for focus to scroll and hide bar
  window.addEventListener(
    "focus",
    () => {
      setTimeout(scrollToBottomAndHideBar, 300);
    },
    true,
  );
});

onUnmounted(() => {
  window.removeEventListener("resize", setVH);
  window.removeEventListener("orientationchange", setVH);

  window.visualViewport?.removeEventListener("resize", setVH);
  window.visualViewport?.removeEventListener("scroll", setVH);

  // ADD THIS:
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }
});

// Watch for new messages and scroll to bottom
watch(
  () => chatStore.currentMessages.length,
  () => {
    scrollToBottom();
  },
);

// Scroll to bottom when conversation changes
watch(
  () => chatStore.currentConversation,
  () => {
    scrollToBottom();
  },
);
</script>

<style scoped>
.chat-wrapper {
  /* Use multiple fallbacks for maximum compatibility */
  height: 100vh; /* Fallback */
  height: 100dvh; /* Dynamic viewport height (modern browsers) */
  height: calc(var(--vh, 1vh) * 100); /* JS-calculated height */

  /* Prevent address bar from covering content */
  min-height: 100vh;
  min-height: 100dvh;
  min-height: -webkit-fill-available;

  /* Ensure proper positioning */
  position: relative;
  overflow: hidden;
}

/* Ensure input stays at bottom above safe area */
.input-container {
  /* Add padding for safe areas (notch, navigation bars) */
  padding-bottom: env(safe-area-inset-bottom);

  /* Ensure it's always visible */
  position: relative;
  z-index: 10;
  background: white;

  /* Add slight shadow for visual separation */
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

/* Custom scrollbar styles */
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

/* Add smooth scrolling */
.overflow-y-auto {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  /* ADD THESE TWO LINES: */
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
}

/* iOS specific fixes */
@supports (-webkit-touch-callout: none) {
  .chat-wrapper {
    height: -webkit-fill-available;
  }
}
</style>
