<template>
  <div>
    <div class="h-screen flex flex-col bg-white">
      <!-- Loading State -->
      <div
        v-if="chatStore.loading"
        class="flex-1 flex items-center justify-center"
      >
        <div class="text-center">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-main mx-auto mb-4"
          ></div>
          <p class="text-gray-600">Loading conversations...</p>
        </div>
      </div>

      <!-- Error State -->
      <div
        v-else-if="chatStore.error"
        class="flex-1 flex items-center justify-center"
      >
        <div class="text-center px-4">
          <div class="text-red text-4xl mb-4">⚠️</div>
          <p class="text-black font-semibold mb-2">Failed to load chat</p>
          <p class="text-gray-600 mb-4">{{ chatStore.error }}</p>
          <button
            @click="retry"
            class="px-6 py-2 bg-main text-white rounded-full hover:bg-main/90"
          >
            Retry
          </button>
        </div>
      </div>

      <!-- Main Chat UI -->
      <template v-else>
        <!-- Mobile/Desktop Layout -->
        <div class="flex-1 flex overflow-hidden">
          <!-- Conversation List (Mobile: full screen, Desktop: sidebar) -->
          <div
            class="w-full md:w-96 flex flex-col bg-white border-r border-gray"
            :class="chatStore.currentConversation ? 'hidden md:flex' : 'flex'"
          >
            <!-- Header -->
            <div class="bg-main px-4 py-6">
              <div class="flex items-center justify-between mb-4">
                <button
                  @click="router.back()"
                  class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition"
                >
                  <span class="text-white text-2xl">
                    <ChevronLeftIcon class="w-4 h-4" />
                  </span>
                </button>
                <h1 class="text-xl font-bold text-white">Conversations</h1>
                <button
                  @click="showNewChatModal = true"
                  class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition"
                >
                  <span class="text-white text-2xl">+</span>
                </button>
              </div>

              <!-- Search Bar -->
              <div class="relative">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search conversations..."
                  class="w-full bg-white rounded-full px-5 py-3 text-sm focus:outline-none shadow-md"
                />
                <svg
                  class="w-5 h-5 absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            <!-- Conversations List -->
            <div class="flex-1 overflow-y-auto">
              <!-- Loading -->
              <div
                v-if="chatStore.loading"
                class="p-4 text-center text-gray-600"
              >
                Loading conversations...
              </div>

              <!-- Empty State -->
              <div
                v-else-if="filteredConversations.length === 0"
                class="p-8 text-center"
              >
                <div class="text-gray text-5xl mb-4">💬</div>
                <p class="text-gray-600 text-sm">No conversations found</p>
              </div>

              <!-- Conversation Items -->
              <div v-else>
                <div
                  v-for="conversation in filteredConversations"
                  :key="conversation._id"
                  @click="selectConversation(conversation)"
                  class="p-4 border-b border-gray hover:bg-gray/30 cursor-pointer transition"
                  :class="{
                    'bg-main/5 border-l-4 border-l-main': isSelected(
                      conversation._id,
                    ),
                  }"
                >
                  <div class="flex items-start gap-3">
                    <!-- Avatar with First Letter -->
                    <div
                      class="w-12 h-12 bg-main rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-lg"
                    >
                      {{ getConversationInitials(conversation) }}
                    </div>

                    <!-- Content -->
                    <div class="flex-1 min-w-0">
                      <!-- Name & Time -->
                      <div class="flex items-center justify-between mb-1">
                        <h3 class="text-sm font-semibold text-black truncate">
                          {{ getConversationName(conversation) }}
                        </h3>
                        <span class="text-xs text-gray-600 flex-shrink-0 ml-2">
                          {{ formatConversationTime(conversation.updatedAt) }}
                        </span>
                      </div>

                      <!-- Last Message -->
                      <p class="text-sm text-gray-600 truncate">
                        {{
                          conversation.lastMessage?.message || "No messages yet"
                        }}
                      </p>

                      <!-- Unread Badge -->
                      <div v-if="conversation.unreadCount > 0" class="mt-1">
                        <span
                          class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-main text-white"
                        >
                          {{ conversation.unreadCount }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Chat Window -->
          <div
            class="flex-1 flex flex-col"
            :class="chatStore.currentConversation ? 'flex' : 'hidden md:flex'"
          >
            <ChatWindow v-if="chatStore.currentConversation" />

            <!-- Empty State -->
            <div
              v-else
              class="flex-1 flex items-center justify-center bg-gray/20"
            >
              <div class="text-center px-4">
                <div class="text-gray text-6xl mb-4">💬</div>
                <h3 class="text-xl font-semibold text-black mb-2">
                  Select a conversation
                </h3>
                <p class="text-gray-600 text-sm">
                  Choose a conversation from the list to start chatting
                </p>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- New Chat Modal -->
    <UserList v-if="showNewChatModal" @close="showNewChatModal = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useChatStore } from "../stores/chat";
import { useSocketStore } from "../stores/socket";
import { useAuthStore } from "../stores/auth";
import ChatWindow from "./Chat/ChatWindow.vue";
import UserList from "./Chat/UserList.vue";
import { formatConversationTime } from "../utils/formatDate";
import { useRouter } from "vue-router";
import { ChevronLeftIcon } from "@heroicons/vue/24/outline";

const chatStore = useChatStore();
const socketStore = useSocketStore();
const authStore = useAuthStore();
const router = useRouter();

const searchQuery = ref("");
const showNewChatModal = ref(false);

let mounted = false;

const filteredConversations = computed(() => {
  if (!searchQuery.value) {
    return chatStore.sortedConversations;
  }

  const query = searchQuery.value.toLowerCase();

  return chatStore.sortedConversations.filter((conv) => {
    const name = getConversationName(conv).toLowerCase();
    const lastMessage = conv.lastMessage?.message?.toLowerCase() || "";
    return name.includes(query) || lastMessage.includes(query);
  });
});

function getConversationName(conversation) {
  if (conversation.name) {
    return conversation.name;
  }

  const currentUserId = authStore.user?.id;
  const otherParticipant = conversation.participants.find(
    (p) => p.id != currentUserId,
  );

  return otherParticipant?.name || "Unknown";
}

function getConversationInitials(conversation) {
  const name = getConversationName(conversation);
  // Get first letter of first name
  return name.charAt(0).toUpperCase();
}

function isSelected(conversationId) {
  return chatStore.currentConversation?._id === conversationId;
}

async function selectConversation(conversation) {
  try {
    await chatStore.selectConversation(conversation._id);

    if (socketStore.joinConversation) {
      socketStore.joinConversation(conversation._id);
    }

    if (socketStore.markAsRead) {
      socketStore.markAsRead(conversation._id);
    }
  } catch (error) {
    console.error("❌ Error selecting conversation:", error);
  }
}

onMounted(async () => {
  if (mounted) {
    console.log("⚠️ Component already mounted");
    return;
  }
  mounted = true;

  console.log("🚀 Chat view mounted");

  if ("Notification" in window && Notification.permission === "default") {
    console.log("📢 Requesting notification permission...");
    Notification.requestPermission().then((permission) => {
      console.log("Notification permission:", permission);
    });
  }

  if (!authStore.isAuthenticated) {
    console.error("❌ Not authenticated");
    return;
  }

  try {
    await chatStore.fetchConversations();

    if (!socketStore.connected && !socketStore.isConnecting) {
      console.log("🔌 Connecting socket from Chat.vue...");
      setTimeout(() => {
        socketStore.connect();
      }, 500);
    } else {
      console.log("ℹ️ Socket already connected/connecting");
    }
  } catch (error) {
    console.error("❌ Failed to initialize chat:", error);
  }
});

onBeforeUnmount(() => {
  console.log("🔌 Chat view unmounting");
  mounted = false;
});

async function retry() {
  console.log("🔄 Retrying...");
  chatStore.error = null;
  await chatStore.fetchConversations();
  socketStore.connect();
}
</script>

<style scoped>
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
</style>
